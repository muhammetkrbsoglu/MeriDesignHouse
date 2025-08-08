/*
  Rewrites all occurrences of "@/components/ui" imports to "@repo/ui" in apps/frontend
*/
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'apps', 'frontend');
const allowedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
let updatedCount = 0;

function rewriteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const replaced = content.replace(/(["'`])@\/components\/ui(?=\/|\b)/g, '$1@repo/ui');
  if (replaced !== content) {
    fs.writeFileSync(filePath, replaced);
    updatedCount += 1;
    process.stdout.write(`updated ${path.relative(root, filePath)}\n`);
  }
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (allowedExtensions.has(path.extname(entry.name))) {
      rewriteFile(fullPath);
    }
  }
}

if (!fs.existsSync(root)) {
  console.error('Frontend path not found:', root);
  process.exit(1);
}

walk(root);
console.log(`Done. Files updated: ${updatedCount}`);


