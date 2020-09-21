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
1. 在执行栈中从上到下执行同步代码
2. 执行到异步代码就将其放入所属的任务队列中
3. 执行完当前运行栈的同步代码后，按顺序从micro task queue中取出任务放到执行栈中执行，直到micro task queue被清空
4. 当micro task queue清空后，按顺序从macro task queue中取出第一个任务放入执行栈中执行
5. 假如过程中又有micro task则继续放入micro task queue并在执行完当前macro task任务后继续清空micro task queue
6. 清理完毕micro task queue后继续步骤4，直到macro task queue也清理完



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

