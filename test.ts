let wife: [string, number] = ['haha', 16];

wife.push('qwer');
console.log(wife);

function haha(): number {
  return 1;
}

function hehe(x: number, y: string): null {
  return null;
}

interface add {
  (x: number, y: string): boolean;
}

const qwer: add = (x: number, y: string): boolean => {
  console.log(1);
  return false;
}

interface shenmegui {
  (x: number, ...restProps: Array<string | number | boolean>): string;
}

const rest: shenmegui = (x: number, ...restProps: Array<string | number | boolean>) => {
  return 'haha';
}

function rewq(x: number, ...restProps: Array<string | number | boolean>) {
  return [true, 1, 'haha'];
}

enum Wife {
  Down,
  Up,
  Left,
  Right,
};

console.log(Wife[2], Wife.Left)
