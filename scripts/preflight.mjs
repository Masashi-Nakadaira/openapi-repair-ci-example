import { appendFileSync } from 'node:fs';
import { runCli } from './cli.mjs';
const [candidate, baseline, ...rest] = process.argv.slice(2);
if (!candidate || rest.length) { console.error('Usage: node scripts/preflight.mjs candidate.json [baseline.json]'); process.exit(2); }
try {
  // Errors block. All warnings remain visible and require human review.
  const check = runCli(['check', '--', candidate]);
  console.log(JSON.stringify({ check: check.report }, null, 2));
  let exit = check.status;
  let compare;
  if (baseline && check.status === 0) {
    compare = runCli(['compare', '--', baseline, candidate]);
    console.log(JSON.stringify({ compare: compare.report }, null, 2));
    exit = compare.status;
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const findings = check.report.inputs?.flatMap(x => x.findings ?? []) ?? [];
    const warnings = findings.filter(x => x.severity === 'warning').reduce((a, x) => a + x.count, 0);
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `## OpenAPI Repair bounded preflight\n\nCheck exit: ${check.status}. Warning findings: ${warnings}.\n\n` +
      (compare ? `Security-declaration comparison exit: ${compare.status}.\n\n` : 'No comparison was run.\n\n') +
      'Review the JSON reports in the log. A green check does not mean AWS accepted the definition or that access is secure. This example has no AWS deployment step.\n');
  }
  process.exitCode = exit;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
