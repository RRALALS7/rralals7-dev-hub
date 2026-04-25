const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const ignored = new Set(['node_modules', '.git']);
let failed = false;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.js')) continue;

    const relative = path.relative(root, fullPath);
    const result = spawnSync(process.execPath, ['--check', fullPath], { encoding: 'utf8' });

    if (result.status !== 0) {
      failed = true;
      console.error(`\n❌ Syntax error: ${relative}`);
      console.error(result.stderr || result.stdout);
    } else {
      console.log(`✅ ${relative}`);
    }
  }
}

walk(root);

if (failed) {
  process.exit(1);
}

console.log('\n✅ Todos os arquivos JavaScript passaram no node --check.');
