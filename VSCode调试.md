# 一、VS Code Node.js 入门指导

## 创建一个Express应用

&emsp;&emsp;Express是一个非常流行的用于构建并运行Node.js应用的框架。你可以使用Express生成工具构建一个新的Express应用。

&emsp;&emsp;在终端中运行以下命令来安装Express Generator：

```
npm install -g express-generator
```

&emsp;&emsp;现在我们可以创建一个名为`myExpressApp`的Express应用通过运行：

```
express myExpressApp --view pug
```

&emsp;&emsp;这段命令创建一个名为`myExpressApp`的文件夹，它包含了你的应用。`--view pug`参数告诉generator使用pug模版引擎。

&emsp;&emsp;去新文件夹下执行`npm install`安装全部依赖。

&emsp;&emsp;此时，我们应该试试应用能否运行。在`package.json`文件中包含一个`start`脚本来执行`node ./bin/www`。这个脚本将开始运行Node.js应用。在这个Express应用的文件夹中打开一个终端，执行

```
npm start
```

&emsp;&emsp;这个Node.js的web server将启动，你可以访问[http://localhost:3000](http://localhost:3000)来查看。

## Debug你的Express应用

&emsp;&emsp;你需要为你的Express应用创建一个debugger设置文件`launch.json`。在活动栏中点击“运行”图标，再点击顶部的设置齿轮图标创建一个默认的`launch.json`文件。通过将`configurations`中的`type`属性设置为`node`来确保选择的是**Node.js**环境。当这个文件被初次创建后，VS Code将检查`package.json`中的`start`脚本，并将其作为**Launch Program**选项的`program`。

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}\\bin\\www"
    }
  ]
}
```

&emsp;&emsp;保存这个新文件，并确保运行视图顶部下拉框中选定的是**Launch Program**。打开`app.js`文件，设置一个断点。按下`F5`来开始调试应用。VS Code将在一个新终端中启动server服务，并在断点处停止运行。此时，你可以检查变量、创建watches、逐行跳过你的代码。

# 二、VS Code中的Node.js调试

&emsp;&emsp;VS Code编辑器内含对Node.js调试环境的支持，可以调试JavaScript、TypeScript和其他能转译为JavaScript的语言。可以直接使用VS Code提供的启动默认值、代码片段来开始调试Node.js项目。

&emsp;&emsp;在VS Code中可以通过以下方式调试你的Node.js项目：

- 在VS Code集成的终端里运行的process，可以使用auto attach来调试；
- 与使用集成终端类似，使用JavaScript debug terminal；
- 使用一个launch config来启动你的项目，或者attach一个VS Code之外启动的process。

## 1、Auto Attach

如果**Auto Attach**功能被开启，Node调试器会自动attach上VS Code集成终端里运行的Node.js进程。想要开启此功能，可以从命令面板中（shift+command+p）使用**Toggle Auto Attach**命令，或者如果它已被激活，点击**Auto Attach**状态栏item。

&emsp;&emsp;auto attach（自动附加）有三种模式，你可以通过**debug.javascript.autoAttachFilter**快速选择并设置：

- `smart`（default）- 如果你在`node_modules`目录之外执行脚本，或者使用了公共“运行”脚本如：mocha或ts-node，这个进程将被调试。你可以自定义设置允许的“运行”脚本名单；
- `always` - 在集成终端里启动的所有Node.js进程都会被调试；
- `onlyWithFlag` - 只有使用`--inspect`或`--inspect-brk`标记启动的进程会被调试。

&emsp;&emsp;开启**Auto Attach**后，你需要重启你的终端。可以点击终端右上方的⚠图标，或干脆新建一个终端来达成。然后，调试器应在一秒内attach到你的项目。`Auto Attach`会出现在VS Code窗口底部的状态栏中。点击它可以切换模式，或暂时将其关闭。

### 额外配置

#### 其他的启动配置属性

&emsp;&emsp;你可以使用`launch.json`中其他默认属性来自动附加到**debug.javascript.terminalOptions**设置中。例如，在skipFiles（略过文件）中添加node部件，你可以在VS Code个人或工作区设置中如下配置：

```json
"debug.javascript.terminalOptions": {
  "skipFiles": ["<node_internals>/**"]
},
```

#### 自动附加的智能模式参数

&emsp;&emsp;在智能模式下，VS Code会attach你的代码，对你在调试中不感兴趣的构建工具不做处理。它通过与一列表的全局格式匹配主要脚本来实现。这些格式在**debug.javascript.autoAttachSmartPattern**中设置，默认为：

```json
[
  '!**/node_modules/**',	//	exclude scripts in node_modules folders
  '**/$KNOWN_TOOLS&/**'	//	but include some common tools
]
```

&emsp;&emsp;`$KNOWN_TOOLS$`替代列举一些公共的代码运行命令如`ts-node`、`mocha`、`ava`等。如果它不生效你可以做修改。例如，去掉`mocha`并包括入`my-cool-test-runner`，你可以添加以下两行：

```json
[
  '!**/node_modules/**',
  '**/$KNOWN_TOOLS/**',
  '!**node_modules/mocha/**',	//	use "!" to exclude all scripts in "mocha" node modules
  '**/node_modules/my-cool-test-runner/**'	//	include scripts in the custom test runner
]
```

## 2、JavaScript Debug Terminal

&emsp;&emsp;与`auto attach`类似，JavaScript Debug Terminal将自动调试任何你在其中运行的Node.js进程。可以通过在终端切换的下拉框中选择**Create JavaScript Debug Terminal**来创建。

### 额外配置

#### 其他的启动配置属性

&emsp;&emsp;你可以使用`launch.json`中的其他属性来应用到**debug.javascript.terminalOptions**设置中。（举例与上方添加忽略node自身部件相同）

## 3、启动配置的属性 Launch configuration attributes

&emsp;&emsp;调试的配置被存在你工作区`.vscode`文件夹下的`launch.json`文件中。下方是供Node.js调试器参考的公共配置属性，你可以在[vscode-js-debug options文档](https://github.com/microsoft/vscode-js-debug/blob/main/OPTIONS.md)查看完整的选项。

#### 以下属性支持attach与launch两种方式

- `outFiles` - 用于定位生成的JavaScript文件的glob patterns的数组。参见[Source maps](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps)
- `resolveSourceMapLocations` - 用来表示source maps应该被解析的glob patterns数组。参见Source maps。
- `timeout` - 当重启一个某个环节，在这个设定的毫秒数后停止它。参见[Attaching to Node.js](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_attaching-to-nodejs)
- `stopOnEntry` - 当项目启动后立即暂停
- `localRoot` - VS Code根目录。参见[Remote debugging](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_remote-debugging)
- `remoteRoot` - Node根目录。参见Remote debugging
- `smartStep` - 尝试自动跳过与源文件不匹配的代码。参见[Smart stepping](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_smart-stepping)
- `skipFiles` - 自动跳过这些glob patterns覆盖的文件。参见[Skipping uninteresting code](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_skipping-uninteresting-code)
- `trace` - 启用诊断输出。

#### 以下属性只支持启动配置

- `program` - 想要调试的Node.js程序的绝对路径。
- `args` - 