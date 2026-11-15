#!/usr/bin/env bash
# Test gates for the step-by-step workflow described in CLAUDE.md.
#
#   bash testing/run-checks.sh quick [files...]
#       Jest tests related to the given files, or, with no files, to every
#       file changed since HEAD (staged, unstaged and untracked). Seconds.
#
#   bash testing/run-checks.sh full
#       Typecheck + lint + the whole Jest suite. Run before calling a step done
#       and before every commit.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

mode="${1:-full}"
shift || true

run() {
  echo "==> $*"
  "$@"
}

case "$mode" in
  quick)
    if [ "$#" -gt 0 ]; then
      files=("$@")
    else
      mapfile -t files < <(
        { git diff --name-only HEAD; git ls-files --others --exclude-standard; } |
          grep -E '\.(ts|tsx|js|jsx)$' | sort -u
      )
    fi
    if [ "${#files[@]}" -eq 0 ]; then
      echo "No changed source files; nothing to test."
      exit 0
    fi
    run npx jest --findRelatedTests "${files[@]}" --passWithNoTests
    ;;
  full)
    status=0
    run npx tsc --noEmit || status=1
    run npx eslint src testing index.ts index.web.ts || status=1
    run npx jest || status=1
    if [ "$status" -ne 0 ]; then
      echo "FAILED: fix the errors above before moving on." >&2
    else
      echo "All checks passed."
    fi
    exit "$status"
    ;;
  *)
    echo "usage: $0 quick [files...] | full" >&2
    exit 64
    ;;
esac
