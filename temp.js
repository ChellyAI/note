class A {
  static age = 'caisiqi'

  school = '地大'

  sayAge = () => {
    console.log(this.age, this.school);
  }
}

class B extends A {

}

const a = new A();
const b = new B();

const C = function C() {
}
C.age = 'caisiqi';

function D() {
  C.call(this);
}

const c = new C();
const d = new D();

console.log(a.age, A.age, b.age, B.age);
console.log(c.age, C.age, d.age, D.age);
