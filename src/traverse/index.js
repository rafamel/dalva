import traverse from './traverse';

export default {
  sync(node, rules) {
    return traverse(node, rules, 'sync');
  },
  async series(node, rules) {
    return traverse(node, rules, 'series');
  },
  async parallel(node, rules) {
    return traverse(node, rules, 'parallel');
  },
  depends: {
    sync(node, methodName, rules) {
      return traverse(node, rules, 'sync', methodName);
    },
    async series(node, methodName, rules) {
      return traverse(node, rules, 'series', methodName);
    },
    async parallel(node, methodName, rules) {
      return traverse(node, rules, 'parallel', methodName);
    }
  }
};
