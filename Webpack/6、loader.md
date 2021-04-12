## loader

### 一、什么是 loader？

&emsp;&emsp;webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。

&emsp;&emsp;而 loader 让 webpack 能够去处理其它类型的文件，并将它们转换为有效[模块](https://webpack.docschina.org/concepts/modules)，供应用程序使用，以及被添加到依赖图中。

&emsp;&emsp;loader 本质上是导出为函数的 JavaScript 模块。

&emsp;&emsp;在 webpack 使用过程中，经常会出现以下两种形式，前者更多是我们在 webpack 配置文件中，根据文件匹配信息，去配置 loader 相关信息；后者更多是在 loader/plugin 中去修改、替换、生成的行内 loader 信息。

```javascript
//	webpack.config.js
{
    module: {
        rules: [
            {
                test: /.txt$/,
                use: [
                    {
                        loader: getLoader("a-loader.js"),
                    }
                ],
                enforce: "pre",
            },
            {
                test: /.txt$/,
                use: [
                    {
                        loader: getLoader("b-loader.js"),
                    },
                ],
                enforce: "post",
            },
        ],
    },
}
```

```javascript
//	app.js
import "/Users/caisiqi/Desktop/loader/c-loader.js!./txt.txt"
```

### 二、loader 的分类

&emsp;&emsp;在 webpack 里，loader 可以被分为四类，分别是 `后置post`、`普通normal`、`行内inline`、`前置pre`。

#### enforce

&emsp;&emsp;对于 `post`、`normal`、`pre`，主要取决于在配置里 `Rule.enforce` 的取值：`pre` || `post`，若无设置，则为 `normal`。

**注意**：相对于的是 Rule，并非某个 loader。那么作用于的就是对应 Rule 的所有 loader。

#### inline

&emsp;&emsp;行内 loader 比较特殊，是在 `import/require` 的时候，将 loader 写入代码中。而对于 `inline` 而言，有三种前缀语法：

- `!`：忽略 `normal` loader；
- `-!`：忽略 `pre` 和 `normal` loader；
- `!!`：忽略所有 loader（`pre` `normal` `post`）

&emsp;&emsp;行内 loader 通过 `!` 将资源中的 loader 进行分割，同时支持在 loader 后面，通过 `?` 传递参数，参数信息参考 `loader.options` 内容。

&emsp;&emsp;而以上说的三种前缀语法，则是写在内联 loader 字符串的前缀上，来表示忽略哪些配置 loader。

#### 来几个例子

&emsp;&emsp;以 `a-loader` 为 `pre loader`，`b-loader` 为 `normal loader`，`c-loader` 为 `post loader` 为例。

**本文的 loader 均为**：

```javascript
module.exports = function (content) {
    console.log("x-loader");
    
    return content;
}

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("x-loader-pitch");
};
```

- 无前缀信息

```javascript
import "/Users/caisiqi/Desktop/loader/d-loader.js!./txt.txt";

c-loader-pitch
d-loader-pitch
b-loader-pitch
a-loader-pitch
a-loader
b-loader
d-loader
c-loader
```

- ! 前缀信息

```javascript
import "!/Users/caisiqi/Desktop/loader/d-loader.js!/txt.txt";

c-loader-pitch
d-loader-pitch
a-loader-pitch
a-loader
d-loader
c-loader
```

- -! 前缀信息

```javascript
import "-!/Users/caisiqi/Desktop/loader/d-loader.js!./txt.txt";

c-loader-pitch
d-loader-pitch
d-loader
c-loader
```

- !! 前缀信息

```javascript
import "!!/Users/caisiqi/Desktop/loader/d-loader.js!./txt.txt";

d-loader-pitch
d-loader
```

### 三、loader 的优先级

&emsp;&emsp;四种 loader 的调用先后顺序为：`pre` > `normal` > `inline` > `post`。

&emsp;&emsp;在相同种类 loader 的情况下，调用的优先级为自下而上、自右向左（pitch 情况下，反过来）。

```javascript
{
    module: {
        rules: [
            {
                test: /.txt$/,
                use: [
                    {
                        loader: getLoader("a-loader.js"),
                    },
                ],
                enforce: "post",
            },
            {
                test: /.txt$/,
                use: [
                    {
                        loader: getLoader("b-loader.js"),
                    },
                    {
                        loader: getLoader("c-loader.js"),
                    },
                ],
                enforce: "post",
            },
        ],
    },
}
    
a-loader-pitch
b-loader-pitch
c-loader-pitch
c-loader
b-loader
a-loader
```

