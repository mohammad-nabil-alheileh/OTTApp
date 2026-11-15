import { execSync } from 'child_process';
import path from 'path';

// Builds the same production bundle that ships to the TVs.
export default function globalSetup() {
  if (process.env.E2E_SKIP_BUILD) {
    return;
  }
  execSync('npm run web:build', {
    cwd: path.resolve(__dirname, '../../..'),
    stdio: 'inherit',
  });
}
