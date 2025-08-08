/*
  Rewrites imports like "@repo/ui/button" to "@repo/ui" across apps/frontend.
  Assumes named exports are available from @repo/ui/src/index.ts
*/
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'apps', 'frontend');
const allowedExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
let updatedCount = 0;

function rewriteFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const replaced = content.replace(/from\s+(["'`])@repo\/ui\/[A-Za-z0-9_-]+\1/g, 'from $1@repo/ui$1');
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


