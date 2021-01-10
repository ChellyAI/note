function newFunc(...args) {
  const obj = {};
  const [Constructor, restProps] = [...args];

  obj.__proto__ = Constructor.prototype;
  
  const result = Constructor.apply(obj, restProps);

  if (typeof result === 'object') {
    return result;
  }

  return obj;
}