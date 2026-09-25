const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/features/*/*.tsx');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/from '\.\.\/\.\.\/\.\.\/styles/g, "from '../../styles");
  c = c.replace(/import '\.\.\/\.\.\/\.\.\/styles/g, "import '../../styles");
  
  // also check if any login.css / crud.css remained due to previous failed multi_replace
  c = c.replace(/import '\.\.\/\.\.\/styles\/login\.css';/g, "");
  c = c.replace(/import '\.\.\/styles\/crud\.css';/g, "");
  fs.writeFileSync(f, c);
});
console.log('Fixed CSS imports!');
