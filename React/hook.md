

### useEffect

&emsp;&emsp;第二个参数是一个数组，数组里的参数会用于比较前一次渲染和后一次渲染，如果所有参数都相等，则跳过此次 `effect` ，实现性能的优化。

&emsp;&emsp;如果想只执行一次（仅在组件挂载和卸载时执行），可以传递一个空数组，等于告诉 `React` 不依赖于 `props` 或 `state` 中的任何值，所以它不用重复执行。

### useCallback 和 useMemo

&emsp;&emsp;`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。
