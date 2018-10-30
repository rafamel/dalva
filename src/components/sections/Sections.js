import Collection from '#/base/Collection';
import registry from '~/registry';
import depends from '~/depends';

export default class Sections extends Collection {
  static type = 'Sections';
  get level() {
    if (!this.parent) return null;
    return this.parent.level + 1;
  }
  deserialize(json, transport) {
    const Section = registry.byTag('sections', 'child');
    this.collection = json.map((section) => {
      return new Section(this).provide(section, transport);
    });

    return this;
  }
  @depends('collection')
  serialize(collection) {
    return { sections: collection };
  }
}
