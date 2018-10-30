import uuid from 'uuid/v4';
import registry from './registry';

class Transport {
  constructor(type, context, cb) {
    this.id = uuid();
    this.type = type;
    this.context = context || {};
    // eslint-disable-next-line standard/no-callback-literal
    this.transports = cb(this);
    this.load = this.transports
      ? registry.closestTypes(Object.keys(this.transports))
      : null;
  }
  getLoad(type) {
    if (!this.load || !this.load[type]) return null;
    return this.transports[this.load[type]];
  }
}

function transport(type, cb) {
  return function(context) {
    return new Transport(type, context, cb);
  };
}

export { transport as default, Transport };
