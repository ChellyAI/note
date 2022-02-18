## RN动画源码排查记录

#### JS逻辑梳理

动画在``Animated.event``函数中使用了``useNativeDriver: true``。查看声明文件有：

```javascript
export function event<T>(argMapping: Array<Mapping | null>, config?:EventConfig<T>): (...args: any[]) => void;
```

RN源码的Libraries中，Animated/Animated.js文件里，引用了AnimatedImplementation.js

```javascript
//	AnimatedImplamentation.js
const {AnimatedEvent} = require('./AnimatedEvent')

//	可知event主要是new了一个AnimatedEvent实例
const event = function(argMapping: $ReadOnlyArray<?Mapping>, config: EventConfig): any {
  const animatedEvent = new AnimatedEvent(argMapping, config);
  
  if (animatedEvent.__isNative) {
    return animatedEvent;
  }
  else {
    return animatedEvent.__getHandler();
  }
}
```

查看AnimatedEvent.js，使用构造函数时将config中的``useNativeDriver``保存到了``this.__isNative``。在调用``this.__getHandler``函数时，根据此属性值作了判断，返回了对``this.__callListeners``的调用。

```javascript
class AnimatedEvent {
  _argMapping: $ReadOnlyArray<?Mapping>;
  _listeners: Array<Function> = [];
  _callListeners: Function;
  _attachedEvent: ?{detach: () => void, ...};
  __isNative: boolean;

  constructor(argMapping: $ReadOnlyArray<?Mapping>, config: EventConfig) {
    this._argMapping = argMapping;

    if (config == null) {
      console.warn('Animated.event now requires a second argument for options');
      config = {useNativeDriver: false};
    }

    if (config.listener) {
      this.__addListener(config.listener);
    }
    this._callListeners = this._callListeners.bind(this);
    this._attachedEvent = null;
    this.__isNative = shouldUseNativeDriver(config);
  }

  __addListener(callback: Function): void {
    this._listeners.push(callback);
  }

  __removeListener(callback: Function): void {
    this._listeners = this._listeners.filter(listener => listener !== callback);
  }

  __attach(viewRef: any, eventName: string) {
    invariant(
      this.__isNative,
      'Only native driven events need to be attached.',
    );

    this._attachedEvent = attachNativeEvent(
      viewRef,
      eventName,
      this._argMapping,
    );
  }

  __detach(viewTag: any, eventName: string) {
    invariant(
      this.__isNative,
      'Only native driven events need to be detached.',
    );

    this._attachedEvent && this._attachedEvent.detach();
  }

  __getHandler(): any | ((...args: any) => void) {
    if (this.__isNative) {
      if (__DEV__) {
        let validatedMapping = false;
        return (...args: any) => {
          if (!validatedMapping) {
            validateMapping(this._argMapping, args);
            validatedMapping = true;
          }
          this._callListeners(...args);
        };
      } else {
        return this._callListeners;
      }
    }

    let validatedMapping = false;
    return (...args: any) => {
      if (__DEV__ && !validatedMapping) {
        validateMapping(this._argMapping, args);
        validatedMapping = true;
      }

      const traverse = (recMapping, recEvt) => {
        if (recMapping instanceof AnimatedValue) {
          if (typeof recEvt === 'number') {
            recMapping.setValue(recEvt);
          }
        } else if (recMapping instanceof AnimatedValueXY) {
          if (typeof recEvt === 'object') {
            traverse(recMapping.x, recEvt.x);
            traverse(recMapping.y, recEvt.y);
          }
        } else if (typeof recMapping === 'object') {
          for (const mappingKey in recMapping) {
            /* $FlowFixMe[prop-missing] (>=0.120.0) This comment suppresses an
             * error found when Flow v0.120 was deployed. To see the error,
             * delete this comment and run Flow. */
            traverse(recMapping[mappingKey], recEvt[mappingKey]);
          }
        }
      };
      this._argMapping.forEach((mapping, idx) => {
        traverse(mapping, args[idx]);
      });

      this._callListeners(...args);
    };
  }

  _callListeners(...args: any) {
    this._listeners.forEach(listener => listener(...args));
  }
}
```

在``__attach``函数中使用了``attachNativeEvent``。

```javascript
function attachNativeEvent(
  viewRef: any,
  eventName: string,
  argMapping: $ReadOnlyArray<?Mapping>,
): {detach: () => void} {
  // Find animated values in `argMapping` and create an array representing their
  // key path inside the `nativeEvent` object. Ex.: ['contentOffset', 'x'].
  const eventMappings = [];

  const traverse = (value, path) => {
    if (value instanceof AnimatedValue) {
      value.__makeNative();

      eventMappings.push({
        nativeEventPath: path,
        animatedValueTag: value.__getNativeTag(),
      });
    } else if (value instanceof AnimatedValueXY) {
      traverse(value.x, path.concat('x'));
      traverse(value.y, path.concat('y'));
    } else if (typeof value === 'object') {
      for (const key in value) {
        traverse(value[key], path.concat(key));
      }
    }
  };

  invariant(
    argMapping[0] && argMapping[0].nativeEvent,
    'Native driven events only support animated values contained inside `nativeEvent`.',
  );

  // Assume that the event containing `nativeEvent` is always the first argument.
  traverse(argMapping[0].nativeEvent, []);

  const viewTag = ReactNative.findNodeHandle(viewRef);
  if (viewTag != null) {
    eventMappings.forEach(mapping => {
      NativeAnimatedHelper.API.addAnimatedEventToView(
        viewTag,
        eventName,
        mapping,
      );
    });
  }

  return {
    detach() {
      if (viewTag != null) {
        eventMappings.forEach(mapping => {
          NativeAnimatedHelper.API.removeAnimatedEventFromView(
            viewTag,
            eventName,
            // $FlowFixMe[incompatible-call]
            mapping.animatedValueTag,
          );
        });
      }
    },
  };
}
```

经过对比可知，是否使用原生动画的区别在于，用js是递归实现，不停调用动画的``setValue()``来设置元素属性；用原生驱动，则将事件定义好后，传入``NativeAnimatedHelper.API.addAnimatedEventToView()``。

``NativeAnimatedHelper``中根据操作系统，iOS与Android分别引用NativeAnimatedTurboModule.js、NativeAnimatedModule.js。

在NativeAnimatedModule.js中，定义了接口类型``Spec``，返回一个``TurboModuleRegistry.get``函数执行后的``Spec``。该``get``函数的入参``name``为``NativeAnimatedModule``。

```javascript
function requireModule<T: TurboModule>(name: string): ?T {
  // Bridgeless mode requires TurboModules
  if (global.RN$Bridgeless !== true) {
    // Backward compatibility layer during migration.
    const legacyModule = NativeModules[name];
    if (legacyModule != null) {
      return ((legacyModule: $FlowFixMe): T);
    }
  }

  if (turboModuleProxy != null) {
    const module: ?T = turboModuleProxy(name);
    return module;
  }

  return null;
}

export function get<T: TurboModule>(name: string): ?T {
  return requireModule<T>(name);
}
```

以上逻辑，在Animated组件的createAnimatedComponent.js文件中，定义的``AnimatedComponent``类的``ComponentDidMount``生命周期中，通过``this.__attachNativeEvents()``执行了上文中提到的``__attach``函数。

```javascript
class AnimatedComponent extends React.Component<Object> {
  _attachNativeEvents() {
    const scrollableNode = this._component?.getScrollableNode
    	? this._component.getScrollableNode()
    	: this._component;
    
    for (const key in this.props) {
      const prop = this.props[key];
      
      if (prop instanceof AnimatedEvent && prop.__isNative) {
        prop.__attach(scrollableNode, key);
        this._eventDetachers.push(() => prop.__detach(scrollableNode, key));
      }
    }
  }
  
  componentDidMount() {
    if (this._invokeAnimatedPropsCallbackOnMount) {
      this._invokeAnimatedPropsCallbackOnMount = false;
      this._animatedPropsCallback();
    }

    this._propsAnimated.setNativeView(this._component);
    this._attachNativeEvents();
    this._markUpdateComplete();
  }
}
```

#### 原生逻辑

在ReactAndroid的animated模块下，NativeAnimatedModule.java文件中，定义了``NativeAnimatedModule``类，有``addAnimatedEventToView``方法：

```java
  public void addAnimatedEventToView(
      final double viewTagDouble, final String eventName, final ReadableMap eventMapping) {
    final int viewTag = (int) viewTagDouble;
    if (ANIMATED_MODULE_DEBUG) {
      FLog.d(
          NAME,
          "queue addAnimatedEventToView: "
              + viewTag
              + " eventName: "
              + eventName
              + " eventMapping: "
              + eventMapping.toHashMap().toString());
    }

    initializeLifecycleEventListenersForViewTag(viewTag);

    addOperation(
        new UIThreadOperation() {
          @Override
          public void execute(NativeAnimatedNodesManager animatedNodesManager) {
            if (ANIMATED_MODULE_DEBUG) {
              FLog.d(
                  NAME,
                  "execute addAnimatedEventToView: "
                      + viewTag
                      + " eventName: "
                      + eventName
                      + " eventMapping: "
                      + eventMapping.toHashMap().toString());
            }
            animatedNodesManager.addAnimatedEventToView(viewTag, eventName, eventMapping);
          }
        });
  }
```

一是为指定的ViewTag初始化生命周期事件监听，二是新建一个UI线程操作实例，操作内容即动画，再将这个UI线程操作添加到操作队列中。