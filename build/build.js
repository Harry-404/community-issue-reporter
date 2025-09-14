const fs = require('fs');
const path = require('path');

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copy(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

const root = process.cwd();
const out = path.join(root, 'build');
if (fs.existsSync(out)) {
  fs.rmSync(out, { recursive: true, force: true });
}
fs.mkdirSync(out);

// copy files (excluding node_modules, .git, build)
const skip = new Set(['node_modules', '.git', 'build']);
for (const item of fs.readdirSync(root)) {
  if (skip.has(item)) continue;
  copy(path.join(root, item), path.join(out, item));
}

console.log('Build completed: output in build/');
