function f() {
    get = function() {
        console.log(1);
    }
    console.log(this.get);
    return this;
}

var get = function() {
    console.log(2);
}

function get() {
    console.log(3);
}

console.log(get);
get();
f.get();
f().get();