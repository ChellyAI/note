# Context

&emsp;&emsp;Context 设计目的是**为了共享那些对于一个组件树而言是“全局”的数据**。使用 Context 可以避免通过中间元素传递 props。

[TOC]

## API

### createContext

```javascript
const MyContext = React.createContext(defaultValue);
```

&emsp;&emsp;创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，该组件会从组件树中距离自身最近的那个匹配的 Provider 中读取到**当前**的 context 值。

&emsp;&emsp;只有当组件所处的组件树中没有匹配到 Provider 时，defaultValue 才会生效。（注意：将 undefined 传递给 Provider 的 value 时，defaultValue 不会生效。这表明只要有值，就会导致 defaultValue 失效）。

### Context.Provider

```javascript
<MyContext.Provider value={xxx}>
```

&emsp;&emsp;每个 Context 对象都有一个 Provider 组件，它允许其他组件订阅 context 的变化。

&emsp;&emsp;Provider 有一个 value 属性，用于传递给消费组件。一个 Provider 可以有多个消费组件，多个 Provider 也可以嵌套使用，但内层会覆盖外层的 value。

&emsp;&emsp;**当 Provider 的 value 发生变化时，它内部的所有消费组件都会重新渲染。**检测是否有变化，使用的算法是 [Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)。（注意：传递一个对象作为 value 时，检测变化的方式会有一些问题）

### Class.contextType

&emsp;&emsp;挂载到 class 上的 contextType 属性会被重新赋值为一个由 createContext 创建的 Context 对象。此属性能让消费组件使用 this.context 来获取最近 Context 上的值。任何生命周期、包括 render 函数中都可以访问到它。

### Context.Consumer

```javascript
<MyContext.Consumer>
  {value => (<div>xxx</div>)}
</MyContext.Consumer>
```

&emsp;&emsp;此组件让函数组件可以订阅 context。

### useContext

```javascript
const value = useContext(MyContext);
```

&emsp;&emsp;useContext 接收一个 Context 对象（即 createContext 的返回值）并返回该 context 的当前 value。value 是由上层组件中距离当前组件最近的 Provider 的 value 决定的。