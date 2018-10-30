import Collection from '#/base/Collection';
import registry from '~/registry';
import entry from '~/entry';
import depends from '~/depends';

export default class Section extends Collection {
  static type = 'Section';
  static properties = { name: null };
  constructor(parent) {
    super(parent);
    this.name = null;
  }
  _getClasses(arr) {
    let lastKey = null;
    return arr.reduce((acc, obj) => {
      const [key, value] = entry(obj);
      if (registry.isTag(key)) {
        lastKey = key;
        return acc.concat(obj);
      }

      const splitted = key.split('.');
      if (splitted.length !== 2 || !registry.isTag(splitted[0])) {
        throw Error(`Invalid key: ${key}.`);
      }

      if (lastKey === splitted[0]) {
        acc.slice(-1)[0][lastKey].push({ [splitted[1]]: value });
        return acc;
      }

      lastKey = splitted[0];
      return acc.concat({ [splitted[0]]: [{ [splitted[1]]: value }] });
    }, []);
  }
  deserialize(json, transport) {
    const [key, value] = entry(json);
    this.name = key;
    this.collection = this._getClasses(value).map((obj) => {
      const [key, value] = entry(obj);
      const CollectionClass = registry.byTag(key);
      return new CollectionClass(this).provide(value, transport);
    });
  }
  @depends('collection', [])
  serialize(a) {
    return { [this.name]: a };
  }
  @depends('collection', [])
  toMarkdown(a) {
    return '\n' + '#'.repeat(this.level) + ' ' + this.name + '\n' + a.join('');
  }
}
