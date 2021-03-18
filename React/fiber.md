# React Fiber

### 前言

&emsp;&emsp;Fiber 是 React 操作 Virtual DOM 前后对比得出需要更新的部分，再去操作真实 DOM 的过程所使用的算法。React 版本16之前的旧算法称为 Stack Reconciler，16之后编写的新算法就叫做 Fiber Reconciler。

&emsp;&emsp;之所以要新写 Fiber，就是因为旧版会有卡顿的现象。卡顿的原因有两个：

1. stack reconciler 采用自顶向下递归，从根组件或 `setState` 后的组件开始，更新整个子树。而递归是无法打断的，如果更新量过大，消耗的时间就会随之增加；
2. 浏览器的渲染线程和 JavaScript 线程是互斥的，所以 JavaScript 线程占据大量时间会让渲染被阻塞。

**小提示**：常规屏幕刷新频率是 60 Hz，如果 JavaScript 线程花大量时间，导致实际刷新频率不到 60 Hz，用户就会感到卡顿。