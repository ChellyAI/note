## **目录**
- [执行上下文栈](#stack)


---
## <span id="forward">**前言**</span>

&emsp;&emsp;当JavaScript执行一段可执行代码(executable code)时，会创建对应的执行上下文，

&emsp;&emsp;每个执行上下文，都有三个重要属性：
- 变量对象(Variable object,VO)
- 作用域链(Scope chain)
- this
---
## <span id="stack">**执行上下文栈**</span>

&emsp;&emsp;JavaScript创建了执行上下文栈(Execution context stack，ECS)来管理执行上下文。

&emsp;&emsp;此处模拟一下执行上下文栈的工作过程。先定义它是一个数组，当JavaScript开始解释执行代码的时候，最先遇到全局代码，此时向其中压入一个全局执行上下文，之后再遇到函数，会创建一个执行上下文，并压入执行上下文栈，执行完毕后将函数的执行上下文再弹出。下面给出一个例子：
```js
//  定义
ECStack = [];

//  压入全局执行上下文
ECStack = [
  globalContext,
];

function func3() {
  console.log(3);
}

function func2(){
  func3();
}

function func1() {
  func2();
}

//  func1()
ECStack.push(func1Context);

//  发现func1调用了func2，因此func2()
ECStack.push(func2Context);

//  而func2还调用了func3，只好再func3()
ECStack.push(func3Context);

//  func3执行完毕
ECStack.pop();

//  func2执行完毕
ECStack.pop();

//  func1执行完毕
ECStack.pop();
```
---
## <span id="">**执行上下文——变量对象**</span>

&emsp;&emsp;
