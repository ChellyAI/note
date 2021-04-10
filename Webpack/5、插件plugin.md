## 插件 plugin

### plugin 的特征

- 是一个独立的模块
- 模块对外暴露一个 JavaScript 函数
- 函数的原型（prototype）上定义了一个注入`compiler`对象的`apply`方法
- `apply`函数中需要有通过`compiler`对象挂载的 webpack 事件钩子，钩子中的回调能拿到当前编译的`compilation`对象，如果是异步编译插件的话可以拿到回调 callback
- 完成自定义子编译流程并处理`compilation`对象的内部数据
- 如果异步编译插件的话，数据处理完成后执行 callback 回调