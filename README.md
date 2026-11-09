# OTT TV App

A simple OTT (Over-The-Top) streaming app for learning how TV apps are built. One TypeScript codebase runs on:

- **Android TV**: [react-native-tvos](https://github.com/react-native-tvos/react-native-tvos) (React Native fork with D-pad focus support)
- **Apple TV (tvOS)**: same react-native-tvos fork, built from the `ios/` Xcode project
- **LG webOS TV**: [react-native-web](https://necolas.github.io/react-native-web/) bundled with webpack

It has a VOD row, a Live channels row, and a full-screen player. All content comes from mock data with public test streams. There is no backend.

## Run it

```bash
npm install

npm run web        # browser / LG build in dev mode: http://localhost:8080
npm run web:build  # production bundle for LG in dist/

npm start          # Metro bundler for Android TV
npm run android    # build + install on an Android TV emulator/device

# Apple TV (macOS + Xcode only)
bundle install                          # once: installs CocoaPods via the Gemfile
cd ios && bundle exec pod install && cd ..
npm run ios                             # build + run on the "Apple TV" simulator
```

On web, use the arrow keys to move focus, **Enter** to open or play/pause, and **Escape** to go back. The LG remote's Back key also works.

## Project structure

```
index.ts                 Android TV / Apple TV entry
index.web.ts             Web/LG entry (loads the arrow-key navigation polyfill)
webpack.config.js        Web bundler config (Chrome 68 target for older webOS)
android/                 Native Android TV project
ios/                     Native Apple TV (tvOS) Xcode project + Podfile
web/index.html           Web page template
src/
├── App.tsx / App.types.ts / App.styles.ts
├── components/
│   ├── VODList/         VODList.tsx, VODList.types.ts, VODList.styles.ts
│   ├── LiveChannelList/ LiveChannelList.tsx, .types.ts, .styles.ts
│   └── VideoPlayer/     VideoPlayer.tsx (native), VideoPlayer.web.tsx (web), .types.ts, .styles.ts
├── services/mockData.ts Mock VOD + live channels
├── types/               Shared types (vod.ts, live.ts, playable.ts)
└── styles/theme.ts      Shared colors, spacing, typography, scaling
```

## Conventions

- Each component has its own folder with `Name.tsx`, `Name.types.ts`, and `Name.styles.ts`.
- Types used by more than one component go in `src/types/`.
- Styles use the shared theme. Sizes are designed for 1920x1080 and scaled with `scaleSize()`, so the same layout fits any resolution. Android TV reports 960dp width on a 1080p screen, and scaling by width handles that too.
- Platform-specific code uses file extensions. webpack picks `*.web.tsx`; Metro (Android TV and Apple TV) picks `*.tsx`.

## How the TV parts work

| Concern | Android TV | Apple TV | LG webOS / browser |
|---|---|---|---|
| Focus movement | Native D-pad focus engine | tvOS focus engine (Siri Remote) | `spatial-navigation-polyfill` (arrow keys) |
| Initial focus | `hasTVPreferredFocus` | `hasTVPreferredFocus` | `ref.focus()` on mount |
| Video | `react-native-video` (ExoPlayer) | `react-native-video` (AVPlayer) | `<video>` + `hls.js` (native HLS fallback) |
| Back key | `BackHandler` | `BackHandler` (Menu / Back button) | `keydown` keyCode 461, Escape, Backspace |

## Next steps (ideas)

- Package `dist/` as a webOS `.ipk` (`appinfo.json`, icon, `ares-package`)
- Seek controls and a progress bar in the player
- Replace `mockData.ts` with a real API
