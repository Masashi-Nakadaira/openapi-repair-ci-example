#!/usr/bin/env bash
# Fetch only the maintainer's public CLI, and verify the reviewed archive.
set -euo pipefail
cd "$(dirname "$0")/.."
archive_sha='11be8c7fd679d8a65755fc9df77aed39f885dccac7cf18984dc9c03d971f4c6b'
cli_sha='9ece1d612045122e9229be796db642111ff740e34422d549ae581f8d84414dbc'
mkdir -p .tools
archive='.tools/openapi-repair-cli-preview.zip'
if [[ $# -gt 1 ]]; then printf '%s\n' 'Usage: bash scripts/fetch-cli.sh [already-downloaded-archive]' >&2; exit 2; fi
if [[ $# -eq 1 ]]; then
  cp -- "$1" "$archive"
else
  curl --fail --location --proto '=https' --tlsv1.2 --max-time 60 \
    'https://openapi-repair.pages.dev/downloads/openapi-repair-cli-preview.zip' \
    --output "$archive"
fi
printf '%s  %s\n' "$archive_sha" "$archive" | sha256sum --check --status || {
  printf '%s\n' 'CLI archive checksum differs. Stop and review the new release; do not bypass this check.' >&2
  exit 2
}
python3 - <<'PY'
import pathlib, zipfile
root = pathlib.Path('.tools')
expected = {'README.txt', 'THIRD-PARTY-NOTICES.txt', 'openapi-repair.cjs'}
with zipfile.ZipFile(root / 'openapi-repair-cli-preview.zip') as z:
    names = z.namelist()
    if set(names) != expected or len(names) != len(expected):
        raise SystemExit('Unexpected CLI archive entries')
    if sum(i.file_size for i in z.infolist()) > 2 * 1024 * 1024:
        raise SystemExit('CLI archive is larger than the reviewed budget')
    for name in sorted(expected):
        (root / name).write_bytes(z.read(name))
PY
printf '%s  %s\n' "$cli_sha" '.tools/openapi-repair.cjs' | sha256sum --check --status
printf '%s\n' 'Verified public CLI: aws-rest-oas30-2026-10-06'
