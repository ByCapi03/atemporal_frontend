const fs = require('fs');
const glob = require('glob');

const dirsToRevert = ['account', 'auth', 'branches', 'cart', 'suppliers'];
dirsToRevert.forEach(dir => {
  const files = glob.sync(`src/features/${dir}/*.tsx`);
  files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/from '\.\.\/AuthContext'/g, "from './AuthContext'");
    c = c.replace(/from '\.\.\/CartContext'/g, "from './CartContext'");
    c = c.replace(/from '\.\.\/CitiesSection'/g, "from './CitiesSection'");
    c = c.replace(/from '\.\.\/BranchesSection'/g, "from './BranchesSection'");
    fs.writeFileSync(f, c);
  });
});
console.log('Fixed sibling imports!');
