import { execSync } from 'child_process';
import path from 'path';

const root = path.resolve(__dirname, '../../..');

function run(script: string) {
  console.log(`\n▶ Running ${script}...`);
  execSync(`tsx ${path.join(__dirname, script)}`, { stdio: 'inherit', cwd: root });
}

run('merge-items.ts');
run('build-recipes.ts');
run('build-index.ts');

console.log('\n✅ Data build complete. Output in src/data/processed/');
