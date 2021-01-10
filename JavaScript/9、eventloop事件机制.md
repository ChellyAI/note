## **目录**
- [宏任务和微任务](#macroandmicro)
- [浏览器的eventloop](#browser)
- [async/await](#asyncawait)
- [练习题](#example)
- [答案](#answer)
---
## <span id="macroandmicro">**宏任务和微任务**</span>

&emsp;&emsp;宏任务（macrotask）也叫tasks，微任务（microtask）也叫jobs，JavaScript有两种队列，分别是macro task queue和micro task queue。任务将放置到对应的任务队列中。

&emsp;&emsp;是宏任务的异步任务有：
- setTimeout
- setInterval
- setImmediate(Node)
- requestAnimationFrame(browser)
- UI rendering(browser)
- I/O

&emsp;&emsp;是微任务的异步任务有：
- process.nextTick(Node)这个任务会插队到其他微任务前面
- Promise
- Object.observe
- MutationObserver


---
## <span id="browser">**浏览器的eventloop**</span>

&emsp;&emsp;浏览器处理JavaScript脚本的顺序是：
1. 一开始将整个脚本作为一个宏任务执行
2. 在执行栈中从上到下执行同步代码
3. 执行到异步代码就将其放入所属的任务队列中
4. 执行完当前运行栈的同步代码后，按顺序从micro task queue中取出任务放到执行栈中执行，直到micro task queue被清空
5. <font color="red">**执行浏览器 UI 线程的渲染工作**</font>
6. 检查是否有 Web Workder 任务，有则执行
7. 执行完本轮的宏任务后，回到步骤二，按顺序从宏任务队列中取出下一个宏任务放入执行栈中执行，直到宏任务和微任务的队列都清空



---
## <span id="asyncawait">**async/await**</span>

&emsp;&emsp;async将被声明函数以一个Promise的形式返回，紧跟着的await语句将立即执行，后面的语句则需要等待await执行后才执行。await等待的就是一个Promise。因此async / await中，await的会立即执行，后面的内容当作一个micro task来执行。

---
## <span id="example">**练习题**</span>

```js
//  第一题
console.log('1');
async function async1() {
    console.log('2');
    await console.log('3');
    console.log('4')
}

setTimeout(() => {
    console.log('5');
}, 0)
async1();
new Promise((resolve) => {
    console.log('6');
    resolve();
}).then(() => {
    console.log('7');
})
console.log('8');


//  第二题
setTimeout(()=>{
   console.log(1) 
},0)
let a=new Promise((resolve)=>{
    console.log(2)
    resolve()
}).then(()=>{
   console.log(3) 
}).then(()=>{
   console.log(4) 
})
console.log(5) 


//  第三题
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})


//  第三题变异版1
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    return new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})

//  第三题变异版2
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})
new Promise((resolve,reject)=>{
    console.log("promise3")
    resolve()
}).then(()=>{
    console.log("then31")
})


//  第四题
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}

async  function async2() {
    console.log( 'async2');
}

console.log("script start");

setTimeout(function () {
    console.log("settimeout");
},0);

async1();

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});
console.log('script end'); 


//  第五题
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}
async  function async2() {
    console.log( 'async2');
}
console.log("script start");
setTimeout(function () {
    console.log("settimeout");
});
async1()
new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});
setImmediate(()=>{
    console.log("setImmediate")
})
process.nextTick(()=>{
    console.log("process")
})
console.log('script end'); 
```
---
## <span id="answer">**答案**</span>

