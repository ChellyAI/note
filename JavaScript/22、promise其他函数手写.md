包含有promise并发控制、all、race、allSettled

```js
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务
  for (const item of array) {
    // 调用iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p); // 保存新的异步任务
    console.log(item, '新创建异步任务', p, '现在的executing长度', executing.length, `以及ret的长度${ret.length}`);

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 定义异步的then，当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => {
        console.log('-----移除是啥意思', executing.indexOf(e), '长度呢', executing.length);
        const a = executing.splice(executing.indexOf(e), 1)
        console.log('========移除后的长度', executing.length);
        return a;
      });

      console.log('e是什么', e, executing.length);
      executing.push(e); // 保存正在执行的异步任务

      console.log(item, '到里面了，', executing.length);

      //  如果正在执行的大于等于限制的上限
      if (executing.length >= poolLimit) {
        console.log(item, '当前是否到了等待的步骤');
        const res = await Promise.race(executing); // 等待较快的任务执行完成
        console.log('race执行结果', res);
      }
    }
  }
  console.log('这里是外面，asyncPool返回处', ret.length);
  return Promise.all(ret);
}

function test(i) {
  return new Promise((resolve, reject) => {
    // return setTimeout(() => {
    //   resolve(i);
    //   console.log(`${i},打印了`);
    // }, i);

    return setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(i);
        console.log(`${i},打印了`)
      } else {
        reject(`${i}出错了`);
        console.log('报错了', i)
      }
    }, i);
  });
}

async function haha() {
  const res = await asyncPool1(2, [1000, 6000, 3000, 2500, 4000, 2000], test);

  console.log('最终的结果有吗', res);
}

// haha();

//  别人的
function asyncPool2(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务
  const enqueue = function () {
    if (i === array.length) {
      return Promise.resolve();
    }
    const item = array[i++]; // 获取新的任务项
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    let r = Promise.resolve();

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        r = Promise.race(executing);
      }
    }

    // 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}









async function asyncPool1(limit, arr, func) {
  const runList = [];
  const allFuncs = [];

  for (let item of arr) {
    const p = Promise.resolve().then(() => func(item)).catch(e => e);
    allFuncs.push(p);

    if (limit <= arr.length) {
      p.then(() => runList.splice(runList.indexOf(p), 1), (e) => runList.splice(runList.indexOf(p), 1));
      runList.push(p);

      if (runList.length >= limit) {
        await Promise.race(runList);
      }
    }
  }

  return Promise.allSettled(allFuncs);
}

//  我写的
Promise.prototype.promiseAll = function (funcs) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(funcs);
    if (!arr || !arr.length) {
      resolve([]);
      return;
    }
    const results = [];
    let count = 0;
    let error = null

    for (let i of arr) {
      Promise.resolve(i)
      .then((value) => {
        results[arr.indexOf(i)] = value;
        count++;

        if (count === arr.length) {
          resolve(results);
        }
      }, (e) => {
        console.log('这个是then里的reject', e);
        reject(e);
        return;
      })
      .catch(e => reject(e));
    }
  })
}

//  别人的
Promise.all2 = function (iterators) {
  return new Promise((resolve, reject) => {
    if (!iterators || iterators.length === 0) {
      resolve([]);
    } else {
      let count = 0; // 计数器，用于判断所有任务是否执行完成
      let result = []; // 结果数组
      for (let i = 0; i < iterators.length; i++) {
        // 考虑到iterators[i]可能是普通对象，则统一包装为Promise对象
        Promise.resolve(test(iterators[i])).then(
          (data) => {
            result[i] = data; // 按顺序保存对应的结果
            // 当所有任务都执行完成后，再统一返回结果
            if (++count === iterators.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err); // 任何一个Promise对象执行失败，则调用reject()方法
            return;
          }
        ).catch(e => reject(e));
      }
    }
  });
};




async function wuhu() {
  const arr = [1000, 6000, 3000, 2500, 4000, 2000];

  // const res = await Promise.all2(arr);
  const res = await Promise.prototype.promiseAll(arr);
  console.log('result结果', res);
}

// wuhu();


//  别人的
function myPromiseAll(_promises){
  // Promise中传入的不一定是数组。是具有迭代器的属性，迭代器所有的Promise都resolve后组成为数组
  return new Promise((resolve,reject)=>{
      const promises = Array.from(_promises);
      // 并发执行promise,记住每个promise的位置
      const result = [];
      const len = promises.length;
      let count = 0;
      for(let i =0;i<len ;i++){
          // 注意有的数组项有可能不是Promise，需要手动转化一下
          Promise.resolve(promises[i]).then( o=>{
              // 收集每个Promise的返回值
              result[i] = o;
              // 当所有的Promise都成功了，那么将返回的Promise结果设置为result
              if(++count === len){
                  resolve(result);
              }
              // 监听数组项中的Promise catch只要有一个失败，那么我们自己返回的Promise也会失败
          })
          .catch(e=>reject(e))
      }
  })
}
// myPromiseAll([1,2,3]).then(o => console.log(o));
// myPromiseAll([1,Promise.resolve(3)]).then(o=>console.log(o));
// myPromiseAll([1,Promise.reject(3)]).then(o=>console.log('done')).catch(e=>console.log(e));
// Promise.prototype.promiseAll([1,Promise.reject(3)]).then(o=>console.log('done')).catch(e=>console.log('这个是结果吧', e));


function promiseRace(arr) {
  return new Promise((resolve, reject) => {
    const funcs = Array.from(arr || []);
    if (!funcs.length) {
      resolve([]);
      return;
    }

    let res = null;

    for (let func of funcs) {
      Promise.resolve(func)
        .then((value) => {
          if (res !== null) return;
          res = value;
          resolve(value);
          return;
        })
        .catch(e => {
          if (res !== null) return;
          res = e;
          reject(e)
        })
    }
  })
}

promiseAllsettled([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 6000);
  }),
  Promise.reject(3),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(2);
    }, 10500);
  })
]).then(e => console.log('成功', e)).catch(e => console.log('出错', e))

function promiseAllsettled(arr) {
  return new Promise((resolve, reject) => {
    const funcs = Array.from(arr || []);

    if (!funcs.length) {
      resolve([]);
      return;
    }

    let count = 0;
    const result = [];

    for (let i = 0; i < funcs.length; i++) {
      Promise.resolve(funcs[i])
        .then(value => {
          count++;

          result[i] = {
            status: 'fulfilled',
            value,
          };

          if (count === funcs.length) {
            resolve(result);
          }
        })
        .catch(error => {
          count++;

          result[i] = {
            status: 'rejected',
            reason: error,
          };

          if (count === funcs.length) {
            resolve(result);
          }
        })
    }
  })
}
```
