interface Wife {
  name: string;
  age: number;
  [propName: string]: string | number;
}

interface Arr {
  [index: number]: number | string | boolean | Symbol;
}

let arr: Arr = [1, '2', false, Symbol('1')];

function getName(firstName: string = 'cai', lastName?: string) {
  return firstName + ' ' + lastName;
}
