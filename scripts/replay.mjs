import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runCli } from './cli.mjs';
const names = ['fixtures/inherited.json', 'fixtures/explicit-copy.json', 'fixtures/anonymous-change.json'];
const beforeBytes = names.map(p => readFileSync(p));
const inherited = runCli(['check', names[0], '--fail-on', 'warning']);
assert.equal(inherited.status, 1);
assert(inherited.report.inputs[0].findings.some(x => x.ruleId === 'aws.operationSecurityMissing'));
const explicit = runCli(['check', names[1], '--fail-on', 'warning']);
assert.equal(explicit.status, 0); // All operations are explicit, so there is no remaining inheritance finding.
assert(!explicit.report.inputs[0].findings.some(x => x.ruleId === 'aws.operationSecurityMissing'));
assert.equal(explicit.report.inputs[0].findings.length, 0);
const copied = runCli(['compare', names[0], names[1]]);
assert.equal(copied.status, 0);
assert.equal(copied.report.summary['declaration-only'], 1);
assert.equal(copied.report.summary['unchanged'], 2);
assert.equal(copied.report.summary['anonymous-access-added'], 0);
const changed = runCli(['compare', names[1], names[2]]);
assert.equal(changed.status, 1);
assert.equal(changed.report.summary['anonymous-access-added'], 1);
for (let i = 0; i < names.length; i++) assert.deepEqual(readFileSync(names[i]), beforeBytes[i]);
console.log(JSON.stringify({
  syntheticReplay: 'passed',
  inheritedSecurityWarning: 'detected',
  declarationOnlyCopy: 'compare exit 0',
  anonymousAccessChange: 'compare exit 1',
  inputFilesUnchanged: true,
  scope: 'Local declarations only; no AWS import or runtime authorization test.',
}, null, 2));
