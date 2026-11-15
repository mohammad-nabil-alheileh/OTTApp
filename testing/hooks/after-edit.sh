#!/usr/bin/env bash
# Claude Code PostToolUse hook (Edit|Write|MultiEdit).
#
# Reads the hook payload on stdin, and when the edited file is JS/TS inside
# this project, runs the Jest tests related to it. A failure exits 2, which
# feeds the test output back to Claude so it fixes the change before going on.
set -uo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root" || exit 0

file="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)"

case "$file" in
  "$root"/*) ;;
  *) exit 0 ;;
esac
case "$file" in
  */node_modules/* | */android/* | */ios/* | */dist/*) exit 0 ;;
  *.ts | *.tsx | *.js | *.jsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

if ! out="$(npx jest --findRelatedTests "$file" --passWithNoTests 2>&1)"; then
  {
    echo "Related Jest tests FAILED after editing ${file#"$root"/}:"
    echo "$out" | tail -n 80
  } >&2
  exit 2
fi
exit 0
