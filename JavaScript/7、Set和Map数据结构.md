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

&emsp;&emsp;JavaScript的对象本质上是键值对集合，但只能用字符串当作键给使用带来了很大的限制。
```js
const a = {};
const b = [1, 2, 3];
const c = {name: 'caisiqi'};
const d = [1, 2, {name: 'caisiqi'}];
const e = document.getElementById('caisiqi');

a[b] = 'akua';
a[c] = 'mea';
a[d] = 'arisu';
a[e] = 'matsuri';

a['1,2,3']    //  akua
a['[object Object]']  //  mea
a['1,2,[object Object]']    //  arisu
a['[object HTMLDivElement]']    //  matsuri
```
&emsp;&emsp;可以看到，使用数组、对象或DOM作为对象的键，因为只能使用字符串，会被转换为`'1,2,3'、'[object Object]'、'[object HTMLDivElement]'`。

&emsp;&emsp;ES6提供的Map数据结构就是为了解决这个问题。它类似对象，但键值对的“键”范围不限于字符串，各种类型的值（包括对象）都可以当作键。
```js
const a = new Map();
const b = {name: 'caisiqi'};

a.set(b, 16);
a.get(b);   //  16
a.has(b);   //  true
a.delete(b);
a.has(b);   //  false
```
&emsp;&emsp;Map作为构造函数，也可以接受一个数组作为参数，**该数组成员是一个个表示键值对的数组**。
```js
const a = new Map([
    ['name', 'caisiqi'],
    ['age', 16],
]);

a.has('name');  //  true
a.has('age');   //  true
a.get('name');  //  caisiqi
a.get('age');   //  16
```
&emsp;&emsp;接受参数的过程实际上执行的是如下代码：
```js
const args = [
    ['name', 'caisiqi'],
    ['age', 16],
];

const a = new Map();

args.forEach(([key, value]) => {
    a.set(key, value);
});
```
**注意：任何具有Iterator接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map的构造函数的参数，所以Set和Map都可以作为Map的参数。**

&emsp;&emsp;用get方法获取未知的键，得到的是`undefined`。Map的键是跟内存地址绑定的，只要内存地址不一样，就视为两个键。如果键是一个简单类型的值，那么只要其严格相等，就会被视为一个键。**注意：NaN虽然不严格相等于自身，但也被视为同一个键。**

### **`Map`实例的属性和方法**

&emsp;&emsp;`Map`的实例有以下属性和操作方法：
- `size`属性：返回`Map`结构成员总数；
- `Map.prototype.set(key, value)`：`set`方法设置键名`key`的值为`value`，并返回整个`Map`结构，可以使用链式写法；
```js
const map = new Map()
    .set(1, 'a')
    .set(2, 'b')
    .set(3, 'c');
```
- `Map.prototype.get(key)`：读取`key`对应的键值，如果找不到就返回`undefined`；
- `Map.prototype.has(key)`：返回一个布尔值，表示某个键是否在当前`Map`对象中；
- `Map.prototype.delete(key)`：删除某个键，返回`true`，失败则返回`false`；
- `Map.prototype.clear()`：清除所有成员，没有返回值。

&emsp;&emsp;`Map`结构有三个遍历器生成函数和一个遍历方法：

- `Map.prototype.keys()`：返回键名的遍历器；
- `Map.prototype.values()`：返回键值的遍历器；
- `Map.prototype.entries()`：返回所有成员的遍历器；
- `Map.prototype.forEach()`：遍历Map的所有成员。

&emsp;&emsp;**注意：Map的遍历顺序就是插入顺序。**
