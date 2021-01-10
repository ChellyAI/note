# Hook

### **useEffect**

&emsp;&emsp;<font color="red">**useEffect Hook 可以看作 componentDidMount、componentDidUpdate 和 componentWillUnmount 这三个函数的组合**</font>

&emsp;&emsp;第二个参数是一个数组，数组里的参数会用于比较前一次渲染和后一次渲染，如果所有参数都相等，则跳过此次 `effect` ，实现性能的优化。

&emsp;&emsp;如果想只执行一次（仅在组件挂载和卸载时执行），可以传递一个空数组，等于告诉 `React` 不依赖于 `props` 或 `state` 中的任何值，所以它不用重复执行。

---
### **useCallback 和 useMemo**

&emsp;&emsp;`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

---
### **useRef**

```js
const refContainer = React.useRef(initialValue);
```
&emsp;&emsp;`useRef` 返回一个可变的 ref 对象，将初始化传入的参数(initialValue)作为它的 **.current** 属性。

&emsp;&emsp;返回的 ref 对象在组件的整个生命周期内保持不变。

---
### **useLayoutEffect**

&emsp;&emsp;其函数传参与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前， `useLayoutEffect` 内部的更新计划将被同步刷新。

---
### **规则**

<font color="red">**只在对顶层使用 Hook**</font>

&emsp;&emsp;React 靠的是 Hook 调用的顺序来知道每个 state 对应的是哪个 useState。例如：
```js
//  首次渲染
useState('caisiqi') //  使用 caisiqi 初始化变量名为 name 的 state
useEffect(handleChange) //  添加 effect 以操作
useState('god') //  使用 god 初始化变量名为 xxx 的 state
useEffect(handleUpdate) //  添加 effect 以更新某些东西

//  二次渲染
useState('caisiqi') //  读取变量名为 name 的 state（参数被忽略）
useEffect(handleChange) //  替换操作 change 的 effect
useState('god') //  读取变量名为 xxx 的 state（参数被忽略）
useEffect(handleUpdate) //  替换更新的 effect
```
&emsp;&emsp;只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 进行关联。

&emsp;&emsp;假如在外面使用了 `if` 判断，导致第二次渲染跳过了 Hook，Hook 的调用顺序发生了改变:
```js
useState('caisiqi') //  读取变量名为 name 的 state（参数被忽略）
//  useEffect(handleChange) //  此 hook 被忽略
useState('god') //  读取变量名为 xxx 的 state 失败
useEffect(handleUpdate) //  替换更新的 effect 失败
```
&emsp;&emsp;React 不知道第二个 useState 的 Hook 应该返回什么。React 会以为在该组件中第二个 Hook 的调用像上次的渲染一样，对应的是 handleChange 的 effect，但并非如此。从这里开始，后面的 Hook 调用都被提前执行，导致 bug 产生。
