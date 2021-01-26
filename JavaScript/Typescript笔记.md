# TypeScript 笔记

## 目录

- [前言](#description)
- [基础](#base)
  - [原始数据类型](#original)
    - [布尔值](#boolean)
    - [数值](#number)
    - [字符串](#string)
    - [空值](#void)
    - [null 和 undefined](#null-undefined)
  - [任意值](#any)
  - [](#)



---

## <span id="description">**前言**</span>

&emsp;&emsp;**TypeScript 是静态类型**。

&emsp;&emsp;类型系统按照 `类型检查的时机` 来分类，可以分为动态类型和静态类型。

&emsp;&emsp;**动态类型**是在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误，例如：JavaScript 动态类型，它是一门解释型语言，没有编译阶段；

&emsp;&emsp;**静态类型**是指编译阶段就能确定每个变量的类型，这种语言的类型错误会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查。

&emsp;&emsp;**TypeScript是弱类型**

&emsp;&emsp;类型系统按照 `是否允许隐式类型转换` 来分类，可以分为强类型和弱类型。

&emsp;&emsp;TypeScript 完全兼容 JavaScript，它们都是弱类型。

&emsp;&emsp;编译一个 TypeScript 文件如下：

```JS
tsc hello.ts
```

&emsp;&emsp;这样就能生成一个编译好的文件 `hello.js`。

&emsp;&emsp;TypeScript 编译的时候即使报错了，还是会生成编译结果。想要在报错的时候终止 js 文件的生成，可以在 `tsconfig.json` 中配置 `noEmitOnError` 即可。

&emsp;&emsp;关于 `tsconfig.json` 可以看[官方手册](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)

---

## <span id="base">**基础**</span>

### <span id="original">**原始数据类型**</span>

&emsp;&emsp;JavaScript 原始数据类型包括有：布尔值、数值、字符串、null、undefined、ES6 的 Symbol 和 BigInt。

&emsp;&emsp;这里主要介绍的是**前五种**类型的应用。

#### <span id="boolean">**布尔值**</span>

&emsp;&emsp;在 TypeScript 中，使用 `boolean` 定义布尔值类型：

```typescript
let isDone: boolean = false;
```

**注意：**使用构造函数生成的 `Boolean` 对象**不是**布尔值，它返回的是一个 `Boolean` 对象。

```typescript
let createBoolean: boolean = new Boolean(1);
//	Type 'Boolean' is not assignable to type 'boolean'

let createBoolean: Boolean = new Boolean(1);
//	没问题

let createBoolean: boolean = Boolean(1);
//	没问题
```

#### <span id="number">**数值**</span>

&emsp;&emsp;用 `number` 定义数值类型：

```typescript
let age: number = 16;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

#### <span id="string">**字符串**</span>

&emsp;&emsp;用 `string` 定义字符串类型：

```typescript
let name: string = '雪ノ下雪乃';
```

#### <span id="void">**空值**</span>

&emsp;&emsp;JavaScript 没有空值概念，在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数。声明一个 `void` 类型的变量没什么用，因为只能将它赋值为 `null` 和 `undefined`。

```typescript
function getName(): void {
    return 'my wife is 雪ノ下雪乃';
}

let emptyValue: void = undefined;
```

#### <span id="null-undefined">**Null 和 Undefined**</span>

&emsp;&emsp;用 `null` 和 `undefined` 来定义这两个类型，与 `void` 的区别是，`null` 和 `undefined` 是所有类型的子类型，也就是 `undefined` 类型的变量可以赋值给 `number` 类型的变量，但 `void` 类型的变量不能赋值给 `number` 类型的变量：

```typescript
let u: undefined = undefined;
let n: null = null;

//	以下非严格模式不会报错
let num: number = undefined;
//	or
let num: number = u;

let emptyValue: void;
let num: number = emptyValue;
//	Type 'void' is not assignable to type 'number'
```

---

### <span id="any">**任意值**</span>

