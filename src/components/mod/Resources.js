import Sources from './Sources';

export default class Resources extends Sources {
  static type = 'Resources';
  constructor(parent) {
    super(parent);
    this.title = 'Resources';
  }
  serialize() {
    const ans = super.serialize();
    return { resources: ans.sources };
  }
}
