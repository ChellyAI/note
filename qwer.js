function haha() {
  const a = {b: {name: 'c'}};

  console.log(a, a.b);

  a.b.name = 'd';

  console.log(a, a.b);
}

haha();
