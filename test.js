const bar = function () {
    console.log(this.name + this.age + this.school);

    return 'qwer';
}

const p1 = {
    name: 'caisiqi',
    age: 16,
    school: 'cug',
};

bar.call(p1);

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

bar.call2(p1);
