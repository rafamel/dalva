import Raw from '#/base/Raw';

export default class Markdown extends Raw {
  static type = 'Markdown';
  toMarkdown() {
    const rexp = /^#{1,}/;

    return (
      '\n' +
      this.raw
        .split('\n')
        .map((line) => {
          const res = rexp.exec(line);
          return res
            ? line.replace(rexp, '#'.repeat(this.level + res[0].length))
            : line;
        })
        .join('\n')
        .trim() +
      '\n'
    );
  }
}
