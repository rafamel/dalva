import Node from './Node';
import depends from '~/depends';

export default class Collection extends Node {
  static type = 'Collection';
  static nodes = { collection: null };
  constructor(parent) {
    super(parent);
    this.collection = [];
  }
  deserialize() {
    return this;
  }
  @depends('collection', [])
  serialize(a) {
    return { a };
  }
  @depends('collection', [])
  toMarkdown(a) {
    return a.join('');
  }
}
