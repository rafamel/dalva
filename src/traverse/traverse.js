import ruleGetter from './rule-getter';
import { SYMBOL } from '~/depends';
import createNext from './next';

function traverseMain(node, getRule, mode, methodName) {
  const next = createNext(traverseMain, getRule, mode);

  const callbackFn = getRule(node);
  if (!callbackFn) return;

  let method;
  let depends;
  if (methodName && node[methodName]) {
    method = node[methodName];
    if (method && method[SYMBOL]) depends = method[SYMBOL];
  }

  const nextFn = (nodes) => {
    return next(nodes, methodName, depends, node);
  };

  return callbackFn.call(node, nextFn, method && method.bind(node), methodName);
}

export default function traverse(node, rules, mode, methodName) {
  let getRule = ruleGetter(rules);

  // Wrap next so it returns [] for undefined if traversing for depends
  if (methodName) {
    const _getRule = getRule;
    const resolve =
      mode === 'sync'
        ? (ans) => (ans === undefined ? [] : ans)
        : (ans) =>
            Promise.resolve(ans).then((res) => (res === undefined ? [] : res));
    getRule = (node) => {
      const rule = _getRule(node);
      return function(_next, ...args) {
        function next(...nextArgs) {
          // eslint-disable-next-line babel/no-invalid-this
          const ans = _next.apply(this, nextArgs);
          return resolve(ans);
        }
        // eslint-disable-next-line babel/no-invalid-this
        return rule.call(this, next, ...args);
      };
    };
  }

  return traverseMain(node, getRule, mode, methodName);
}
