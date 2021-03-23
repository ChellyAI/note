const func = (num) => {
  const all = Array.from({length: 10000}, (_, i) => i+2);

  const result = [];

  for (let i = 0; i < num; i++) {
    result.push(
      all.splice(
        Math.floor(Math.random() * all.length),
        1,
      )[0]
    )
  }

  return result;
}

function fib(n) {
  let fiber = {
    arg: n,
    returnAddr: null,
    a: 0,
  };

  // 标记循环
  rec: while (true) {
    // 当展开完全后，开始计算
    if (fiber.arg <= 2) {
      let sum = 1;

      // 寻找父级
      while (fiber.returnAddr) {
        fiber = fiber.returnAddr;

        if (fiber.a === 0) {
          fiber.a = sum;
          fiber = {
            arg: fiber.arg - 2,
            returnAddr: fiber,
            a: 0,
          };

          continue rec;
        }

        sum += fiber.a;
      }
      return sum;
    } else {
      // 先展开
      fiber = {
        arg: fiber.arg - 1,
        returnAddr: fiber,
        a: 0,
      };
    }
  }
}

console.log(fib(6));
