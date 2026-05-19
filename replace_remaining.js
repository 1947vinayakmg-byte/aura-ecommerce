const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        replaceInDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // 1. Replace DollarSign icon with IndianRupee icon
      if (content.includes('DollarSign')) {
        content = content.replace(/DollarSign/g, 'IndianRupee');
      }

      // 2. Replace JSX interpolations like >${price} or × ${price} or " ${price} with ₹
      // We split by lines to safely avoid template strings like `Bearer ${token}` or URLs
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('${') && !line.includes('Bearer') && !line.includes('http') && !line.includes('`+${') && !line.includes('cell-') && !line.includes('`usr-') && !line.includes('`pay_') && !line.includes('`AURA-')) {
          // If it's a JSX line or template string representing currency
          // Check if it has >${ or (${ or space${ or × ${ or "${
          line = line.replace(/(>|\s|\(|×|")\$\{(?=[^}]*\})/g, '$1₹{');
          lines[i] = line;
        }
      }
      content = lines.join('\n');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

replaceInDir('e:/AURA/admin/src');
replaceInDir('e:/AURA/client/src');
