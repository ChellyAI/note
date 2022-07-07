## JSDoc

### @param

`@param`标签可以对函数的参数进行说明，包括参数名、数据类型、描述等。

- 参数类型使用大括号括起来
- 描述前可以使用连字符作为标志，但切记描述与连字符中间有空格

```javascript
/**
 * @param something
 */
function myAlert(something) {
  alert(something);
}

/**
 * @param {string} something - Something to alert
 */
function myAlert(something) {
  alert(something);
}
```

如果参数是一个对象，同样可以描述其属性

```javascript
/**
 * 删除用户
 * @param {Object} userInfo - 用户信息
 * @param {string} userInfo.name - 姓名
 * @param {string} userInfo.age - 年龄
 * @param {string} userInfo.uid - 用户id
 */
function deleteUser(userInfo) {
  //	some code
}
```

如果参数是一个对象数组

```javascript
/**
 * 删除一组用户
 * @param {Object[]} usersInfo - 用户信息数组
 * @param {string} usersInfo[].name - 姓名
 * @param {string} usersInfo[].age - 年龄
 */
function deleteUsers(usersInfo) {
  //	some code
}
```

可选参数和默认值

```javascript
/**
 * @param {string} [something = hello world] - Something to alert
 */
function myAlert(something) {
  alert(something);
}
```

参数可以接受多个类型，或可以是任何类型

```javascript
/**
 * @param {(Object|Object[])} [user = {name: 'caisiqi', age: 16}] - 删除用户信息
 */
function deleteUser(user) {
  if (Array.isArray(user)) {
    //	some code
    return;
  } else {
    //	some code
  }
}

/**
 * 打印
 * @param {*} something - 什么类型都可以
 */
function print(something) {
  //	some code
}
```



### @author

标记作者名，如果名字后面跟着尖括号括起来的邮件地址，默认模版将其转换为mailto:链接

```javascript
/**
 * @author 张三 <zhang3@example.com>
 */
function example() {}
```

### @returns

描述一个函数的返回值。

```javascript
/**
 * 返回a与b相加的结果
 * @param {number} a
 * @param {number} b
 * @returns {number} - a与b相加的结果
 */
async function sum(a, b) {
  return a + b;
}
```

返回值同样可以有不同类型

```javascript
/**
 * 根据求和返回不同结果
 * @param {number} a
 * @param {number} b
 * @returns {number|boolean} - a大于b时返回false，其他情况返回和
 */
async function sum(a, b) {
  if (a > b) {
    return false;
  } else {
    return a + b;
  }
}
```

### @example

提供一个如何使用的例子

```javascript
/**
 * @example
 * sum(1, 2);
 */
async function sum(a, b) {
  return a + b;
}
```

### @throws

用于描述函数可能会抛出的错误

```javascript
/**
 * @throws 
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

### @async

标记一个函数是异步的。

```javascript
/**
 * @async
 */
async function download() {
  
}
```

