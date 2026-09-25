const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/features/*/*.tsx');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/from '(\.\.\/)+([^']+)'/g, (match, p1, p2) => {
    const count = match.split('../').length - 1;
    if (count === 3) return `from '../../${p2}'`;
    if (count === 2) return `from '../${p2}'`;
    if (count === 1) return `from './${p2}'`;
    return match;
  });
  c = c.replace(/from "(\.\.\/)+([^"]+)"/g, (match, p1, p2) => {
    const count = match.split('../').length - 1;
    if (count === 3) return `from "../../${p2}"`;
    if (count === 2) return `from "../${p2}"`;
    if (count === 1) return `from "./${p2}"`;
    return match;
  });
  fs.writeFileSync(f, c);
});
console.log('Fixed imports!');
