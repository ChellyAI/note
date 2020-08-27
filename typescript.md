## 什么是Typescript

Typescript是js的超集，主要提供了类型系统和对es6的支持 ；

定义变量、函数、数组、对象等时，需要给定相关类型；

使用ts,增加了代码的可读性与可维护性；


## 类型系统

### 类型表示的总结

- 原始数据类型

  1. 布尔
  2. 数值
  3. 字符串
  4. void

      > void与null、undefined的区别？
      undefined与null可以赋值给其他类型，如下
      
      ```javascript
        let num: number = undefined;
        //这种垃圾用法，不会有人会用吧
      ```

  5. null
  6. undefined
  7. any
  8. symbol

      类型：unique symbol
      ```javascript
        const PROD: unique symbol = Symbol('prodution mode');
      ```

  9. never `函数从来不会返回`时使用,有两种场景
      > 第一种， 一个函数从来不会有返回值,如下：
        ```typescript
          function fail(message: string): never {
              while(true){

              }
          }
        ```
      > 第二种，一个总是抛出错误的函数
        ```typescript
          function fail(message: string): never {
            throw new Error(message);
          }
        ```

      > 第三种， 也说不上来，反正比较奇怪的用法
      
        ```typescript

          type FuncName<T> = {
            [P in keyof T]: T[P] extends Function ? P : never;
          }[keyof T];

        ```
        1. 从T中取出,值的类型为函数的键值；并组成联合类型；
        2. 需要跟最后的[keyof T]联合使用，不然没有意义；


  10. void `函数返回没有任何类型`时使用

    跟never一样只能用在函数中



- 引用数据类型

  1. 数组类型表示

  2. 函数类型表示

      > 函数声明

        ```javascript
          
        function sum(x: number, y: number): number {
          return x + y;
        }
        
        ```

      > 函数表达式声明

        ```javascript

        let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
            return x + y;
        };

        ```

      > 用接口定义函数的形状

        ```javascript
                
        interface SearchFunc {
            (source: string, subString: string): boolean;
        }

        let mySearch: SearchFunc;
        mySearch = function(source: string, subString: string) {
            return source.search(subString) !== -1;
        }
        
        ```
      > 用type定义函数形状

        ```typescript

          type  SearchFunc = (source: string, subString:string) => boolean
        
        ```

  3. 枚举

  4. 接口`interface`
      
      `什么是接口？`

      ts中对接口的定义，与面向对象中的有一些区别，ts中的定义如下：

      1. 不同类之间公有的熟悉与方法，可以抽象成一个接口；貌似跟声明文件里面的interface有点不一样；
      2. 用于对对象的描述；声明文件中的写法更像是这种；

      `接口定义函数的形状？为什么要用接口定义函数形状？`

      答：不好意思，我也不知道，也不想查 


  5. 类
    
  6. 元组(合并了不同类型的变量的数组，可以跟type一起使用)
    
    ```javascript

      let tom: [string, number] = ['Tom', 25];

    ```


  7. 内置对象

      - Boolean

        注意跟基础的数据类型的boolean的区别，是不一样的
        ```javascript
          let b: Boolean = new Boolean(1);
          let isDone: boolean = false;

        ```

      - Error

      - Date

      - RegExp


- 类型别名(自己理解为自定义类型)，使用type

  1. 字符串字面类型（ennn,感觉跟类型别名是一样的，所以放在这个下面了）
  
      ```typescript

        type EventNames = 'click' | 'scroll' | 'mousemove';

      ```

- 泛型

  是指在定义函数、接口、类的时候；不预先指定类型，而在使用的时候指定类型；

  1. 各种类型的泛型例子
      - 函数
        
        ```javascript
        
        // 多类型参数
        function swap<T, U>(tuple: [T, U]): [U, T] {
          return [tuple[1], tuple[0]];
        }

        swap([7, 'seven']); // ['seven', 7]
        ```

      - 接口

        ```javascript
          interface CreateArrayFunc<T> {
              (length: number, value: T): Array<T>;
          }

          let createArray: CreateArrayFunc<any>;
          createArray = function<T>(length: number, value: T): Array<T> {
              let result: T[] = [];
              for (let i = 0; i < length; i++) {
                  result[i] = value;
              }
              return result;
          }

          createArray(3, 'x'); // ['x', 'x', 'x']
        ```

      - 类
      
      ```javascript
        // 经常不会写
        class GenericNumber<T> {
            zeroValue: T;
            add: (x: T, y: T) => T;
        }

        let myGenericNumber = new GenericNumber<number>();
        myGenericNumber.zeroValue = 0;
        myGenericNumber.add = function(x, y) { return x + y; };
      ```

  2. 泛型约束
      
      使用`extends`进行约束；`extends`也能用于`interface`、`class`之间的继承；二者也容易混淆，虽然关键字一样，但是意义是完全不同的；

      ```javascript

        // T类型中必须有length;没有的话就会报错
        interface Lengthwise {
            length: number;
        }

        function loggingIdentity<T extends Lengthwise>(arg: T): T {
            console.log(arg.length);
            return arg;
        }

        loggingIdentity(7);


        // 多个类型参数之间可以互相约束

        function copyFields<T extends U, U>(target: T, source: U): T {
            for (let id in source) {
                target[id] = (<T>source)[id];
            }
            return target;
        }

        let x = { a: 1, b: 2, c: 3, d: 4 };

        copyFields(x, { b: 10, d: 20 });

      ```

- 类型断言

  > 用法：
    -  值 `as` 类型

        tsx中必须使用这种方式

    -  `<`类型`>`值
      这种写法在tsx中除了表示断言外，还可以表示`范型`
  
  > 用途

    1. 联合数据类型被断言为其中一种

        ```typescript
          interface Cat {
              name: string;
              run(): void;
          }
          interface Fish {
              name: string;
              swim(): void;
          }

          function swim(animal: Cat | Fish) {
              (animal as Fish).swim();
          }

          const tom: Cat = {
              name: 'Tom',
              run() { console.log('run') }
          };
          swim(tom);
          // 报错，cat不能游泳
          // 所以不能滥用断言，因为断言只能欺骗ts编译器，无法避免运行时的错误

        ```

    2. 父类可以被断言为子类

    3. any可以被断言为任何类型
      
        ```typescript
          (window as any).foo = 1;
        ```

    4. 任何类型可以被断言为any



- 类型推论

  如果定义的时候赋值，ts会为定义的值推测一个类型；

  ```typescript
    let myFavoriteNumber: string = 'seven';
    myFavoriteNumber = 7; 
    // index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
  ```
  
  如果定义的时候没有赋值，ts为定义的的值推测为any类型；
  ```typescript
    let myFavoriteNumber;
    myFavoriteNumber = 'seven';
    myFavoriteNumber = 7;
    // 没毛病
  ```










## 声明文件

- 声明

  声明语句：当引用第三方库时，需要使用
  声明文件：通常把声明语句放到一个单独的文件，这就是声明文件；


- 三种类型的声明文件

  > 第一种，全局:通过`script`标签引入第三方库，注入全局变量
  
    `常用声明`
      
    - `declare var` 声明全局变量
    - `declare function` 声明全局方法
    - `declare calss` 声明全局类
    - `declare namespace`声明全局对象

        用来表示全局变量是一个对象，包含很多子属性；可以避免全局污染；

        ```typescript
          // src/jQuery.d.ts
          declare namespace jQuery {
            function ajax(url: string, settings?: any): void;
          }

          // src/index.ts
          jQuery.ajax('/api/get_something');

        ```

    - `type` 和 `interface`声明全局类型  
        
      以上都是变量，有的类型也需要暴露；就是用`type`与`interface`;为了减少，命名冲突，可以把`type`与`interace`放到namespace中；
      ```typescript

        // src/jQuery.d.ts

        declare namespace jQuery {
            interface AjaxSettings {
                method?: 'GET' | 'POST'
                data?: any;
            }
            function ajax(url: string, settings?: AjaxSettings): void;
        }

        // src/index.ts
        let settings: jQuery.AjaxSettings = {
            method: 'POST',
            data: {
                name: 'foo'
            }
        };
        jQuery.ajax('/api/post_something', settings);

      ```

      声明文件的`用法`跟常规ts有一些区别；
      
    - 声明合并（常规的ts,好像也可以合并）

      如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型：

      1. 函数的声明合并
      2. 接口的合并
          
          ```typescript

            interface Alarm {
                price: number;
                alert(s: string): string;
            }
            interface Alarm {
                weight: number;
                alert(s: string, n: number): string;
            }

            >>>>>>>>>>>上下相等<<<<<<<<<<<<<<

            interface Alarm {
                price: number;
                weight: number;
                alert(s: string): string;
                alert(s: string, n: number): string;
            }

          ```
      3. class合并
      4. 混合合并(好像只能在声明的时候混合合并，常规使用，下面会把上面的覆盖)

          ```javascript

          // src/jQuery.d.ts
          declare function jQuery(selector: string): any;
          declare namespace jQuery {
              function ajax(url: string, settings?: any): void;
          }

          // src/index.ts
          jQuery('#foo');
          jQuery.ajax('/api/get_something');
           
          ```



  > 第二种，npm包：一般通过 `import foo from 'foo'`导入，符合es6模块规范；当然还有其他的

    - 包的位置

      1. 与npm绑定在一起；可以查看`package.json`中是否有`types`字段；或者有没有`index.d.ts`   (最推荐的做法)
      2. 发布到`@types`里；由于包维护者没有提供声明文件，所以只能由其他人将声明发布到@types里
      
      3. 以上没有的话，需要自己写了；

          1. 创建一个 node_modules/@types/foo/index.d.ts 文件，存放 foo 模块的声明文件
          2. 创建一个 types 目录，专门用来管理自己写的声明文件，将 foo 的声明文件放到 types/foo/index.d.ts 中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。
          
          ```javascript
              //目录结构
              /path/to/project
              ├── src
              |  └── index.ts
              ├── types
              |  └── foo
              |     └── index.d.ts
              └── tsconfig.json

              // tsconfig.json
              {
                "compilerOptions": {
                    "module": "commonjs",
                    "baseUrl": "./",
                    "paths": {
                        "*": ["types/*"]
                    }
                }
              }
          ```
    - 具体使用

      - `export`

        ```javascript
          export const name: string;
          export function getName(): string;
          export interface Options {
            data: any;
          }
        ```

      - 混用`declare`和`export`

         ```javascript
          //导出
          declare const name: string;
          declare function getName(): string;
          interface Options {
            data: any;
          }

          export {name, getName, Options};

          //导入


          //与全局变量的声明文件类似，interface前不需要declare
        ```
      - `export namespace`
        
        与`declare namespace`类似,用来导出一个拥有子属性的对象

        ```javascript
          // types/foo/index.d.ts
          export namespace foo {
              const name: string;
              namespace bar {
                  function baz(): string;
              }
          }

          // src/index.ts

          import { foo } from 'foo';

          console.log(foo.name);
          foo.bar.baz();

        ```

      - `export default`

        用来导出默认值的类型

        ```javascript
            //导出
            // types/foo/index.d.ts
            export default function foo(): string;
            
            //导入
            // src/index.ts********（不用花括号）
            import foo from 'foo';
            foo();
        ```

      - `export=` 

        commonjs规范中，导出模块的方式

        ```javascript

            //导出
            // 整体导出
            module.exports = foo;
            // 单个导出
            exports.bar = bar;

            //第一种导入
            // 整体导入
            const foo = require('foo');
            // 单个导入
            const bar = require('foo').bar;


            //第二种导入
            // 整体导入
            import * as foo from 'foo';
            // 单个导入
            import { bar } from 'foo';

            // 第三种导入
            // 整体导入
            import foo = require('foo');
            // 单个导入
            import bar = foo.bar;
        
        ```






  > 第三种，UMD:既可以通过`script`标签导入，又可以通过import导入


    ```javascript

        // types/foo/index.d.ts

        export as namespace foo;  //全局声明
        export default foo; //npm声明

        declare function foo(): string;
        declare namespace foo {
            const bar: number;
        }

    ```



## 跟React一起使用Typescript

- 组件的开发
  - 有状态

  - 无状态
    FC

- 事件处理
  react各种事件，比如MouseEvent<T=Element>
  原生应该怎么处理？
- promise
  直接使用promise

- 工具泛型使用技巧


## 问题

- class与interface的区别

  1. class可以通过`implements`实现一个或者多个接口
  
  2. 接口通过`extends`继承class


- ts中class的用法与js中class的区别

  - ts中可以使用三种访问修饰符，分别是public\private\protected
  - readonly
  - 抽象类

- type与interface的区别

  > 相同点
  
  - 都可以描述一个对象跟函数

  - 都允许扩展
    
    ```typescript
    // interface 描述对象
    interface Name { 
      name: string; 
    }
    interface User extends Name { 
      age: number; 
    }

    // interface 描述函数
    interface SetUser {
      (name: string, age: number): void;
    }

    // type 描述对象
    type Name = { 
      name: string; 
    }
    type User = Name & { age: number  };


    // type 描述函数
    type SetUser = (name: string, age: number)=> void;

    ```

    > 不同点

    1. type可以声明基本类型别名、联合类型、元组类型等；interface只能声明函数与接口类型；

    2.  type 可以使用`typeof`
      
      ```javascript

        // 当你想获取一个变量的类型时，使用 typeof
        let div = document.createElement('div');
        
        type B = typeof div

      ```
    3. interface可以联合声明

      ```javascript

        interface User {
          name: string
          age: number
        }

        interface User {
          sex: string
        }

        /*
        User 接口为 {
          name: string
          age: number
          sex: string 
        }
        */
      ```




## Reference

- 安装各种type依赖

- 复杂类型的用法，各种使用场景，需要看别人的库是如何写的，还有一些人的总计


  参考 react.d.ts进行学习


  - type与namespace的关系

  - never

  - extends

  -  type ReactType<P = any> = ElementType<P>;

  - interface RefObject<T> {
        readonly current: T | null;
    }

  
  - infer

  - 泛型

    泛型类型，可以在如下的
      
      - 泛型函数

      - 泛型interface

      - 泛型类

      - 泛型type(类型别名泛型)

      - 泛型约束

        extends对泛型进行约束 与 class中extends中的对比；这一块还是有些复杂的
        
       


    - 如何写typescript



- 编辑器的配置

  - 先默认打开编辑器的检查




## 参考

[React用法总结](https://juejin.im/post/5bab4d59f265da0aec22629b#heading-11)

[声明相关的教程](https://github.com/xcatliu/typescript-tutorial/blob/master/basics/declaration-files.md)

[Typescript官方库](https://www.tslang.cn/docs/home.html)

[interface与type的区别]( https://juejin.im/post/5c2723635188252d1d34dc7d)

## TODO
