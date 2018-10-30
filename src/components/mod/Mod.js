import Collection from '#/base/Collection';
import registry from '~/registry';
import entry from '~/entry';
import depends from '~/depends';

export default class Mod extends Collection {
  static type = 'Mod';
  deserialize(json, transport) {
    this.collection = json.map((mod) => {
      const [key, value] = entry(mod);
      const ModClass = registry.byTag('mod', key);
      return new ModClass(this).provide(value, transport);
    });

    return this;
  }
  @depends('collection', [])
  serialize(a) {
    return { mod: a };
  }
}
