#!/usr/bin/env bash
# One-command Apple TV setup for macOS: checks the toolchain, then installs
# npm packages, Ruby gems (CocoaPods) and pods. Safe to re-run any time.
#
#   npm run setup:ios
set -euo pipefail

cd "$(dirname "$0")/.."

red() { printf '\033[31m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
step() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
fail() { red "✗ $1"; [ -n "${2:-}" ] && echo "  Fix: $2"; exit 1; }

SIM_NAME="Apple TV"   # npm run ios targets this simulator name

# ---------------------------------------------------------------- checks
step "Checking toolchain"

[ "$(uname -s)" = "Darwin" ] || fail "Apple TV builds need macOS."

# Xcode (full app, selected, license accepted)
DEV_DIR="$(xcode-select -p 2>/dev/null || true)"
case "$DEV_DIR" in
  *CommandLineTools*|"")
    fail "xcode-select points at '$DEV_DIR', not Xcode.app." \
      "sudo xcode-select -s /Applications/Xcode.app" ;;
esac
xcodebuild -version >/dev/null 2>&1 ||
  fail "xcodebuild does not run (license not accepted?)." "sudo xcodebuild -license accept && xcodebuild -runFirstLaunch"
green "✓ $(xcodebuild -version | head -1) at $DEV_DIR"

TVOS_RUNTIME="$(xcrun simctl list runtimes -j | node -e '
  const r = JSON.parse(require("fs").readFileSync(0)).runtimes
    .filter(x => x.platform === "tvOS" && x.isAvailable);
  if (r.length) console.log(r[r.length - 1].identifier);')"
[ -n "$TVOS_RUNTIME" ] ||
  fail "No tvOS simulator runtime installed." "Xcode > Settings > Components > tvOS, or: xcodebuild -downloadPlatform tvOS"
green "✓ tvOS simulator runtime ($TVOS_RUNTIME)"

# Node: must match .nvmrc major
command -v node >/dev/null || fail "Node is not installed." "brew install node@$(cat .nvmrc)"
WANT_NODE="$(tr -dc '0-9' < .nvmrc)"
HAVE_NODE="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$HAVE_NODE" != "$WANT_NODE" ]; then
  yellow "! Node $(node -v) found, project is pinned to Node $WANT_NODE (.nvmrc)."
  echo "  Fix: nvm install && nvm use   (or: brew install node@$WANT_NODE && brew link --overwrite node@$WANT_NODE)"
  [ "${ALLOW_NODE_MISMATCH:-}" = "1" ] || fail "Node version mismatch (set ALLOW_NODE_MISMATCH=1 to continue anyway)."
else
  green "✓ Node $(node -v)"
fi

# Ruby: macOS system Ruby needs sudo for gems and breaks CocoaPods often
RUBY_PATH="$(command -v ruby || true)"
[ -n "$RUBY_PATH" ] || fail "Ruby is not installed." "brew install ruby@3.3"
if [ "$RUBY_PATH" = "/usr/bin/ruby" ]; then
  fail "Using macOS system Ruby ($(ruby -v | cut -d' ' -f2)), which breaks CocoaPods installs." \
    "brew install ruby@3.3 && echo 'export PATH=\"/opt/homebrew/opt/ruby@3.3/bin:\$PATH\"' >> ~/.zshrc && exec zsh"
fi
command -v bundle >/dev/null || fail "Bundler is missing." "gem install bundler"
green "✓ Ruby $(ruby -e 'print RUBY_VERSION') ($RUBY_PATH), Bundler $(bundle -v | awk '{print $NF}')"

# Watchman: optional, but without it Metro can hit "EMFILE: too many open files"
if command -v watchman >/dev/null; then
  green "✓ Watchman $(watchman -v)"
else
  yellow "! Watchman not installed (recommended): brew install watchman"
fi

# Xcode's build phases find node through ios/.xcode.env(.local)
if [ ! -f ios/.xcode.env.local ]; then
  echo "export NODE_BINARY=$(command -v node)" > ios/.xcode.env.local
  green "✓ Wrote ios/.xcode.env.local (NODE_BINARY=$(command -v node))"
fi

# ---------------------------------------------------------------- install
step "Installing npm packages (npm ci)"
npm ci

step "Installing Ruby gems (CocoaPods) from Gemfile.lock"
bundle install

step "Installing pods"
(cd ios && bundle exec pod install)

# ---------------------------------------------------------------- simulator
step "Checking for a simulator named \"$SIM_NAME\""
if xcrun simctl list devices available | grep -q "^ *$SIM_NAME ("; then
  green "✓ \"$SIM_NAME\" simulator exists"
else
  DEVICE_TYPE="$(xcrun simctl list devicetypes -j | node -e '
    const t = JSON.parse(require("fs").readFileSync(0)).devicetypes
      .filter(x => x.productFamily === "Apple TV" || /Apple-TV/.test(x.identifier));
    if (t.length) console.log(t[t.length - 1].identifier);')"
  [ -n "$DEVICE_TYPE" ] || fail "No Apple TV simulator device type found." "Install the tvOS platform in Xcode > Settings > Components"
  xcrun simctl create "$SIM_NAME" "$DEVICE_TYPE" "$TVOS_RUNTIME" >/dev/null
  green "✓ Created \"$SIM_NAME\" simulator ($DEVICE_TYPE)"
fi

step "Done"
echo "Run the app:  npm start   (terminal 1)"
echo "              npm run ios (terminal 2)"
