import Node from './Node';

export default class Raw extends Node {
  static type = 'Raw';
  static properties = { raw: null };
  constructor(parent) {
    super(parent);
    this.raw = null;
  }
  deserialize(raw) {
    return (this.raw = raw);
  }
  serialize() {
    return this.raw;
  }
}
