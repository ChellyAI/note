[官网原文](https://react-1251415695.cos-website.ap-chengdu.myqcloud.com/docs/reconciliation.html)

## **Diffing算法**

&emsp;&emsp;调用 `React` 的 `render` 方法，会创建一棵由 `React` 元素组成的树，当下一次 `state` 或 `props` 更新后，同一个 `render` 方法会返回一棵不同的树。`React` 需要通过两棵树的差别来判断如何有效率的更新 `UI` 以保证当前 `UI` 与最新的树保持同步。

&emsp;&emsp;`React` 在以下两个假设的基础上提出了一套复杂度为 `O(n)` 的启发式算法：
1. 两个不同类型的元素会生成不同的树；
2. 开发者通过添加 `key` 来暗示哪些子元素在不同的渲染下保持稳定。
---
### **比对不同类型的元素**

&emsp;&emsp;**当根节点为不同类型的元素时，`React` 会拆卸原有的树并建立新的树**。拆卸一棵树时，对应的 `DOM` 节点也会被销毁，组件实例将执行 `componentWillUnmount` 方法。建立一棵新的树时，对应的 `DOM` 节点会被创建并插入到 `DOM` 中。组件实例将执行 `componentWillMount` 方法，紧接着 `componentDidMount` 方法，与旧树相关联的 `state` 也会被销毁。

&emsp;&emsp;**根节点变化为不同类型的元素后，其下的组件都会被卸载，状态也会被销毁**，下例中的 `Child` 会被销毁并重新装载。
```HTML
//  old
<div>
  <Child />
</div>

//  new
<span>
  <Child />
</span>
```
---
### **比对同一类型的元素**

&emsp;&emsp;当比对的两个 `React` 元素类型相同，`React` 会保留 `DOM` 节点，仅仅比对并更新有改变的属性，处理完当前节点后，`React`继续对子节点进行递归。

---
### **比对同类型的组件元素**

&emsp;&emsp;当一个组件更新时，组件实例保持不变，`state` 在跨越不同的渲染时保持一致。`React` 将更新该组件实例的 `props` 以跟最新的元素保持一致，并调用该组件实例的 `componentWillReceiveProps` 方法和 `componentWillUpdate` 方法。

---
### **子节点的递归与 key 值**

&emsp;&emsp;试想一下有如下列表：
```html
<ul>
  <li>first</li>
  <li>second</li>
</ul>
```
&emsp;&emsp;当递归 `DOM` 节点的子元素时，`React` 会遍历列表，如果只是在末尾新增了元素，变更产生的差异开销会比较小，例如添加一个 `<li>third</li>`，`React` 先匹配前两个元素对应的树，再插入第三个元素的树。但这种方式下，在列表头部插入元素会非常影响性能，开销会变大。
```HTML
<ul>
  <li>蔡思齐</li>
  <li>雪ノ下雪乃</li>
</ul>

<ul>
  <li>凉宫春日</li>
  <li>蔡思齐</li>
  <li>雪ノ下雪乃</li>
</ul>
```
&emsp;&emsp;此时 `React` 会针对每个子元素进行差异比对，而不是将相同的子树保持下来。

&emsp;&emsp;为了解决以上问题，`React` 支持 `key` 属性，当子元素拥有了 `key` 时，`React` 使用 `key` 来匹配原有树上的子元素以及最新树上的子元素。加上了 `key` 值后，`React` 知道这次差异是新元素的插入和旧元素的移动
```HTML
<ul>
  <li key="husband">蔡思齐</li>
  <li key="wife">雪ノ下雪乃</li>
</ul>

<ul>
  <li key="lover">凉宫春日</li>
  <li key="husband">蔡思齐</li>
  <li key="wife">雪ノ下雪乃</li>
</ul>
```

#### **注意**

&emsp;&emsp;使用数组下标作为 `key` 值，在元素不重新排序的前提下是可行的。但修改了顺序，等于修改了元素的 `key` 值，导致非受控组件的 `state` （例如输入框）可能相互篡改导致无法预期的变动。

&emsp;&emsp;使用不稳定的 `key` 值（例如同故宫 Math.random()生成的）会导致许多组件实例和 `DOM` 节点被不必要地重新创建，可能导致性能下降和子组件中的状态丢失。

DOM-diff过程
- 用JavaScript模拟DOM（虚拟DOM）
- 把虚拟DOM转换为真实的DOM插入页面中（render）
- 如果有事件发生修改了虚拟DOM，则比较两个虚拟DOM树的差异，得到差异对象diff
- 将差异对象应用到真正的DOM上（patch）

