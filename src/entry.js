export default function entry(obj) {
  const key = Object.keys(obj)[0];
  return [key, typeof obj === 'object' && obj[key]];
}
