const SYMBOL = Symbol('depends');

// @depends(propertyName, methodName?, fallback)
// -> @depends('collection', 'toMarkdown',  '')
// @depends(nodesGetter, methodName?, fallback)
// -> @depends((self) => self.collection, 'toMarkdown', '')
function depends(node, ...args) {
  const methodName = args.length < 2 ? undefined : args[0];
  const fallback = args.length < 2 ? args[0] : args[1];

  return function(Class, property, descriptor) {
    const element = { node, method: methodName, fallback };
    if (descriptor.value[SYMBOL]) {
      descriptor.value[SYMBOL].unshift(element);
      return descriptor;
    }

    const dependsArr = [element];
    const value = function(...args) {
      for (let i = 0; i < dependsArr.length; i++) {
        const depends = dependsArr[i];
        // eslint-disable-next-line eqeqeq
        if (args[i] == undefined) args[i] = depends.fallback;
      }
      // eslint-disable-next-line babel/no-invalid-this
      return descriptor.value.apply(this, args);
    };

    value[SYMBOL] = dependsArr;

    return {
      ...descriptor,
      value
    };
  };
}

function getDepends(fn) {
  if (!fn) return;
  return fn[SYMBOL];
}

export { depends as default, getDepends, SYMBOL };
