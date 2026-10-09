import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../.tools/openapi-repair.cjs', import.meta.url));
const expected = '9ece1d612045122e9229be796db642111ff740e34422d549ae581f8d84414dbc';
export function runCli(args) {
  if (createHash('sha256').update(readFileSync(cli)).digest('hex') !== expected) {
    throw new Error('CLI checksum mismatch; review the distribution before updating the pin.');
  }
  const run = spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8', timeout: 30000, maxBuffer: 2 * 1024 * 1024,
  });
  if (run.error || run.signal || run.status === null) {
    throw new Error('CLI did not finish within the bounded execution limits.');
  }
  if (![0, 1, 2].includes(run.status)) throw new Error('Unexpected CLI exit code.');
  let report;
  try { report = JSON.parse(run.stdout); }
  catch { throw new Error('CLI returned no parseable JSON report.'); }
  return { status: run.status, report };
}
