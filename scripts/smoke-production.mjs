import { spawn } from 'node:child_process';

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['dist/server.mjs'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk; });
server.stderr.on('data', (chunk) => { serverOutput += chunk; });

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForHealth() {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return response;
      lastError = new Error(`Health endpoint returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await pause(100);
  }
  throw new Error(`Production server did not become ready: ${lastError?.message || 'unknown error'}\n${serverOutput}`);
}

try {
  const health = await waitForHealth();
  const payload = await health.json();
  if (payload.status !== 'ok' || !payload.time) {
    throw new Error('Health endpoint returned an invalid payload');
  }

  const page = await fetch(`${baseUrl}/`);
  if (!page.ok || !(await page.text()).includes('<div id="root">')) {
    throw new Error('Production server did not serve the application shell');
  }

  const manifest = await fetch(`${baseUrl}/manifest.json`);
  const manifestPayload = await manifest.json();
  if (!manifest.ok || manifestPayload.display !== 'standalone' || !Array.isArray(manifestPayload.icons) || manifestPayload.icons.length === 0) {
    throw new Error('Production PWA manifest is missing standalone mobile configuration');
  }

  const worker = await fetch(`${baseUrl}/notification-worker.js`);
  if (!worker.ok || !(await worker.text()).includes("addEventListener('push'")) {
    throw new Error('Production notification worker is unavailable');
  }

  console.log('Production smoke test passed.');
} finally {
  server.kill('SIGTERM');
}
