## 目录
- [Promise的含义](#introduction)
- [Promise基本用法](#usage)
- [Promise.prototype.then()](#then)
- [Promise.prototype.catch()](#catch)
- [Promise.prototype.finally()](#finally)
- [Promise.all()](#all)
- [Promise.race()](#race)
- [Promise.allSettled()](#allsettled)
- [Promise.any()](#any)
- [Promise.resolve()](#resolve)
- [Promise.reject()](#reject)
- [Promise的手写相关](#diy)
-----------------

## <span id='introduction'>**Promise的含义**</span>

&emsp;&emsp;`Promise`是异步编程的一种解决方案，ES6将其写入了语言标准。所谓`Promise`，简单来说就是一个容器，里面保存某个未来才结束的事件（通常为异步操作）**的结果**。

&emsp;&emsp;`Promise`对象有两个特点：

（1）对象的状态不受外界影响。有三种状态：`pending`、`fulfilled`和`rejected`。只有异步操作的结果可以决定是哪一种状态。

（2）状态一旦改变，就不会再变。状态改变只可能是从`pending`变成`fulfilled`或者`rejected`。这就叫做`resolved`（已定型）。

&emsp;&emsp;`Promise`的缺点如下：

（1）无法取消`Promise`，一旦新建就会立即执行；

（2）如果不设置回调函数，`Promise`内部抛出的错误不会反应到外部；

（3）处于`pending`状态时，无法得知目前进展（刚开始还是快结束）。

-----------------
## <span id='usage'>**Promise**基本用法</span>

&emsp;&emsp;`Promise`对象是一个构造函数，用来生成Promise实例
```js
const result = new Promise((resolve, reject) => {
  //  一系列操作
  if (/*  异步操作成功  */) {
    resolve(value);
  }
  else {
    reject(error);
  }
})
```
&emsp;&emsp;`resolve`和`reject`两个函数由JavaScript引擎提供。

&emsp;&emsp;`resolve`函数的作用是将`Promise`对象的状态从`pending`变为`resolved`，在异步操作成功时调用，将异步操作的结果作为参数传递出去；

&emsp;&emsp;`reject`函数的作用是将`Promise`对象的状态从`pending`变为`rejected`，在异步操作失败时调用，将异步操作的错误信息作为参数传递出去。

&emsp;&emsp;`Promise`生成后，可以用`then`方法指定`resolved`和`rejected`状态的回调函数。
```js
promise.then((value) => {
  //  成功
}, (error) => {
  //  失败
})
```
-----------------
## <span id='then'>**Promise.prototype.then()**</span>

&emsp;&emsp;`then`方法返回的是一个新的`Promise`实例，可以采用链式写法，在其后面继续调用`then`。

-----------------
## <span id='catch'>**Promise.prototype.catch()**</span>

&emsp;&emsp;`Promise.prototype.catch()`方法用于发生错误时的回调函数，与`then(null, rejection)`或者`then(undefined, rejection)`相同。

&emsp;&emsp;`catch`方法返回的也还是一个`Promise`对象，且`catch`方法也可能产生错误，除非后面再接一个catch，否则无法将错误传递到外部。
```js
getJSON('/posts.json')
.then((posts) => {
  //  ...some code
})
.catch((error) => {
  //  处理getJSON和前一个回调函数then运行时发生的错误
})
```
**注意**：最好不要用`then`方法的第二个参数里面定义Reject状态的回调函数，而是使用`catch`来处理，这样的话`then`方法如果出错也将会被catch所捕获，写法上也更接近同步写法`try/catch`。

-----------------
## <span id='finally'>**Promise.prototype.finally()**</span>

&emsp;&emsp;`finally`方法用于不管最后状态如何，都会执行的操作。`finally`方法的回调函数不接受任何参数，因此无法知道前面`Promise`的状态如何。

-----------------
## <span id='all'>**Promise.all()**</span>

&emsp;&emsp;`Promise.all()`用于将多个`Promise`实例包装成一个新的`Promise`实例。它接受一个数组作为参数。
```js
const p = Promise.all([
  p1,
  p2,
  p3,
]);
```
&emsp;&emsp;假如其中有不是`Promise`实例的部分，会调用一个`Promise.resolve`方法转换为`Promise`实例。参数也可以不是数组，但必须具有`Iterator`接口，且返回的每个成员都是`Promise`实例。

&emsp;&emsp;上例中的**P**的状态由其成员**P1，P2，P3**决定。

- 三者状态都变成`fulfilled`，**P**才会变成`fulfilled`，此时**P1，P2，P3**的返回值组成一个数组，传递给**P**的回调函数；

- 只要其中有一个是`rejected`，**P**就变成`rejected`，而第一个变成`rejected`的实例的返回值，将会传递给**P**的回调函数。

**注意**：如果作为参数的`Promise`实例定义了自己的`catch`方法，那么它一旦`rejected`，将不会触发`Promise.all()`的`catch`方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// 并不会返回["hello", Error: 报错了]
```
&emsp;&emsp;上面代码，**P1**会resolve，**P2**首先变成`rejected`，但因为它有自己的`catch`方法，而`catch`方法返回的是一个新的`Promise`实例，因此**P2**实际指向的是这个`catch`方法返回的实例。这个实例在执行完`catch`后也会变成`resolved`，导致`Promise.all()`方法参数里的两个实例都会`resolved`，因此会调用`then`方法，而不是`catch`方法。

&emsp;&emsp;如果**P2**没有自己的`catch`方法，才会调用`Promise.all()`的`catch`方法（如下所示）。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```
-----------------
## <span id='race'>**Promise.race()**</span>

&emsp;&emsp;`Promise.race()`与`all`一样将多个`Promise`实例包装为一个新的`Promise`实例。
```js
const p = Promise.race([
    p1,
    p2,
    p3,
]);
```
&emsp;&emsp;与`all`不同的是，只要参数中的实例有一个率先改变状态，`p`的状态就跟着改变，而那个实例的返回值就传递给`p`的回调函数。

-----------------
## <span id='allsettled'>**Promise.allSettled()**</span>

&emsp;&emsp;有时候我们不关心异步操作的结果，只是关心这些操作有没有结束，`Promise.all()`无法满足，于是`Promise.allSettled()`就来了。

&emsp;&emsp;`Promise.allSettled()`方法接受一组`Promise`实例作为参数，包装为一个新`Promise`实例。等到所有的参数实例都返回结果，无论结果状态如何，包装实例才会结束。该方法返回的新的`Promise`实例，一旦结束，状态总是`fulfilled`。状态改变后，`Promise`监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的`Promise`实例。
```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then((results) => {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```
&emsp;&emsp;上面代码中，`results`数组的每个成员都是一个对象，每个对象都有`status`属性，值只可能是`fulfilled`或者`rejected`。当是`fulfilled`时，对象有`value`属性；`rejected`时有`reason`属性。
可以使用简单的`Array.prorotype.filter()`筛选出成功或失败的请求，输出其结果或原因。

-----------------
## <span id='any'>**Promise.any()**</span>

&emsp;&emsp;`Promise.any()`方法与`Promise.race()`很像，但它不会因为某个`Promise`变成`rejected`而结束。只要参数实例有一个变成`fulfilled`状态，包装的实例就会变成`fulfilled`；如果所有参数实例都变成`rejected`状态，包装实例才会变成`rejected`状态。
```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);
const alsoRejected = Promise.reject(Infinity);

Promise.any([resolved, rejected, alsoRejected]).then(function (result) {
  console.log(result); // 42
});

Promise.any([rejected, alsoRejected]).catch(function (results) {
  console.log(results); // [-1, Infinity]
});
```
-----------------
## <span id='resolve'>**Promise.resolve()**</span>

&emsp;&emsp;如果需要将现有的对象转为`Promise`对象，`Promise.resolve()`方法就起这个作用。

&emsp;&emsp;`Promise.resolve()`等价于下面写法：
```js
Promise.resolve('foo');

new Promise(resolve => resolve('foo'));
```
&emsp;&emsp;`Promise.resolve`方法的参数分成四种情况。

- 参数是一个`Promise`实例

如果参数就是`Promise`实例，将不做任何事情，原封不动返回它。

- 参数是一个`thenable`对象

`thenable`对象指的是具有`then`方法的对象，例如：
```js
const thenable = {
    then: (resolve, reject) => {
        resolve(42);
    }
};
```
面对这种情况，`Promise.resolve`方法会将这个对象转为`Promise`对象，然后立即执行`thenable`对象的`then`方法。
```js
const p1 = Promise.resolve(thenable);
p1.then((value) => {
    console.log(value); //  42
});
```
上面代码中，`thenasble`对象的`then`方法执行后，对象`p1`的状态就变为`resolved`，从而立即执行最后那个`then`方法指定的回调函数，输出42。

- 参数不是具有`then`方法的对象，或根本不是个对象

如果参数是一个原始值，或一个没有`then`方法的对象，那么`Promise.resolve`方法返回一个新的`Promise`对象，状态为`resolved`。
```js
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```
- 不带有任何参数

这种情况下，会直接返回一个`resolved`状态`Promise`对象，所以想获得一个`Promise`对象，方便的方法是直接调用`Promise.resolve()`方法。需要注意的是，**立即`resolve()`的`Promise`对象，是在本轮“事件循环”（event-loop）结束时执行，而不是下一轮“事件循环”的开始时。**
```js
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```
-----------------
## <span id='reject'>**Promise.reject()**</span>

&emsp;&emsp;`Promise.reject(reason)`方法也会返回一个新的`Promise`实例，该实例的状态为`rejected`。需要注意的是`Promise.reject()`方法的参数，会原封不动作为`reject`的理由变成后续方法的参数。
```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```
```js
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```
上面代码中，`Promise.reject`方法的参数是一个`thenable`对象，执行以后，后面`catch`方法的参数不是`reject`抛出的“出错了”这个字符串，而是`thenable`对象。

-----------------
## <span id='diy'>**Promise的手写相关**</span>


