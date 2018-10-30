const inner = {
  sync(nodes, cb) {
    if (!nodes) return;
    return Array.isArray(nodes)
      ? nodes.map((node) => inner.sync(node, cb))
      : cb(nodes);
  },
  async series(nodes, cb) {
    if (!nodes) return;
    if (!Array.isArray(nodes)) return cb(nodes);
    const acc = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      acc.push(await inner.series(node, cb));
    }
    return acc;
  },
  async parallel(nodes, cb) {
    if (!nodes) return;
    return Array.isArray(nodes)
      ? Promise.all(nodes.map((node) => inner.parallel(node, cb)))
      : cb(nodes);
  }
};

const map = {
  sync(arr, cb) {
    return arr.map((item, i) => cb(item, i));
  },
  async series(arr, cb) {
    const acc = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      acc.push(await cb(item, i));
    }
    return acc;
  },
  async parallel(arr, cb) {
    return Promise.all(map.sync(arr, cb));
  }
};

export default function createNext(traverse, getRule, mode) {
  const innerNext = inner[mode];

  function commonsNext(nodes, methodName) {
    return innerNext(nodes, (innerNode) => {
      return traverse(innerNode, getRule, mode, methodName);
    });
  }

  function dependsNext(methodName, depends, node) {
    return map[mode](depends, (element) => {
      const nodes =
        typeof element.node === 'function'
          ? element.nodes(node)
          : node[element.node];
      const methodNameInner = element.method || methodName;
      return commonsNext(nodes, methodNameInner);
    });
  }

  return function next(nodes, methodName, depends, node) {
    // If nodes are passed
    if (nodes) return commonsNext(nodes, methodName);

    // If nodes are not passed and we are iterating over method depends
    if (methodName) {
      if (depends) return dependsNext(methodName, depends, node);
      else return;
    }

    // If nodes are not passed and we are NOT iterating over method depends
    if (node.constructor.nodes) {
      const nodes = Object.keys(node.constructor.nodes).map((key) => {
        return node[key];
      });
      return commonsNext(nodes);
    }
  };
}
