const bar = function () {
    console.log(this.name + this.age + this.school);

    return 'qwer';
}

const p1 = {
    name: 'caisiqi',
    age: 16,
    school: 'cug',
};

// bar.call(p1);

Function.prototype.call2 = function (obj = window, ...args) {
    const func = Symbol();
    obj[func] = this;

    const result = obj[func](...args);
    delete obj[func];
    return result;
}

Function.prototype.apply2 = function(obj = window, props) {
    const func = Symbol();
    obj[func] = this;

    const result = obj[func](...props);
    delete obj[func];
    return result;
}

Function.prototype.bind2 = function(obj = window, ...args) {
    const func = Symbol();
    obj[func] = this;

    return obj[func];
}

// bar.call2(p1);

function myNew(func, ...restProps) {
    const obj = new Object();

    obj.__proto__ = func.prototype;

    const result = func.apply(obj, restProps);

    if (result && ( typeof (result) == 'object' || typeof (result) == 'function')) {
        return result;
    }
    return obj;
}

function Person(name) {
    this.name = name;
}

const child = myNew(Person, '雪ノ下雪乃');
const child2 = new Person('涼宮ハルヒ');

const arr = [1, 2, 3, 3, 4, 9, 5, 5, 4, 4, 2, 2, 1];

function unique(arr) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (!result.includes(arr[i])) {
        result.push(arr[i]);
      }
    }

    return result;
  }

const result = unique(arr);

console.log(result);

Function.prototype.call3 = function(obj = window, ...args) {
    const key = Symbol('func');
    obj[key] = this;
    const props = [...args];

    const result = obj[key](props);
    delete obj[key];
    return result;
}

function qwer(Constructor, ...args) {
    let obj = {};
    obj.__proto__ = Constructor.prototype;

    const result = Constructor.call(obj, ...args);

    if (typeof result === 'object') return result;
    return obj;
}

function human(name) {
    this.name = name;
    this.age = 16;
}

const man = qwer(human, 'caisiqi');

console.log(man);

function debounce(func, delay) {
    let timeoutId = 0;

    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setTimeout(() => {
            func.apply(this, args);
        }, delay);
    }
}

/**
 * @param {string} [something="hello world"] - Something to alert
 */
function myAlert(something) {
    alert(something);
}


/**
 * 删除用户
 * @param {Object} userInfo - 用户信息
 * @param {string} userInfo.name - 姓名
 * @param {string} userInfo.age - 年龄
 * @param {string} userInfo.uid - 用户id
 * @param {Object} productInfo - 商品信息
 * @param {string} productInfo.name - 商品名称
 */
 function deleteUser(userInfo, productInfo) {
    //	some code
    return userInfo;
  }
