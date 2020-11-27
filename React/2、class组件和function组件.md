## **React组件**

### **有状态组件和无状态组件**

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


### **function组件**

&emsp;&emsp; `react-hooks` 让函数组件也能够如同 `class` 组件一样拥有自己的 `state` 等功能。
