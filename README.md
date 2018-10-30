# Dalva

[![Version](https://img.shields.io/github/package-json/v/rafamel/dalva.svg)](https://github.com/rafamel/dalva)
[![Build Status](https://travis-ci.org/rafamel/dalva.svg)](https://travis-ci.org/rafamel/dalva)
[![Coverage](https://img.shields.io/coveralls/rafamel/dalva.svg)](https://coveralls.io/github/rafamel/dalva)
[![Dependencies](https://david-dm.org/rafamel/dalva/status.svg)](https://david-dm.org/rafamel/dalva)
[![Vulnerabilities](https://snyk.io/test/npm/dalva/badge.svg)](https://snyk.io/test/npm/dalva)
[![Issues](https://img.shields.io/github/issues/rafamel/dalva.svg)](https://github.com/rafamel/dalva/issues)
[![License](https://img.shields.io/github/license/rafamel/dalva.svg)](https://github.com/rafamel/dalva/blob/master/LICENSE)

<!-- markdownlint-disable MD036 -->
**Documents for the 21st Century**
<!-- markdownlint-enable MD036 -->

## Install

[`npm install dalva`](https://www.npmjs.com/package/dalva)

## Usage

## Todo
  - static node & static properties to type rather than constant

## Traverse

### `traverse.sync(node, rules)`
### `traverse.parallel(node, rules)`
### `traverse.series(node, rules)`

* `node`: A component node.
* `rules`: Either a function to apply for all nodes, or an object of functions with keys of the component types to target.
  * Component nodes will be passed on traversal to the one function with key targeting itself or its closest parent.
  * Functions will have a `this` of the current node being traverse, and receive a `next` function, which can be called called with:
    * A node, so it will return the returned value of the rule for that node.
    * An array or nodes, so it will return an array with the returned values of the traverse rule for those nodes.
    * Empty, so it will continue traversing if the current node type has any declared children, in which case it will return an array of nodes and arrays; otherwise it will return `undefined`.

There are three variants: `sync` executes synchronously, while `parallel` and `series` execute asynchronously in parallel or serially respectively.

```javascript
import { traverse } from 'dalva';

traverse.sync(rootNode, {
  Node(next) {
    this.load(transport);
    next();
  }
});

// As all nodes inherit from Node, that is equivalent to:
traverse.sync(rootNode, function(next) {
  this.load(transport);
  next();
});

// You can also accumulate results
const nodesTraversed = traverse.sync(root, function(next) {
  const ans = next();
  const vals = (val) =>
    Array.isArray(val) ? val.reduce((acc, x) => acc + vals(x), 0) : val || 0;

  return vals(ans) + 1;
});
```

### `traverse.depends.sync(node, methodName, rules)`
### `traverse.depends.series(node, methodName, rules)`
### `traverse.depends.parallel(node, methodName, rules)`

Same as the usual `traverse`, with a few key differences:

* `methodName`: An additional parameter indicating the default method to pass for nodes. This can be overriden by the `depends` declarations on component definitions.

* `next`:
  * When a call is not passed any parameters, it will follow the `depends` for `methodName`.
  * It will never return `undefined`, returning an empty array instead it can be destructured safely on a call without additional checks.
  * Is passed two additional parameters: `method` and `name`.
    * `method` is either the method corresponding to `methodName` for the current node, or the one overriden by the `depends` on that method.
    * `methodName` is the property key of `method` for the current node. You can check whether the default was overriden and call a different one if you so desire.

```javascript
import { traverse } from 'dalva';

const serialized = traverse.depends.sync(
  root,
  'serialize',
  (next, method, name) => {
    return method(...next());
  }
);

console.log(JSON.stringify(serialized, null, 2));
```

## `@depends(propertyOrGetter, methodName?, fallback)`

The `depends` decorator allows you to declare a set of calls to other nodes' methods in order to complete the call, and a fallback value in case the inner nodes are not traversed. These will be passed as parameters to the method the decorator is applied to in order.

* `propertyOrGetter`: It can be:
  * A *string* with the name of the property where children nodes live (either as a single node or an array).
  * A *function* that will be passed a node instance as a parameter, and should return a node or an array of nodes.
* `methodName`: An optional *string* indicating the method name to call.
* `fallback`: Fallback value in case the traversal to those nodes and calls to their methods is not performed.

