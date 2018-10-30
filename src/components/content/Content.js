import Collection from '#/base/Collection';
import registry from '~/registry';
import entry from '~/entry';
import depends from '~/depends';

export default class Content extends Collection {
  static type = 'Content';
  deserialize(json, transport) {
    this.collection = json.map((mod) => {
      const [key, value] = entry(mod);
      const ContentClass = registry.byTag('content', key);
      return new ContentClass(this).provide(value, transport);
    });

    return this.collection;
  }
  @depends('collection')
  serialize(a) {
    return a;
  }
}
