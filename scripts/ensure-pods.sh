#!/usr/bin/env bash
# Runs `pod install` only when ios/Pods is missing or out of sync with
# ios/Podfile.lock (the same check Xcode's "[CP] Check Pods Manifest.lock"
# build phase does, but fixed automatically instead of failing the build).
# Called automatically before `npm run ios` (npm "preios" script).
set -euo pipefail

cd "$(dirname "$0")/../ios"

if [ -f Podfile.lock ] && [ -f Pods/Manifest.lock ] && diff -q Podfile.lock Pods/Manifest.lock >/dev/null; then
  exit 0
fi

echo "==> ios/Pods is missing or out of date, running pod install"
if ! bundle exec pod install; then
  echo
  echo "pod install failed. Try: npm run setup:ios  (checks Xcode, Node, Ruby and Bundler first)"
  exit 1
fi
