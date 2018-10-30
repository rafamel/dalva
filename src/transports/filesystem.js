import fs from 'fs';
import path from 'path';
import transport from '~/transport';
// import yaml from 'js-yaml';

export default transport('filesystem', (transport) => ({
  Node() {
    return this.data(transport);
  },
  Raw() {
    const filePath = this.data(transport);
    return fs.readFileSync(
      path.join(transport.context.rootDir, filePath),
      'utf8'
    );
  }
}));
