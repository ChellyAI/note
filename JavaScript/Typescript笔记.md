# TypeScript 笔记

## <span id="menu">目录</span>

- [前言](#description)
- [基础](#base)
  - [原始数据类型](#original)
    - [布尔值](#boolean)
    - [数值](#number)
    - [字符串](#string)
    - [空值](#void)
    - [null 和 undefined](#null-undefined)
  - [任意值](#any)
  - [类型推论](#type-inference)
  - [联合类型](#union-types)
  - [对象的类型——接口](#interfaces)
  - [数组的类型](#array)
    - [数组泛型](#array-generic)
  - [函数的类型](#function)
  - [类型断言](#type-assertion)
  - [声明文件](#definitely-file)
    - [新语法](#new-language)
  - [内置对象](#inner-object)
  - [](#)
  - [](#)
  - [](#)
  - [](#)
  - [](#)
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

[返回目录](#menu)

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

[返回目录](#menu)

---

### <span id="any">**任意值**</span>

&emsp;&emsp;任意值表示允许赋值为任意类型。

&emsp;&emsp;一个普通类型，在赋值过程中是不允许改变类型的，但如果是 `any` 类型，就可以允许：

```typescript
let myNumber: string = 'six';
myNumber = 6;
//	type 'number' is not assignable to type 'string'

let myNumber: any = 'six';
myNumber = 6;
```

&emsp;&emsp;在任意值上访问任何的属性、方法都是允许的，可以认为，**声明一个变量为任意值后，对它的任何操作，返回的内容的类型都是任意值**。

```typescript
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);

let anyThing: any = '雪ノ下雪乃';
anyThing.sayName();
anyThing.sayName().sayHello();
```

&emsp;&emsp;**如果变量在声明的时候没有指定其类型，那么它就会被识别为任意值类型。**

[返回目录](#menu)

---

### <span id="type-inference">**类型推论**</span>

&emsp;&emsp;如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则 推断出一个类型。

&emsp;&emsp;如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而不会被类型检查。

```typescript
let myNumber = 'six';
myNumber = 7;
//	Type 'number' is not assignable to type 'string'

//	以上代码等价于
let myNumber: string = 'six';
myNumber = 6;

//	any 类型的推论
let myNumber;
myNumber = 'six';
myNumber = 6;
```

[返回目录](#menu)

---

### <span id="union-types">**联合类型**</span>

&emsp;&emsp;联合类型（Union Types）表示取值可以为多种类型中的一种。简单示例如下：

```typescript
//	可行
let myNumber: string | number;
myNumber = 'six';
myNumber = 6;

//	不可行
let myNumber: string | number;
myNumber = true;
//	Type 'boolean' is not assignable to type 'string|number'
//	Type 'boolean' is not assignable to type 'number';
```

&emsp;&emsp;联合类型使用 `|` 分隔每个类型。

**注意：**

&emsp;&emsp;当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，**只能访问此联合类型的所有类型里共有的属性或方法。**

```typescript
//	不可以
function getLength(something: string | number): number {
    return something.length;
}

//	Property 'length' does not exist on type 'string | number'
//	Property 'length' does not exist on type 'number'

//	可以
function getString(something: string | number): string {
    return something.toString();
}
```

&emsp;&emsp;上面的例子中，`length` 不是 `string` 类型和 `number` 类型的共有属性，所以会报错；而共有的 `toString` 方法就不会有问题。

&emsp;&emsp;联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```typescript
let myNumber: string | number;
myNumber = 'six';
console.log(myNumber.length);	//	3
myNumber = 6;
console.log(myNumber.length);	//	报错
//	Property 'length' does not exist on type 'number'
```

&emsp;&emsp;上例中，第二行的 `myNumber` 被推断成了 `string`，因此不会报错；而第四行被推断成为 `number`，访问它的 `length` 就会报错。

[返回目录](#menu)

---

### <span id="interfaces">**对象的类型——接口**</span>

&emsp;&emsp;在面向对象语言中，接口（interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

&emsp;&emsp;TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对 `对象的形状` 进行描述。

&emsp;&emsp;正常使用下，定义的变量比接口多了、少了属性是不允许的：

```typescript
interface Wife {
    name: string;
    age: number;
}

//	多了顺位
let yukino: Wife = {
    name: '雪ノ下雪乃';
    age: 16;
    order: 'first';
};

//	少了age
let yukino: Wife = {
    name: '雪ノ下雪乃';
};
```

&emsp;&emsp;但某些场景下对象的部分属性的确未赋值，那么可以将其设置为**可选属性**：

```typescript
interface Wife {
    name: string;
    age: number;
    order?: string
}
```

&emsp;&emsp;还可以有更随意的场景，希望接口允许有任意的、未定义的属性，可以定义**任意属性**：

```typescript
interface Wife {
    name: string;
    age: number;
    order?: string;
    [propName: string]: any;
}

let yukino: Wife = {
    name: '雪ノ下雪乃';
    age: 16;
    country: '日本';
};
```

**注意：**

&emsp;&emsp;一旦使用了任意属性，那么确定属性和可选属性的类型都必须是任意属性的类型的子集，例如：

```typescript
//	有问题
interface Wife {
    name: string;
    age: number;	//	会报错“类型number的属性age不能赋值给字符串索引类型string
    [propName: string]: string;
}

//	正确
interface Wife {
    name: string;
    age: number;
    [propName: string]: string | number;
}
```

&emsp;&emsp;上例中使用了联合类型作为任意属性的类型。（使用 `any` 也可以，但还是尽量更加严谨点好）

&emsp;&emsp;假如某些属性希望只能在创建的时候被赋值，后续不允许更改，那么可以使用**只读属性**。

```typescript
interface Wife {
    readonly name: string;
    age?: number;
}

let yukino: Wife = {
    name: '雪ノ下雪乃';
};

yukino.name = '一色彩羽';
//	Cannot assign to 'name' because it is a constant or a read-only property
```

**注意：**

&emsp;&emsp;只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候：

```typescript
interface Wife {
    readonly name: string;
    age?: number;
}

let yukino = {
    age: 16,
};

yukino.name = '雪ノ下雪乃';
//	报错有两个，一是定义 yukino 的时候没有给只读属性 name 赋值
//	二是给 name 赋值的时候不允许
```

[返回目录](#menu)

---

### <span id="array">**数组的类型**</span>

&emsp;&emsp;最简单的方法是使用 `类型+方括号` 来表示数组，且不允许出现其他的类型，某些方法的参数也会根据定义的类型进行限制。一个比较常见的做法是用 `any` 表示数组中允许出现的任意类型：

```typescript
let arr: number[] = [1, 2, 3, 4];

arr.push('5');	//	报错

let list: any[] = ['caisiqi', 16, {wife: '雪ノ下雪乃'}];
```

#### <span id="array-generic">**数组泛型**</span>

&emsp;&emsp;还可以使用数组泛型（Array Generic）`Array<elementType>` 来表示数组：

```typescript
let arr: Array<number> = [1, 2, 3];
let arr: Array<number | string | boolean> = [1, '2', false];
```

&emsp;&emsp;具体的泛型可参考[**泛型**](#generic)部分。

&emsp;&emsp;还可以使用接口来表示数组：

```typescript
interface Arr {
    [index: number]: number | string | boolean;
}
let arr: Arr = [1, 2, '3', true];
```

&emsp;&emsp;像 `arguments` 这种类数组（Array-like Object）不是数组类型，不能使用普通的数组方式来描述，而应该用接口。

&emsp;&emsp;常用的类数组都有自己的接口定义，比如 `IArguments`、`NodeList`、`HTMLCollection` 等。其中 `IArguments` 是 TypeScript 中定义好的类型。

```typescript
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}

function sum() {
    let args: IArguments = arguments;
}

interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

&emsp;&emsp;关于内置对象，可以参考[**内置对象**](#inner-object)的部分。

---

### <span id="function">**函数的类型**</span>

&emsp;&emsp;有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）。

&emsp;&emsp;一个函数有输入和输出，需要把约束的类型都考虑到。

**函数声明**

```typescript
function sum(x: number, y: number): number {
    return x + y;
}
```

**函数表达式**

```typescript
let sum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

**用接口定义函数的形状**

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return soure.search(subString) !== -1;
}
```

&emsp;&emsp;使用函数表达式、接口定义函数的类型时，对等号左侧进行类型限制，可以保证以后对函数名赋值时参数个数、参数类型、返回值类型不变。

**可选参数**

&emsp;&emsp;需要注意，可选参数必须接在必需参数的后面。

```typescript
function getName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    }
    else {
        return firstName;
    }
}
```

**参数默认值**

&emsp;&emsp;TypeScript 会将添加了默认值的参数识别为可选参数。

```typescript
function getName(firstName: string = '雪ノ下', lastName: string) {
    return firstName + ' ' + lastName;
}
```

**剩余参数**

```typescript
function push(arr: any[], ...restProps: any[]) {
    //	some code
}
```

**重载**

&emsp;&emsp;重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().hoin(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

---

### <span id="type-assertion">**类型断言**</span>

&emsp;&emsp;看了一圈感觉没卵用，不如直接看看[**泛型**](#generic)

---

### <span id="definitely-file">**声明文件**</span>

#### <span id="new-language">**新语法**</span>

- [declare var](#declare-var) 声明全局变量
- [declare function](#declare-function) 声明全局方法
- [declare class](#declare-class) 声明全局类
- [declare enum](#declare-enum) 声明全局枚举类型
- [declare namespace](#declare-namespace) 声明（含有子属性）的全局对象
- [interface & type](#interface-type) 声明全局类型
- [export](#export) 导出变量
- [export namespace](#export-namespace) 导出（含有子属性）的对象
- [export default](#export-default) ES6 默认导出
- [export =](#export-=) commonjs 导出模块
- [export as namespace](#export-as-namespace) UMD 库声明全局变量
- [declare global](#declare-global) 扩展全局变量
- [declare module](#declare-module) 扩展模块
- [/// <reference />](#///-reference) 三斜线指令

---

### <span id="inner-object">**内置对象**</span>

&emsp;&emsp;标准的内置对象有 `Boolean` `Error`  `Date` `RegExp` 等；

&emsp;&emsp;DOM 和 BOM 提供的内置对象有 `Document` `HTMLElement` `Event` `NodeList` 等；

&emsp;&emsp;更多可以看看 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)，它们的定义文件在 [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中；

&emsp;&emsp;Node.js 不是内置对象的一部分，想用 TypeScript 写 Node.js，需要引入第三方声明文件

```
npm install @types/node --save-dev
```

