# React Fiber

### 前言

&emsp;&emsp;Fiber 是 React 操作 Virtual DOM 前后对比得出需要更新的部分，再去操作真实 DOM 的过程所使用的算法。React 版本16之前的旧算法称为 Stack Reconciler，16之后编写的新算法就叫做 Fiber Reconciler。

&emsp;&emsp;之所以要新写 Fiber，就是因为旧版会有卡顿的现象。卡顿的原因有两个：

1. stack reconciler 采用自顶向下递归，从根组件或 `setState` 后的组件开始，更新整个子树。而递归是无法打断的，如果更新量过大，消耗的时间就会随之增加；
2. 浏览器的渲染线程和 JavaScript 线程是互斥的，所以 JavaScript 线程占据大量时间会让渲染被阻塞。

**小提示**：常规屏幕刷新频率是 60 Hz，如果 JavaScript 线程花大量时间，导致实际刷新频率不到 60 Hz，用户就会感到卡顿。

&emsp;&emsp;因此，reconciliation（调和） 的过程需要考虑如下问题：

1. 并不是所有的 state 更新都需要立即显示出来，比如屏幕以外的部分；
2. 并不是所有的更新优先级都相同，例如用户输入的响应优先级比通过请求填充内容的响应优先级更高；
3. 某些情况下，高优先级的操作应该要能够打断低优先级的操作执行。

### 浏览器的应对

&emsp;&emsp;抛开 React Reconciliation 过程卡顿的情况，浏览器自身发展过程中也更新了一些措施来应对：

- requestAnimationFrame
- requestIdleCallback
- web worker
- IntersectionObserver

&emsp;&emsp;它们分别称为浏览器层面的帧数控制调用、闲时调用、多线程调用、进入可视区调用。

&emsp;&emsp;`requestAnimationFrame`在动画中经常用到，