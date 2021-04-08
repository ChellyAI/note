const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(initialFunc) {
    //  添加错误捕捉
    try {
      initialFunc(this.resolve, this.reject);
    }
    catch (error) {
      this.reject(error);
    }
  }

  //  当前状态，只能从 pending 变成 fulfilled 或者 rejected
  status = PENDING

  //  fulfilled 后的值
  value = null

  //  rejected 后的值
  error = null

  //  将 then 里给的成功以及失败的回调函数保存下来，等到异步的 resolve、reject 完成后再调用
  onFulfilledCallback = []
  onRejectedCallback = []

  //  resolve 实质上的功能就是修改 Promise 对象的状态
  //  以及将传入 resolve 的值保存起来
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;

      while(this.onFulfilledCallback.length) {
        this.onFulfilledCallback.shift()(value);
      }
    }
  }

  //  reject 同理
  reject = (error) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.error = error;

      while(this.onRejectedCallback.length) {
        this.onRejectedCallback.shift()(error);
      }
    }
  }

  //  传参是两个回调函数，回调函数的参数分别是保存的 value、error
  //  链式调用，就需要它返回的也是一个 promise 对象，因为返回的那个 promise 对象也有一个 then
  then(onFulfilled, onRejected) {
    const myPromise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //  使用微任务来执行以下内容，因为比对result是否是当前这个promise自身
        //  需要在它自身创建完成后才能知道是否一样。不使用微任务，将导致报错
        //  ReferenceError: Cannot access 'myPromise' before initialization
        queueMicrotask(() => {
          //  添加错误捕捉
          try {
            const result = onFulfilled(this.value);

            if (result === myPromise) {
              return reject(new Error('出错了'));
            }

            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            }
            else {
              resolve(result);
            }
          }
          catch (error) {
            reject(error)
          }
        })
      }
      else if (this.status === REJECTED) {
        onRejected(this.error);
      }
      //  如果是异步的代码，resolve、reject 改变状态还未发生，
      //  此时 then 里的回调函数不应该如前两中情况立即执行，于是保存到各自的回调队列中
      //  当异步的 resolve、reject 执行完成后，让它们自己从回调队列中取出保存的函数并执行
      else if (this.status === PENDING) {
        this.onFulfilledCallback.push(onFulfilled);
        this.onRejectedCallback.push(onRejected);
      }
    })

    return myPromise;
  }
}

module.exports = MyPromise;
