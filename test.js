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
