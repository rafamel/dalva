import registry from '~/registry';

export default function ruleGetter(rules) {
  let getRule = () => rules;
  if (typeof rules !== 'function') {
    const closest = registry.closestTypes(Object.keys(rules));
    getRule = (node) => rules[closest[node.constructor.type]];
  }
  return getRule;
}
