## 目录
- [Iterator](#Iterator)
- [for-of](#forof)
- [Set](#set)
- [Map](#map)
---
## <a id='Iterator'>Iterator</a>
&emsp;&emsp;

---
## <a id='forof'>for-of</a>

&emsp;&emsp;ES6借鉴其他语言（C++、Java、C#、Python）引入了`for-of`循环，作为遍历所有数据结构的统一的方法。

&emsp;&emsp;一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有`iterator`接口，就可以用`for-of`循环遍历它的成员。换句话说，`for-of`循环，内部调用的就是数据结构的`Symbol.iterator`方法。

&emsp;&emsp;`for-of`循环可以使用的范围包括有**数组、`Set`和`Map`结构、某些类似数组的对象（比如arguments对象，DOM NodeList对象）、Generator对象以及字符串**。

---
## <a id='set'>**Set**</a>
### **`Set`的基本概念**
&emsp;&emsp;数据结构`Set`类似于数组，但成员的值都是唯一的，没有重复。`Set`本身是一个构造函数，用来生成`Set`数据结构。
```js
const s = new Set();
[2, 3, 5, 4, 5, 2].forEach(x => s.add(x));

for (let i of s) {
    conosle.log(i);
}
//  2345
```
&emsp;&emsp;`Set`函数可以接受一个数组（或具有`iterable`接口的其他数据结构）作为参数用来初始化。
```js
// 例一
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似于
const set = new Set();
document
 .querySelectorAll('div')
 .forEach(div => set.add(div));
set.size // 56
```
&emsp;&emsp;使用`Set`为数组去重是一种可行的办法，字符串去重也可。

&emsp;&emsp;向`Set`添加值时，不会发生类型转换，所以5和"5"是不同的两个值。`Set`内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 `Set` 加入值时认为`NaN`等于自身，而精确相等运算符（===）认为`NaN`不等于自身。与此同时，两个对象总是不相等的。

### **`Set`实例的属性和方法**

&emsp;&emsp;`Set`的实例有以下属性
- `Set.prototype.constructor`：构造函数，默认就是`Set`函数；
- `Set.prototype.size`：返回`Set`实例的成员总数。

&emsp;&emsp;`Set`实例的方法分为两大类，操作方法和遍历方法。**四个操作方法**如下：
- `Set.prototype.add(value)`：添加某个值，返回`Set`结构本身；
- `Set.prototype.delete(value)`：删除某个值，返回布尔值表示是否成功；
- `Set.prototype.has(value)`：表示某个值是否为`Set`成员，返回一个布尔值；
- `Set.prototype.clear()`：清楚所有的成员，没有返回值。

&emsp;&emsp;`Set`的**四个遍历方法**如下：
- `Set.prototype.keys()`：返回键名的遍历；
- `Set.prototype.values()`：返回键值的遍历；
- `Set.prototype.entries()`：返回键值对的遍历；
- `Set.prototype.forEach()`：使用回调函数遍历每个成员。 


---
## <a id='map'>**Map**</a>
