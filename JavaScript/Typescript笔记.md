# TypeScript 笔记

## <span id="menu">目录</span>

- [非官方中文手册](https://github.com/ChellyAI/TypeScript)
- [非官方个人教程](https://ts.xcatliu.com/basics/primitive-data-types.html)
- [前言](#description)
- [基础](#base)
  - [原始数据类型](#original)
    - [布尔值](#boolean)
    - [数值](#number)
    - [字符串](#string)
    - [空值](#void)
    - [null 和 undefined](#null-undefined)
    - [Unknown](#unknown)
    - [Any](#any)
    - [Void](#void)
    - [Never](#never)
    - [Object](#object)
  - [任意值](#any)
  - [类型推论](#type-inference)
  - [联合类型](#union-types)
  - [对象的类型——接口](#interfaces)
  - [数组的类型](#array)
    - [数组泛型](#array-generic)
  - [函数的类型](#function)
  - [类型断言](#type-assertion)
  - [内置对象](#inner-object)
  - [类型别名](#type)
  - [字面量类型](#string-type)
  - [元组](#tuple)
  - [枚举](#enum)
  - [类](#class)
  - [类与接口](#class-interface)
  - [泛型](#generic)
  - [声明合并](#concat)
- [进阶](#supreme)
  - [声明文件](#definitely-file)
    - [新语法](#new-language)



---

## <span id="description">**前言**</span>

&emsp;&emsp;**JavaScript 是动态弱类型的语言。**

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

&emsp;&emsp;JavaScript 原始数据类型包括有：布尔值、数值、字符串、null、undefined、ES6 的 Symbol 和 BigInt，而 TypeScript 中还有 unknown、any、never、void、object等其他类型。

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

&emsp;&emsp;用 `number` 定义数值类型，而大整数的类型是 `bigint`。

```typescript
let age: number = 16;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;

let bigLiteral: bigint = 100n;
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

#### <span id="unknown">**Unknown**</span>

&emsp;&emsp;写应用时可能会需要描述一个还不知道其类型的变量，这些值可以来自动态内容，例如用户输入或者 API 接收。这种情况下，我们想要让编译器知道这个变量可以是任意类型，此时可以使用 `unknown` 类型：

```typescript
let notSure: unknown = 1;
notSure = 'maybe a string instead';
```

#### <span id="any">**Any**</span>

&emsp;&emsp;看别人总结的描述，`any` 类型和 `unknown` 基本一样，但 `unknown` 是更安全版本的 `any`，在对 `unknown` 类型的值执行任何操作之前，必须先通过一些方法（类型断言、类型防护等）限定其类型。

#### <span id="void">**Void**</span>

&emsp;&emsp;某种程度上来说，`void` 类型与 `any` 类型相反，它表示没有任何类型。当一个函数没有返回值时，其返回类型就是 `void`。声明一个 `void` 类型的变量没什么卵用，因为只能给它赋值 null （只在 `--strictNullChecks` 未指定时）和 undefined。

#### <span id="never">**Never**</span>

&emsp;&emsp;`never` 类型表示的是那些永不存在的值的类型。

&emsp;&emsp;例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；变量也可能是 `never` 类型，当它们被永不为真的类型保护所约束时。

&emsp;&emsp;`never` 类型是任何类型的子类，也可以赋值给任何类型；然而，没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 类型本身之外），即使 `any` 也不可以赋值给 `never`。

&emsp;&emsp;下例是返回 `never` 类型的函数：

```typescript
//	返回never的函数必须存在无法到达的终点
function error(message: string): never {
    throw new Error(message);
}

//	推断的返回值类型为 never
function fail() {
    return error('Something failed');
}

//	返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while(true) {
        //	code
    }
}
```

#### <span id="object">**Object**</span>

&emsp;&emsp;`object` 表示非原始类型，也就是除 `number`、`string`、`boolean`、`bigint`、`symbol`、`null` 或 `undefined` 之外的类型。

&emsp;&emsp;使用 `object` 类型，就可以更好的表示像 `Object.create` 这样的 API。例如：

```typescript
declare function create(o: object | null): void;

create({ prop: 0 });	//	OK
create(null);	//	ok

create(24);	//	error
create('string');	//	error
create(false);	//	error
create(undefined);	//	error
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

[返回目录](#menu)

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

[返回目录](#menu)

---

### <span id="type-assertion">**类型断言**</span>

&emsp;&emsp;通过类型断言可以告诉编译器，“我知道我在干什么”，达成类型转换但不进行特殊数据检查和解构的目的。TypeScript 会假设使用者已经进行了必要的检查。

&emsp;&emsp;类型断言有两种形式，其一是尖括号语法，其二是 `as` 语法，当**在 TypeScript 中使用 JSX 时，必须使用 `as` 语法的类型断言：

```typescript
let someValue: any = 'a string';

let strLength: number = (<string>someValue).length;
let strLength: number = (someValue as string).length;
```

&emsp;&emsp;个人看了一圈感觉没卵用，不如直接使用[**泛型**](#generic)

[返回目录](#menu)

---

### <span id="inner-object">**内置对象**</span>

&emsp;&emsp;标准的内置对象有 `Boolean` `Error`  `Date` `RegExp` 等；

&emsp;&emsp;DOM 和 BOM 提供的内置对象有 `Document` `HTMLElement` `Event` `NodeList` 等；

&emsp;&emsp;更多可以看看 [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)，它们的定义文件在 [TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中；

&emsp;&emsp;Node.js 不是内置对象的一部分，想用 TypeScript 写 Node.js，需要引入第三方声明文件

```
npm install @types/node --save-dev
```

[返回目录](#menu)

---

### <span id="type">**类型别名**</span>

&emsp;&emsp;类型别名用来给一个类型起新名字，使用 `type` 创建类型别名，它常用于联合类型。

```typescript
type Name = string;
type GetName = () => string;
type NameOrGetName = Name | GetName;
function func(name: NameOrGetName): Name {
    if (typeof name === 'string') {
        return name;
    }
    else {
        return name();
    }
}
```

[返回目录](#menu)

---

### <span id="string-type">**字面量类型**</span>

**字符串字面量类型**

&emsp;&emsp;字符串字面量类型用来约束取值，只能是某几个字符串中的一个。

```typescript
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    //	some code
}

handleEvent(document.getElementById('root'), 'scroll');	//	可以
handleEvent(document.getElementById('app'), 'dblclick');	//	报错，event 不能是 'dblclick'
```

&emsp;&emsp;上例中，使用 `type` 定义了一个字符串字面量类型 `EventNames`，它只能取三个字符串中的一种。

**注意：**

&emsp;&emsp;类型别名与字符串字面量类型都是用 `type` 进行定义。

**数字字面量类型**

&emsp;&emsp;行为与字符串字面量类型相同，它通常用来描述配置值：

```typescript
interface Config {
    width: number;
    height: number;
    size: 8 | 16 | 24;
}
```

**布尔字面量类型**

&emsp;&emsp;可以使用布尔字面量类型来约束某些属性之间互有关联的对象：

```typescript
interface ValidateSuccess {
    isValid: true;
    reason: null;
}

interface ValidateFailure {
    isValid: false;
    reason: string;
}

type ValidateResult = ValidateSuccess | ValidateFaliure;
```

[返回目录](#menu)

---

### <span id="tuple">**元组**</span>

&emsp;&emsp;元组类型（Tuple）允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。可以理解为数组合并相同类型的对象，而元组（Tuple）合并了不同类型的对象。

&emsp;&emsp;定义一对值分别为 `string` 和 `number` 的元组：

```typescript
//	正确
let wife: [string, number] = ['雪ノ下雪乃', 16];

//	报错
let wife: [string, number] = [16, '雪ノ下雪乃'];
```

&emsp;&emsp;赋值或访问一个已知索引的元素时，会得到正确的类型：

```typescript
let wife: [string, number];
wife[0] = '雪ノ下雪乃';
wife[1] = 16;

wife[0].slice(1);
wife[1].toFixed(2);
```

&emsp;&emsp;也可以只赋值其中某一项：

```typescript
let wife: [string, number];
wife[0] = '雪ノ下雪乃';
```

&emsp;&emsp;但是直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项：

```typescript
let wife: [string, number];
wife = ['雪ノ下雪乃', 16];
```

&emsp;&emsp;添加越界的元素时，元素类型会被限制为元组中每个类型的联合类型：

```typescript
let wife: [string, number];

wife = ['雪ノ下雪乃', 16];
wife.push(true);	//	Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

[返回目录](#menu)

---

### <span id="enum">**枚举**</span>

&emsp;&emsp;枚举（Enum）类型用于取值被限定在一定范围内的场景。比如一周七天、光的三原色为红黄绿等。

&emsp;&emsp;枚举使用 `enum` 关键字来定义，枚举成员会被赋值为从 `0` 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```typescript
enum Color {Red, Yellow, Green};

console.log(Color['Red'] === 0);	//	true
console.log(Color['Yellow'] === 1);	//	true
console.log(Color['Green'] === 2);	//	true

console.log(Color[0] === 'Red');	//	true
console.log(Color[1] === 'Yellow');	//	true
console.log(Color[2] === 'Green');	//	true
```

**手动赋值**

&emsp;&emsp;可以手动给枚举项赋值，未赋值的枚举项会接着上一个枚举项递增。可以是小数、负数，如果未手动赋值的枚举项与手动赋值的重复，后面的会覆盖前面的，所以最好不要有重复。

```typescript
enum Color {Red = -2, Yellow, Blue = 8.5, Green};

console.log(Color['Yellow'] === -1);	//	true
console.log(Color['Green'] === 9.5);	//	true
```

**计算所得项**

&emsp;&emsp;前面都是常数项，还可以是计算所得项：

```typescript
enum Color {Red, Yellow = 'Yellow'.length};
```

&emsp;&emsp;但假如紧接在计算所得项后面的是未手动赋值的项，那么它就会因无法获得初始值而报错：

```typescript
enum Color {Red = 'Red'.length, Yellow};	//	error: Enum menber must have initializer.
```

**常数枚举**

&emsp;&emsp;常数枚举是使用 `const enum` 定义的枚举类型：

```typescript
const enum Directions {Up, Down, Left, Right};

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

&emsp;&emsp;常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。如果包含，会在编译阶段报错。

```typescript
const enum Directions {Up, Down, Left, Right};

console.log(Directions);	//	会报错
//	"const" 枚举仅可在属性、索引访问表达式、导入声明的右侧、导出分配或类型查询中使用
```



**外部枚举**

&emsp;&emsp;外部枚举是使用 `declare enum` 定义的枚举类型：

```typescript
declare enum Directions {Up, Down, Left, Right};
```

&emsp;&emsp;`declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。

&emsp;&emsp;外部枚举与声明语句一样，常出现在声明文件中。

&emsp;&emsp;同时使用 `declare` 和 `const` 也是可以的。

[返回目录](#menu)

---

### <span id="class">**类**</span>

[返回目录](#menu)

---

### <span id="class-interface">**类与接口**</span>

&emsp;&emsp;实现（implements）是面向对象中的一个重要概念。一般，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候可以把特性提取成接口（interface），用 `implements` 关键字来实现。

&emsp;&emsp;例如防盗门是门的子类，它和车一样都有报警器，因此可以将报警器提取成一个接口：

```typescript
interface Alarm {
    alert(): void;
}

class Door {}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor Alarm');
    }
}

class Car implements Alarm {
    alert() {
        console.log('car Alarm');
    }
}
```

&emsp;&emsp;一个类也可以实现（implements）多个接口（interface）:

```typescript
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        //	code
    }

    lightOn() {
        //	code
    }

    lightOff() {
        //	code
    }
}
```

**接口继承接口**

```typescript
interface Alarm {
    alert(): void;
}

interface LightAndAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

**接口继承类**

&emsp;&emsp;其原理是声明一个类时，同时也创建了一个同名的类型（实例的类型），所以 `接口继承类` 和 `接口继承接口` 没有什么本质区别。

**注意：**创建的类型相比于类，缺少构造函数、静态属性、静态方法，因为实例的类型是不包含它们的。也就是<font color="red">声明类时创建的类型只包含其中的实例属性和实例方法。</font>

```typescript
class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    printPoint() {
        console.log(this.x, this.y);
    }
    //	静态属性，坐标系原点
    static origin = new Point(0, 0)
    //	静态方法，求与原点距离
	static distanceToOrigin(p: Point) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
}

//	接口继承类
interface 3DPoint extends Point {
    z: number;
}

//	将类（class）当作接口（interface）使用
function getPosition(p: Point) {
    console.log(p.x, p.y);
}

//	类型Point与以下类型等价
interface Faker {
    x: number;
    y: number;
    printPoint(): void;
}
```

[返回目录](#menu)

---

### <span id="generic">**泛型**</span>

&emsp;&emsp;泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

&emsp;&emsp;举例说明，我们首先实现一个函数 createArray，它将创建一个指定长度的数组，每一项都填充一个默认值：

```typescript
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x');	//	['x', 'x', 'x']
```

&emsp;&emsp;以上代码虽然可以直接用了，但一个缺陷是未能准确定义返回值类型。使用 `any` 将允许每一项都为任意类型。我们的预期是输入 `value` 的类型应该就是每一项的类型。此时就可以使用泛型来应对：

```typescript
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x');	//	['x', 'x', 'x']
//	类型推论也可以
createArray(3, 'x');
```

&emsp;&emsp;函数名后面添加了 `<T>` ，其中 `T` 用来指代任意输入的类型，在后面的输入 `value: T` 和输出 `Array<T>` 中即可使用。接着在调用的时候，既可以手动指定具体类型为 `string` ，也可以让类型推论自动推算。

&emsp;&emsp;定义泛型的时候也可以一次定义多个类型参数：

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']);	//	['seven', 7]
```

**泛型约束**

&emsp;&emsp;在函数内部使用泛型变量，由于事先不知道其类型，因此不能随意操作它的属性或方法。此时可以对泛型进行约束，例如某个泛型 `T` 不一定包含属性 `length`，但约束后只允许函数传入包含 `length` 属性的变量。

```typescript
//	error: Property 'length' does not exist on type 'T'
function checkType<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}

//	泛型约束其实类似接口的继承
interface Lengthwise {
    length: number
}

function checkType<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

checkType(6);	//	在编译阶段就会报错，因为 6 没有 length 属性
```

&emsp;&emsp;多个类型参数之间也可以相互约束，下例中要求 `T` 继承 `U`，这就保证 `U` 中不会出现 `T` 中不存在的字段：

```typescript
function copy<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = {a: 1, b: 2, c: 3, d: 4};

const result = copy(x, {b: 10, d: 20});
console.log(result);	//	{a: 1, b: 10, c: 3, d: 20}
```

**泛型接口**

&emsp;&emsp;之前介绍过可以使用接口的方式来定义一个函数需要符合的形状，因此也可以使用含有泛型的接口来定义函数的形状：

```typescript
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x');	//	['x', 'x', 'x']
```

&emsp;&emsp;也可以把泛型的参数提前到接口名上：

```typescript
//	<T>被提前到了接口名上
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

//	注意这里使用泛型接口的时候，需要定义泛型的类型，于是这里就添加了一个<any>
let createArray: CreateArrayFunc<any>;
```

**泛型类**

&emsp;&emsp;与泛型接口类似，泛型也可以用于类的类型定义中：

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myNum = new GenericNumber<number>();
myNum.zeroValue = 0;
myNum.add = function(x, y) {
    return x + y;
};
```

**设定泛型参数的默认类型**

&emsp;&emsp;在 TypeScript 2.3以后，可以为泛型中的类型参数设定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

[返回目录](#menu)

---

### <span id="concat">**声明合并**</span>

&emsp;&emsp;如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。

&emsp;&emsp;函数的合并参考重载；

&emsp;&emsp;接口的合并，会将接口的属性简单合并到一个接口中，但需要注意的是**合并的属性的类型必须是唯一的**；

```typescript
interface Wife {
    name: string;
}

interface Wife {
    name: number;	//	会报错，后续声明属性必须是同一类型
    age: number;
}
```

&emsp;&emsp;类的合并与接口合并规则一致。

[返回目录](#menu)

---

## <span id="supereme">**进阶**</span>
### <span id="definitely-file">**声明文件**</span>

#### <span id="new-language">**新语法**</span>

- [declare var let const](#declare-var) 声明全局变量
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

[返回目录](#menu)
