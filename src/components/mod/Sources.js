import Node from '#/base/Node';
import entry from '~/entry';

export default class Sources extends Node {
  static type = 'Sources';
  static properties = { sources: null };
  constructor(parent) {
    super(parent);
    this.title = 'Sources';
    this.sources = new Map();
  }
  deserialize(json) {
    this.sources = new Map();
    json.map((source) => {
      const [key, value] = entry(source);
      this.sources.set(key, {
        origin: value[0] || null,
        url: value[1] || null
      });
    });
  }
  serialize() {
    const inner = Array.from(this.sources.keys()).reduce((acc, key) => {
      const { origin, url } = this.sources.get(key);
      return acc.concat({ [key]: [origin, url] });
    }, []);
    return { sources: inner };
  }
  toMarkdown() {
    let ans = '\n' + '#'.repeat(this.level + 1) + ' ' + this.title + '\n\n';
    Array.from(this.sources.keys()).forEach((key) => {
      const { origin, url } = this.sources.get(key);
      ans += `* **[${key + (origin ? ` *(${origin})*` : '')}](${url})**\n`;
    });

    return ans;
  }
}
