const fs = require('fs');
const glob = require('glob');

const dirsToRevert = ['account', 'auth', 'branches', 'cart', 'suppliers'];
dirsToRevert.forEach(dir => {
  const files = glob.sync(`src/features/${dir}/*.tsx`);
  files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    
    const replacer = (match, p1, p2) => {
      const count = match.split('../').length - 1;
      const isSingleDot = match.includes('./') && count === 0;
      if (count === 2) return match.replace('../../', '../../../');
      if (count === 1) return match.replace('../', '../../');
      if (isSingleDot) return match.replace('./', '../');
      return match;
    };
    
    c = c.replace(/from '(\.\/|\.\.\/)+([^']+)'/g, replacer);
    c = c.replace(/from "(\.\/|\.\.\/)+([^"]+)"/g, replacer);
    fs.writeFileSync(f, c);
  });
});
console.log('Reverted wrongly modified files!');
