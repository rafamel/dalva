export default class Node {
  static type = 'Node';
  constructor(parent) {
    this.parent = parent || null;
    this.transports = {};
    this._data = {};
  }
  get level() {
    if (!this.parent) return 1;
    return this.parent.level;
  }
  setLevel(level = 0) {
    Object.defineProperty(this, 'level', { value: level });
    return this;
  }
  transport(transport) {
    if (this.transports.hasOwnProperty(transport)) return transport;

    const load = transport.getLoad(this.constructor.type);
    this.transports[transport.id] = {
      id: transport.id,
      load: (load && load.bind(this)) || null
    };
    return this;
  }
  provide(obj, transport) {
    this.transport(transport);
    this._data[transport.id] = obj;
    return this;
  }
  hasData(transport) {
    return this._data.hasOwnProperty(transport.id);
  }
  data(transport) {
    if (!this.hasData(transport)) {
      throw Error(
        `No data was provided for transport { type: ${transport.type}, id: ${
          transport.id
        } }.`
      );
    }
    return this._data[transport.id];
  }
  load(transport) {
    this.data(transport);
    const load = this.transports[transport.id].load;
    return load && this.deserialize(load(), transport);
  }
  deserialize() {
    throw Error('Node.deserialize() not implemented.');
  }
  serialize() {
    throw Error('Node.serialize() not implemented.');
  }
}
