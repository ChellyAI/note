# **React组件**

## **有状态组件和无状态组件**

&emsp;&emsp;主要分为了class组件与函数组件，函数组件如下例:
```js
const funcComponent = (props) => {
  const {title} = props;

  return (
    <div>
      {title}
    </div>
  )
}
```

&emsp;&emsp;无状态组件内部没有 `state` ，其执行结果完全依赖于 `props` 的内容。

## **function组件**

&emsp;&emsp; `react-hooks` 让函数组件也能够如同 `class` 组件一样拥有自己的 `state` 等功能。

## **Class组件**

### **PureComponent**

&emsp;&emsp;PureComponent 与 Component 很相似，两者区别在于 PureComponent 以浅层对比 props 和 state 的方式实现了 `shouldComponentUpdate` 函数。

&emsp;&emsp;如果赋予 React 组件相同的 props 和 state，`render` 函数就会渲染相同的内容，那么在某些情况下使用 PureComponent 可提高性能。

**注意：**
