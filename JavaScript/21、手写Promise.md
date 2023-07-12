参考文章

https://juejin.cn/post/6945319439772434469#comment

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class myPromise {
  /*  错误捕获，需要分为 constructor 中的错误，和 then 函数中的错误 */
  constructor(func) {
    try {
      func(this.resolve, this.reject)
    }
    catch (e) {
      this.reject(e);
    }
  }

  status = PENDING

  result = null

  error = null

  /**
   * then 方法中存入的回调函数，参照 then 的第 2 点，此处被注释掉的两行是第一版，只能保存一个函数
   */
  // onFulfilledCallback = null
  // onRejectedCallback = null

  /**
   * then 方法中存入的回调函数数组，参照 then 的第 3 点，此处是第二版
   * 可以将多次调用的 then 函数的每个回调都保存下来，放到数组中进行调用
   */
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  /**
   * resolve 函数和 reject 函数
   *
   * 1、resolve和reject函数，在此处使用箭头函数，是为了让constructor中的this能指向当前实例对象
   * 如果用普通函数，那么this指向的是window或者undefined
   *
   * 2、参照 then 中的第 2 点，需要在改变了状态后，判断是否有回调需要执行
   *
   * 3、参照 then 中的第 3 点，回调函数可能为多个，因此数组内可能存在多个回调函数，所以变成循环判断并调用回调
   */
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.result = value;

      /* 第一版判断是否有回调函数执行  */
      // this.onFulfilledCallback && this.onFulfilledCallback(value);

      /*  第二版回调函数数组，执行时需要循环调用它们  */
      /*  Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空 */
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  }

  reject = (value) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.error = value;

      /* 第一版判断是否有回调函数执行  */
      // this.onRejectedCallback && this.onRejectedCallback(error);

      /*  第二版回调函数数组，执行时需要循环调用它们  */
      /*  Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空 */
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(value);
      }
    }
  }

  /**
   * then 函数
   *
   * 1、then入参为两个函数，其一是 fulfilled 后的处理，其二是 rejected 后的处理
   *
   * 2、promise中通常为异步操作，执行到then的时候，可能状态还是 PENDING，怎么办呢？
   * 所以需要把 onFulfilled 和 onRejected 两个函数作为回调先存起来，等到状态改变了再去执行
   * 而状态改变的时候，就是 resolve 和 reject 函数中了，在那两个函数中，判断如果有未执行的回调，就执行回调
   *
   * 3、then 方法是可以被多次调用的，例如: p1.then(); p1.then(); p1.then();
   * 连续调用了三个 p1 的 then 方法，那么也应该把这三个 then 都执行才对
   * 于是，两个回调函数需要改成两个回调函数的数组
   *
   * 4、then 方法要链式调用，就需要返回一个 Promise 对象，
   * then 方法里 return 一个返回值作为下一个 then 方法的参数，
   * 如果是 return 一个 Promise 对象，那么后一个 then 还需要判断被 return 的 Promise 的状态，等状态发生了变化才会调用
   *
   * 5、then 方法的链式调用，不能是自身这个 Promise 对象，否则将会循环调用导致报错，
   * 并且，想要拿自身进行比较，就得等到自身初始化完成后，所以进行比较等后续的操作，放到微任务 queueMicrotask 中进行异步处理，
   * 最终，在提取的公共函数 resolvePromise 中，入参多一个 promise 自身，用于对比判断
   *
   * 6、then 方法中需要添加错误捕获
   *
   * 7、参考 FULFILLED 里的处理，对 REJECTED 和 PENDING 也要进行改造，
   * 改造内容与 FULFILLED 一样，有： 增加异步状态下的调用、增加回调函数执行结果判断、增加识别 Promise 是否返回自己、增加错误捕获
   */
  then(onFulfilled, onRejected) {
    /*  then 方法的两个参数并不是必传，是可选的，因此做一下判断 */
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    onRejected = typeof onRejected === 'function' ? onRejected : (e) => {throw e};

    /*  参考 then 方法第 4 点，此处是需要返回一个 Promise 对象  */
    // return new myPromise((resolve, reject) => {
    /*  参考 then 方法第 5 点，需要对自身做相等判断，因此此处需要把被 then 返回的 Promise 对象保存起来，在自身内部进行后续的对比
      且要注意一点，比对是需要在 promise2 完成初始化才可进行，因此状态为 FULFILLED 的操作都放到微任务 queueMicrotask 中去 */
    const promise2 = new myPromise((resolve, reject) => {
      if (this.status === PENDING) {
        /*  下方两行被注释掉的代码为第一版的回调保存，参照 then 的第 3 点，需要改成两个数组 */
        // this.onFulfilledCallback = onFulfilled;
        // this.onRejectedCallback = onRejected;

        /*  参考 then 方法的第 7 点，PENDING 下的处理也需要进行改造，因此下两行得被注释掉 */
        // this.onFulfilledCallbacks.push(onFulfilled);
        // this.onRejectedCallbacks.push(onRejected);
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          })
        });

        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.error);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          })
        })
      }
      else if (this.status === FULFILLED) {
        /*  参考 then 第 5 点，对自身的判断要在自身初始化之后，所以放到微任务中
          且为了方便，从第 5 点开始，将状态为 FULFILLED 里的后续操作提取一个公共函数 resolvePromise */
        /*  参考 then 第 6 点，错误捕获只需要在 queueMicrotask 中加一个 try catch即可 */
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.result);

            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        })

        /*  FULFILLED 的后续操作被提取为公共函数 resolvePromise */

        /*  参考 then 的第 4 点，此处的 onFulfilled 是可能被链式调用，有返回值，甚至返回值为 Promise 对象，作为下一个 then 的参数
          因此这里需要使用变量将 onFulfilled 的执行结果存下来 */
        // onFulfilled(this.result);  //  第一版的 onFulfilled执行
        // const x = onFulfilled(this.result); //  第二版将 onFulfilled 的结果保存并传递下去

        /*  判断前一个 then 函数的执行结果最终 return 的是不是一个 Promise 对象 */
        // if(x instanceof myPromise) {
          /*  执行 x，调用 then 方法，目的是将其状态从 PENDING 变为 FULFILLED 或 REJECTED
            x.then(value => resolve(value), error => reject(error)) 可简写为下方代码  */
          // x.then(resolve, reject);
        // } else {
          /*  前一个 then 函数如果返回的普通值，就直接给到 resolve 作为参数使用即可 */
          // resolve(x);
        // }
      }
      else if (this.status === REJECTED) {
        /*  参考 then 第 7 点中，需要针对 REJECTED 也做改造处理，因此下一行代码得注释掉 */
        // onRejected(this.error);

        /*  经过第 7 点改造后的 REJECTED 应该如下 */
        queueMicrotask(() => {
          try {
            const x = onRejected(this.error);
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject(e);
          }
        })
      }
    })
    return promise2;
  }
}

/*  从 then 第 5 点开始，将 FULFILLED 状态的后续操作提取为公共函数  */
function resolvePromise(promise2, x, resolve, reject) {
  /*  如果 promise2 和 x 相等，说明 then 的链式调用返回的是自身，所以要抛出错误，避免循环调用 */
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }

  /*  判断前一个 then 函数的执行结果最终 return 的是不是一个 Promise 对象 */
  if(x instanceof myPromise) {
    /*  执行 x，调用 then 方法，目的是将其状态从 PENDING 变为 FULFILLED 或 REJECTED
      x.then(value => resolve(value), error => reject(error)) 可简写为下方代码  */
    x.then(resolve, reject);
  } else {
    /*  前一个 then 函数如果返回的普通值，就直接给到 resolve 作为参数使用即可 */
    resolve(x);
  }
}

myPromise.deferred = function () {
  var result = {};
  result.promise = new myPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}

module.exports = myPromise;
```
