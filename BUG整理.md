## **吸顶梳理**

### 一、BYFlatList

包了一层context；

用useRef保存名为contextData的值，使用createContextDataHelper函数初始化，传入的contentOffsetY为0，因此初始的scrollAnimatedY = new Animated.Value(0)；

contextData.current.stickyInset = props.stickyInset，deeplink中有传入，为{{top: 0}}

windowSize = 301，scrollRef = scrollView = useRef(null)

### 二、BYStickyHeader

入参为style={{

​              position: 'absolute',

​              top: px2dp(store.initData.privilegeGold.price ? 450 : 280),

​              left: 0,

​              right: 0,

​              backgroundColor: '#fff',

​            }}

containerView用useRef初始化，与props一同传入useStickyObserver，获取stickyTransform、onLayout两个变量。

<Animated.View>中，onLayout会触发获取到的onLayout，style是由props的style、z-index：100、stickyTransform三者合为一个数组传入。其children为props的children

### 三、useStickyObserver

拿到的BYScrollContext是BYFlatList给的contextData.current，将一些使用到的scrollAnimatedY等取出来。

调用useStateIfMounted，入参{transform: []}，得到stickyTransform、setStickyTransform

实际执行时，会先触发onLayout函数中调用的measureInWindow函数

measureInWindow函数主要是获取吸顶元素的高度、位置，保存到store里，并且将top值保存到useRef定义的stickyLayoutY中。

然后触发storeObserver，它是useRef传入一个函数的值，在其内，判断scrollType为BYScrollView还是BYFlatList后，先拿stickyLayoutY.current与top值进行比对，top是初始值为stickyInset的top，之后会遍历吸顶列表内其他元素的高度并相加。

如果stickyLayoutY.current大于top，就定义y为其差值。

否则定义y为stickyLayoutY.current。

然后定义一个插值动画

```javascript
const translateY = scrollAnimatedY.interpolate({
  inputRange: [-100, 0, y, y+1],
  outputRange: [100, 0, -y, -y],
})
```

之后调用setStickyTransform，传入对象

```javascript
setStickyTransform({
  transform: [{translateY: translateY}],
});
```

最终整个hooks返回的就是设置好的stickyTransform和onLayout函数。