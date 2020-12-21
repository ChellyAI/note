## setState的详解

问结果是如何？
```js
  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 1 次 log

    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 3 次 log

      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 4 次 log
    }, 0);
  }
```
&emsp;&emsp;首先需要明白，`setState` 并不是异步的，因为其批处理机制给人一种异步的假象。

&emsp;&emsp;如果是由 `React` 引发的事件处理（例如通过 onClick 引发的），调用 `setState` 不会同步更新 `this.state`，除此之外的 `setState` 调用会同步执行 `this.state`。
