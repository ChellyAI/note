## 插件 plugin

### plugin 的组成：

- 一个 JavaScript 命名函数
- 在插件函数的 prototype 上定义一个 apply 方法
- 指定一个绑定到 webpack 自身的事件钩子
- 处理 webpack 内部实例的特定数据
- 功能完成后调用 webpack 提供的回调

```javascript
//	example
function MyWebpackPlugin() {

};

MyWebpackPlugin.prototype.apply = function(compiler) {
    //	指定一个挂载到 webpack 自身的事件钩子
    //	compilation 处理 webpack 内部实例的特定数据
    compiler.plugin('webpacksEventHook', function(compilation, callback) {
        console.log("This is an example");

        //	功能完成后调用 webpack 提供的回调
        callback();
    })
};

module.exports = MyWebpackPlugin;

//	再来一个

class HelloPlugin {
    //	在构造函数中获取用户传入的配置
	constructor(options) {
        this.options = options;
    }
    
    //	webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
    apply(compiler) {
        //	在 emit 阶段插入钩子函数，用于特定时机处理额外的逻辑
        compiler.hooks.emit.tap('HelloPlugin', (compilation) => {
            //	在功能流程完成后可以调用 webpack 提供的回调函数
        })
        
        //	如果事件是异步的，会带两个参数，第二个参数为回调函数
        compiler.plugin('emit', function(compilation, callback) {
            //	 处理完毕后执行 callback 以通知 webpack
            //	 如果不执行 callback，运行流程将会一直卡在这里不往下执行
            callback();
        })
    }
}

module.exports = HelloPlugin;
```

### Compiler 和 Compilation

&emsp;&emsp;在插件开发中最重要的两个资源就是 `compiler` 和 `compilation` 对象。

- `compiler` 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options、loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
- `compilation` 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

&emsp;&emsp;这两个组件（特别是 compilation）是任何插件不可或缺的部分，推荐查看源码：

- [compiler](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)
- [compilation](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)

### 基本插件架构

&emsp;&emsp;插件是由 **具有 `apply` 方法的 prototype 对象**所实例化出来的。这个 `apply` 方法在安装插件时，会被 webpack compiler 调用一次。`apply` 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。一个简单的插件结构如下：

```javascript
function HelloWorldPlugin(options) {
    //	使用 options 设置插件实例
}

HelloWorldPlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function() {
        console.log('Hello World');
    });
};

module.exports = HelloWorldPlugin;
```

&emsp;&emsp;安装这个插件，只需要在 webpack 配置的 `plugin` 数组中添加一个实例：

```javascript
const HelloWorldPlugin = require('hello-world');

const webpackCongif = {
    //	其他配置
    plugins: [
        new HelloWorldPlugin({
            options: true,
        }),
    ],
};
```

### 访问 compilation 对象

&emsp;&emsp;使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中。

```javascript
function HelloCompilationPlugin(options) {
    //	使用 options 设置插件实例
}

HelloCompilationPlugin.prototype.apply = function(compiler) {
    //	设置回调来访问 compilation 对象
    compiler.plugin("compilation", function(compilation) {
        //	现在，设置回调来访问 compilation 中的步骤：
        compilation.plugin("optimize", function() {
            console.log("Assets are being optimized");
        });
    });
};

module.exports = HelloCompilationPlugin;
```

### 异步编译插件

&emsp;&emsp;有一些编译插件中的步骤是异步的，这就需要额外传入一个 callback 回调函数，并且在插件运行结束时，**必须**调用这个回调函数。

```javascript
function HelloAsyncPlugin(options) {/*	使用 options 配置插件实例	*/}

HelloAsyncPlugin.prototype.apply = function(compiler) {
    compiler.plugin("emit", function(compilation, callback) {
        //	做一些异步处理
        setTimeout(function() {
            console.log("Done with async work");

            callback();
        }, 1000);
    });
};

module.exports = HelloAsyncPlugin;
```

### 来个栗子

&emsp;&emsp;一旦深入理解 webpack compiler 和每个独立的 compilation，我们依赖 webpack 引擎将有无限多的事可以做。可以重新格式化已有的文件，创建衍生文件，或者制作全新的生成文件。

&emsp;&emsp;举个简单的栗子，写一个示例插件，生成一个叫做  `filelist.md` 的新文件，文件内容是所有构建生成的文件的列表：

```javascript
function FileListPlugin(options) {
    //	通过 options 配置插件实例
}

FileListPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
        //	在生成文件中，创建一个头部字符串
        let filelist = 'In this build:\n\n';

        //	遍历所有编译过的资源文件，
        //	对于每个文件名称，都添加一行内容
        for (let filename in compilation.assets) {
            filelist += ('- ' + filename + '\n');
        }

        //	将这个列表作为一个新的文件资源，插入到 webpack 构建中
        compilation.assets['filelist.md'] = {
            source: function() {
                return filelist;
            },
            size: function() {
                return filelist.length;
            },
        };

        callback();
    });
};

module.exports = FileListPlugin;
```

### 插件的不同类型

&emsp;&emsp;webpack 插件可以按照它所注册的事件分成不同的类型。每一个事件钩子决定了它该如何应用插件的注册。

#### **同步（synchronous）**Tapable 实例应用插件时会使用：
- `applyPlugins(name: string, args: any...)`
- `applyPluginsBailResult(name: string,args: any...)`

&emsp;&emsp;这意味着每个插件回调，都会被特定的 `args` 一个接一个地调用。这是插件的最基本形式。

#### 瀑布流（waterfall）插件应用时会使用：

- `applyPluginsWaterfall(name: string, init: any, args: any...)`

&emsp;&emsp;这种类型的每个插件都在其他插件依次调用之后调用，前一个插件调用的返回值，作为参数传入后一个插件。这类插件必须考虑其执行顺序。必须等前一个插件执行后，才能接收参数。前一个插件的值是 `初始值(init)`。这个模式用在与 webpack 模板相关的 Tapable 实例中（例如 `ModuleTemplate`、`ChunkTemplate` 等）。

#### 异步（asynchronous）当所有插件都异步应用时：

- `applyPluginsAsync(name: string, args: any..., callback: (err?: Error) => void)`

&emsp;&emsp;这类插件处理函数，在调用时，会传入所有的参数和一个签名为 `(err?: Error) => void` 的回调函数。处理函数按注册时的顺序调用。在调用完所有处理程序后，才会调用 callback。这也是 `"emit"`、`"run"` 等事件的常用模式。

#### 异步瀑布流（async waterfall）插件将以瀑布方式异步应用：

- `applyPluginsAsyncWaterfall(name: string, init: any, callback: (err: Error, result: any) => void)`

&emsp;&emsp;这种类型插件处理函数在调用时，会传入当前值（current value）和一个带有签名为 `(err: Error,  nextValue: any) => void` 的回调函数。当调用的 nextValue 是下一个处理函数的当前值（current value）时，第一个处理程序的当前值是 `init`。在调用完所有处理函数之后，才会调用 callback，并将最后一个值传入。如果其中任何一个处理函数传入一个 `err` 值，则会调用此 callback 并将此 error 对象传入，并且不再调用其他处理函数。这种模式适用于 `"before-resolve"` 和 `"after-resolve"` 这样的事件。

#### 异步串联（async series）：

- `applyPluginsAsyncSeries(name: string, args: any..., callback: (err: Error, result: any) => void)`

&emsp;&emsp;它与异步（asynchronous）相同，但如果任何插件注册失败，则不再调用其他插件。

#### 并行（parallel）：

- `applyPluginsParallel(name: string, args: any..., callback: (err?: Error) => void)`
- `applyPluginsParallelBailResult(name: string, args: any..., callback: (err: Error, result: any) => void)`
