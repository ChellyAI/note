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
  - [](#)
  - [](#)
  - [](#)
  - [](#)
  - [](#)
  - [](#)
  - [](#)
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