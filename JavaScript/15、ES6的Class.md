# ES6 Class

目录
- [一、简介](#des)
    - [constructor方法](#constructor)
    - [类的实例](#new)
    - [class表达式](#class)
    - [注意](#attention)
- [二、静态方法](#static)
- [三、实例属性的新写法](#property)
- [四、静态属性](#static-property)
- [五、class的继承](#extends)
    - [ES6继承简介](#description)
    - [Object.getPrototypeOf()](#getPrototypeOf)
    - [super关键字](#super)
    - [类的prorotype和__proto__](#prototype-proto)
---
## <span id="des">**简介**</span>

&emsp;&emsp;类（class）是在JavaScript中编写构造函数的新方法。它是使用构造函数的语法糖，底层还是原型和基于原型的继承

例如ES5中的写法：
```js
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return this.x + this.y;
}

const P = new Point(2, 3);
```
换成ES6中的 `class` 写法就是：
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + this.y;
    }
}
```

&emsp;&emsp;类完全可以看作构造函数的另一种写法，类的数据类型就是函数
```js
class Point {
    //  some code
}

typeof Point    //  function
Point === Point.prototype.constructor   //  true
```

&emsp;&emsp;类的所有方法都定义在类的 `prototype` 属性上，因此在类的实例上面调用方法，其实就是调用原型上的方法。
```js
class Point {
    constructor() {
        //  some code
    }

    toString() {
        //  code
    }

    toValue() {
        //  code
    }
}

//  等同于

Point.prototype = {
    constructor() {},
    toString() {},
    toValue() {},
};
```

&emsp;&emsp;类必须使用 `new` 调用，这是它跟普通构造函数的一个主要区别，后者不用也可以执行
```js
class Foo() {
    constructor() {
        //  code
    }
}

Foo();  //  TypeError: Class constructor Foo cannot be invoked without 'new'
```

### <span id="constructor">**constructor 方法**</span>

&emsp;&emsp;constructor方法是类的默认方法，一个类必须有它，如果没有显式定义，一个空的constructtor方法会被默认添加。

### <span id="new">**类的实例**</span>

&emsp;&emsp;实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即class上）
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return this.x + this.y;
    }
}

const point1 = new Point(2, 3);

point.hasOwnProperty('x');  //  true
point.hasOwnProperty('toString');   //  false
point.__proto__.hasOwnProperty('toString'); //  true
```

### <span id="class">**Class表达式**</span>

&emsp;&emsp;与函数一样，类也可以用表达式的形式来定义
```js
const newClass = class Point {
    toString() {
        return this.x + this.y;
    }
}
```

### <span id="attention">**注意**</span>

- 不存在提升
```js
new Foo();  //  ReferenceError
class Foo {}
```
- this指向

&emsp;&emsp;类的方法内部如果含有 `this`，它默认指向类的实例

&emsp;&emsp;一旦单独使用该方法，很可能报错
```js
class Person {
    printName(name = 'cai') {
        this.print(`hello ${name}`);
    }

    print(text) {
        console.log(text);
    }
}

const child = new Person();
const { printName } = child;
printName();    //  TypeError: Cannot read property 'print' of undefined
```
&emsp;&emsp;以上代码中，`printName` 方法中的 `this` 默认指向实例，但是如果将方法提取出来使用，`this` 会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 `this` 实际指向 `undefined`），从而导致找不到 `print` 方法而报错。

&emsp;&emsp;一个简单的解决办法是，在构造函数中绑定 `this`，这样就不会找不到了；另一个办法是使用箭头函数。
```js
class Person {
    constructor() {
        this.printName = this.printName.bind(this);
    }
}

//  箭头函数
class Person {
    constructor() {
        this.getThis = () => this;
    }
}

const child = new Person();
child.getThis() === child;  //  true
```
---
## <span id="static">**静态方法**</span>

&emsp;&emsp;如果在一个方法前加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就成为**静态方法**。
```js
class Person {
    static toString() {
        return 'caisiqi';
    }
}

Person.toString();  //  caisiqi

const child = new Person();
child.toString();   //  TypeError: child.toString is not a function
```

&emsp;&emsp;需要注意的是：
1. 如果静态方法中包含 `this` 关键字，这里的 `this` 指的是类，而不是实例
2. 静态方法可以与非静态方法重名
3. 父类的静态方法可以被子类继承

---
## <span id="property">**三、实例属性的新写法**</span>

&emsp;&emsp;除了绑定在 `constructor` 方法里的 `this` 上面，还可以定义在类的最顶层。
```js
class Person {
    constructor() {
        this.age = 16;
    }
}

class Person {
    age = 16;
}
```
---
## <span id="static-property">**四、静态属性**</span>

&emsp;&emsp;跟静态方法类似：
```js
class Person {
    static name = 'human';
}
```
---
## <span id="extends">**五、class的继承**</span>

### <span id="description">**ES6继承简介**</span>

&emsp;&emsp;类可以通过 `extends` 关键字实现继承。
```js
class Person {
    //  code
}

class Child extends Person {
    constructor(name, age, school) {
        super(name, age);
        this.school = school;
    }

    toString() {
        return this.name + this.age + super.toString();
    }
}
```
&emsp;&emsp;以上代码中，使用了 `super` 关键字，在这里表示父类的构造函数，用来新建父类的 `this` 对象。子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类自己的 `this` 对象必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其加工。

&emsp;&emsp;ES5 的继承实质是先创造子类实例对象 `this`，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`)，然后再用子类的构造函数修改 `this` 对象；

&emsp;&emsp;如果子类没有定义 `constructor` 方法，那么该方法会被默认添加。在子类构造函数中，只有调用 `this` 之后，才可以使用 `this` 关键字，否则会报错。这是因为子类实例的构建基于父类实例，只有 `super` 方法才能调用父类实例。
```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        this.color = color; //  ReferenceError
        super(x, y);
        this.color = color; //  正确方式
    }
}
```
### <span id="getprototypeof">**Object.getPrototypeOf()**</span>

&emsp;&emsp;`Object.getPrototypeOf` 方法可以从子类上获取父类
```js
Object.getPrototypeOf(ColorPoint) === Point;    //  true
```

### <span id="super">**super关键字**</span>

&emsp;&emsp;`super` 关键字既可以当作函数使用，也可以作为对象使用，两种情况下用法完全不同。

- **第一种情况，`super` 作为函数调用时，代表父类的构造函数。**

&emsp;&emsp;需要注意的是，子类构造函数中调用的 `super` 虽然代表了父类的构造函数，但是返回的是子类的实例。因此 `super()` 相当于 `A.prototype.constructor.call(this)`。
```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}

new A() // A
new B() // B
```
- **第二种情况，`super` 作为对象时，在普通方法中指向父类的原型对象；在静态方法中指向父类。**

&emsp;&emsp;需要注意的是，由于 `super` 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 `super` 调用的。

### <span id="prototype-proto">**类的prototype和__proto__**</span>

&emsp;&emsp;Class作为构造函数的语法糖，同时有 `prototype` 和 `__proto__` 属性，因此存在两条继承链。
1. 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类
2. 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性
3. 子类实例的 `__proto__` 属性的 `__proto__` 属性，指向父类实例的 `__proto__` 属性。也就是说，子类的原型的原型，是父类的原型。