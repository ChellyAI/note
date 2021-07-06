# commit规范

[TOC]

## commit信息结构

### 1、概述

&emsp;&emsp;commit 信息的结构如下所示：

```javascript
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

&emsp;&emsp;日常工作中提交 commit ，建议尽量细化每次的提交内容，例如修复一个 bug、完成一个新功能后，就提交一次commit，使提交记录更加清晰、细致，方便后续项目代码的维护、查看。

### 2、type

&emsp;&emsp;type用于直观表明本次 commit 的作用。普遍参考的 [Angular.js 的规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)，主要设置有如下几种类型：

- feat：新功能（feature）
- fix：修复bug
- docs：文档类更改
- style：不影响代码运行、构建等逻辑的格式上的优化（代码空格数量、缺失分号等）
- refactor：既不是新功能，也不是修bug的代码更改
- perf：性能优化
- chore：构建过程、辅助工具的更改

### 3、scope[可选]

&emsp;&emsp;scope说明本次 commit 的影响范围，一般指代码位置、所属模块等。建议在 `type` 为 `fix` 时，此处填写修复的 bug 编号，方便之后的查询。

### 4、subject

&emsp;&emsp;subject是 commit 信息的描述，相比 body 更为简短。

### 5、body[可选]

&emsp;&emsp;body是 commit 信息的详细描述。如果 subject 足够描述清楚，则 body 可以省略不写。

### 6、footer[可选]

&emsp;&emsp;footer包含重大更改、关联的 issues 等内容。

## 示例

&emsp;&emsp;以下是 Angular.js 给出的[例子](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.8sw072iehlhg)：

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

&emsp;&emsp;去 Github 上查看 Angular 的提交记录可以看到，最基础的 commit 有 type、scope、subject 三个部分即可。

## 辅助工具

### VS Code 插件 Commit Message Editor

&emsp;&emsp;这款插件可以很方便给出一个结构体或者表单，我们只需要在其中进行编辑就能获得一个标准的 commit 信息。
