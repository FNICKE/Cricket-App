import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('============================================================');
console.log('       STARTING CRICKET PLATFORM (ALL 3 IN ONE GO)          ');
console.log('============================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start API Server (Port 4000 with auto-reload watch restricted to src/)
const apiProcess = spawn('node --experimental-strip-types --watch-path=src --watch src/server.ts', [], {
  cwd: path.join(__dirname, 'apps', 'api'),
  shell: true,
  stdio: 'pipe'
});

apiProcess.stdout?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`\x1b[36m[API]\x1b[0m ${line}`);
});
apiProcess.stderr?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`\x1b[31m[API ERR]\x1b[0m ${line}`);
});

// 2. Start Scorer Admin Panel (Port 5173)
const adminProcess = spawn(`${npmCmd} run dev`, [], {
  cwd: path.join(__dirname, 'apps', 'admin'),
  shell: true,
  stdio: 'pipe'
});

adminProcess.stdout?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`\x1b[33m[SCORER ADMIN]\x1b[0m ${line}`);
});
adminProcess.stderr?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`\x1b[31m[ADMIN ERR]\x1b[0m ${line}`);
});

// 3. Start Fan Web Match Centre (Port 3000)
const webProcess = spawn(`${npmCmd} run dev`, [], {
  cwd: path.join(__dirname, 'apps', 'web'),
  shell: true,
  stdio: 'pipe'
});

webProcess.stdout?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`\x1b[32m[FAN WEB]\x1b[0m ${line}`);
});
webProcess.stderr?.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`\x1b[31m[WEB ERR]\x1b[0m ${line}`);
});

console.log('\nAll 3 services are launching:');
console.log('  1. Fan Live Web:      http://localhost:3000');
console.log('  2. Scorer Admin:      http://localhost:5173');
console.log('  3. API & WebSocket:   http://localhost:4000\n');

process.on('SIGINT', () => {
  apiProcess.kill();
  adminProcess.kill();
  webProcess.kill();
  process.exit(0);
});
