const rootTags = {
  content: null,
  mod: null,
  sections: null
};

const innerTags = {
  content: {},
  mod: {},
  sections: {}
};

const types = {};
const tree = { types: [] };
const treeRef = {};

function addType(Class) {
  types[Class.type] = Class;

  function traverseTree(parent) {
    const current = parent.types;
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      const PotentialSuper = types[node.type];
      if (Class.prototype instanceof PotentialSuper) {
        return traverseTree(node);
      }
    }
    const next = { parent, type: Class.type, types: [] };
    current.push(next);
    treeRef[Class.type] = next;
  }

  traverseTree(tree);

  return Class;
}

function closestType(type, types) {
  if (!Array.isArray(types)) types = [types];

  function traverseTree(node) {
    if (types.includes(node.type)) return node.type;
    return node.parent ? traverseTree(node.parent) : null;
  }
  return traverseTree(treeRef[type]);
}

export default {
  get tree() {
    return tree;
  },
  add(Class, rootTag, innerTag) {
    const tagStr = () =>
      rootTag ? ' for ' + rootTag + (innerTag ? '.' + innerTag : ' ') : ' ';

    if (typeof Class !== 'function') {
      throw Error(`Class${tagStr()}is not a function.`);
    }
    if (!Class.type) throw Error(`No Class type${tagStr()}found.`);
    if (types.hasOwnProperty(Class.type) && Class !== types[Class.type]) {
      throw Error(`A Class with type ${Class.type} was already registered.`);
    }
    if (!rootTag && innerTag) {
      throw Error(
        `An inner tag can't be passed without a root tag (${Class.type})`
      );
    }
    if (!rootTag) return addType(Class);

    if (!rootTags.hasOwnProperty(rootTag)) {
      throw Error(`Root tag ${rootTag} doesn't exist.`);
    }

    return innerTag
      ? (innerTags[rootTag][innerTag] = Class) && addType(Class)
      : (rootTags[rootTag] = Class) && addType(Class);
  },
  closestTypes(arr) {
    return Object.keys(types).reduce((acc, type) => {
      acc[type] = closestType(type, arr);
      return acc;
    }, {});
  },
  byType(type) {
    return types[type];
  },
  byTag(rootTag, innerTag) {
    if (!rootTags.hasOwnProperty(rootTag)) {
      throw Error(`Root tag ${rootTag} doesn't exist.`);
    }

    if (!innerTag) return rootTags[rootTag];

    if (!innerTags[rootTag].hasOwnProperty(innerTag)) {
      throw Error(`Tag ${rootTag}.${innerTag} doesn't exist.`);
    }

    return innerTags[rootTag][innerTag];
  },
  isType(type) {
    return types.hasOwnProperty(type);
  },
  isTag(rootTag, innerTag) {
    if (!rootTags.hasOwnProperty(rootTag)) return false;
    return !innerTag || innerTags.hasOwnProperty(innerTag);
  }
};
