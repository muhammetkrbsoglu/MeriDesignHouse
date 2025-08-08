/* Rewrites imports like "@repo/ui/button" to "@repo/ui" across apps/frontend */
const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'apps', 'frontend');
const exts = new Set(['.js','.jsx','.ts','.tsx']);
let count = 0;
function walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p = path.join(dir,e.name);
    if(e.isDirectory()) walk(p);
    else if(exts.has(path.extname(e.name))){
      const s = fs.readFileSync(p,'utf8');
      const s2 = s.replace(/from\s+(["'`])@repo\/ui\/[A-Za-z0-9_.-]+\1/g, 'from $1@repo/ui$1');
      if(s!==s2){ fs.writeFileSync(p,s2); console.log('updated', path.relative(root,p)); count++; }
    }
  }
}
if(!fs.existsSync(root)){ console.error('frontend not found:', root); process.exit(1); }
walk(root);
console.log('Done. Files updated:', count);
