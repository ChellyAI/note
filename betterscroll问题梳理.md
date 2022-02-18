作用：是否使用 CSS3 transition 做动画，若为 false，则使用 requestAnimationFrame 做动画。

1. core/src/Options.ts中给出 useTransition 属性；
2. core/src/animater/index.ts 的 createAnimater 函数中根据 useTransition，确定使用 Transition 还是 Animation 生成实例

```javascript
new Transition(
  element,
  translater,
  animaterOptions as {
    probeType: number
  }
)

or

new Animation(
  element,
  translater,
  animaterOptions as {
    probeType: number
  }
)
```

3、Transition类与Animation类都基于Base类

4、core/src/scroller/Scroller.ts 中，构造函数使用了 createAnimater 函数，定义了 actions，而 actions 又通过 ScrollerActions 生成实例

```javascript
this.animater = createAnimater(this.content, this.translater, this.options);

this.actions = new ScrollerActions(
  this.scrollBehaviorX,
  this.scrollBehaviorY,
  this.actionsHandler,
  this.animater,
  this.options
)

//	ScrollerActions
handleStart(e: TouchEvent) {
  this.animater.doStop();
}

handleMove(deltaX: number, deltaY: number, e: TouchEvent) {
  if (this.contentMoved && positionChanged) {
    this.animater.translate({
      x: newX,
      y: newY,
    })
  }
}

handleEnd(e: TouchEvent) {
  this.animater.translate(currentPos);
}
```

5、Base类中给了 translate 方法，使用的是 Scroller.ts 中，调用 Translater 类生成的实例，实例的 translate 方法，使用了通过公共类 EventEmiter 生成的实例 hooks 的 trigger 方法

```javascript
translate(endPoint: TranslaterPoint) {
  this.translater.translate(endPoint);
}

//	core/src/translater/index.ts
class Translater {
  translate(point: TranslaterPoint) {
    let transformStyle = [] as string[]
    Object.keys(point).forEach((key) => {
      if (!translaterMetaData[key]) {
        return
      }
      const transformFnName = translaterMetaData[key][0]
      if (transformFnName) {
        const transformFnArgUnit = translaterMetaData[key][1]
        const transformFnArg = point[key]
        transformStyle.push(
          `${transformFnName}(${transformFnArg}${transformFnArgUnit})`
        )
      }
    })
    this.hooks.trigger(
      this.hooks.eventTypes.beforeTranslate,
      transformStyle,
      point
    )
    this.style[style.transform as any] = transformStyle.join(' ')
    this.hooks.trigger(this.hooks.eventTypes.translate, point)
  }
}

//	Scroller
this.hooks = new EventEmitter([
  'beforeStart',
  'beforeMove',
  'beforeScrollStart',
  'scrollStart',
  'scroll',
  'beforeEnd',
  'scrollEnd',
  'resize',
  'touchEnd',
  'end',
  'flick',
  'scrollCancel',
  'momentum',
  'scrollTo',
  'minDistanceScroll',
  'scrollToElement',
  'beforeRefresh',
])

//	EventEmiter
class EventEmiter {
  trigger(type: string, ...args: any[]) {
    //	some code
  }
}
```

6、对比 Animation 与 Transition 的 doStop 方法，两者的区别是，当处于 transition 状态、或者处于 requestFrameAnimation 状态，Transition 会调用 this.transitionTime() 和 this.translate({x, y}) 函数

```javascript
//	Animation
doStop(): boolean {
  const pending = this.pending
  this.setForceStopped(false)
  this.setCallStop(false)
  // still in requestFrameAnimation
  if (pending) {
    this.setPending(false)
    cancelAnimationFrame(this.timer)
    const pos = this.translater.getComputedPosition()
    this.setForceStopped(true)
    this.setCallStop(true)

    this.hooks.trigger(this.hooks.eventTypes.forceStop, pos)
  }
  return pending
}

//	Transition
doStop(): boolean {
  const pending = this.pending
  this.setForceStopped(false)
  this.setCallStop(false)
  // still in transition
  if (pending) {
    this.setPending(false)
    cancelAnimationFrame(this.timer)
    const { x, y } = this.translater.getComputedPosition()

    this.transitionTime()
    this.translate({ x, y })
    this.setForceStopped(true)
    this.setCallStop(true)
    this.hooks.trigger(this.hooks.eventTypes.forceStop, { x, y })
  }
  return pending
}
```

