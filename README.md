# OTT TV App

A simple Over-The-Top (OTT) streaming application built with **React Native** for TV platforms (Android TV, LG TV). The app demonstrates VOD (Video On Demand) and Live streaming UI patterns.

## 🎯 Purpose

This is a **training project** designed to teach:
- React Native development for TV applications
- Component organization and best practices
- Responsive design for multiple screen resolutions
- TypeScript in React Native
- VOD and Live streaming UI patterns

## 📱 Features

- **VOD Library**: Browse and watch on-demand videos
- **Live Channels**: View and watch live streaming channels
- **Responsive Design**: Optimized for 1080p, scales to other resolutions
- **TV Navigation**: Remote-friendly controls (D-pad, Enter, Back)
- **Mock Data**: Pre-configured with sample content for learning

## 🏗️ Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── VODList/
│   │   ├── VODList.tsx
│   │   ├── VODList.types.ts
│   │   └── VODList.styles.ts
│   └── LiveChannelList/
│       ├── LiveChannelList.tsx
│       ├── LiveChannelList.types.ts
│       └── LiveChannelList.styles.ts
├── screens/                 # Screen containers
│   ├── HomeScreen.tsx
│   ├── VODScreen.tsx
│   └── LiveScreen.tsx
├── services/
│   └── mockData.ts         # Mock VOD and Live channel data
├── types/                  # Shared TypeScript interfaces
│   ├── vod.ts
│   └── live.ts
├── styles/
│   └── theme.ts            # Shared theme, colors, spacing, typography
├── navigation/
│   └── index.ts            # Navigation setup
├── App.tsx                 # Main app component
├── App.types.ts
└── App.styles.ts
```

## 🎨 Styling Architecture

- **Unified Theme**: All colors, spacing, and typography defined in `src/styles/theme.ts`
- **Component Styles**: Each component has its own `ComponentName.styles.ts`
- **Responsive Scaling**: Automatically scales based on screen diagonal (1920px = 1.0)

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run on Web (for testing)
```bash
npm start -- --web
```

### Run on Android TV
```bash
npm run android
```

### Run Development Server
```bash
npm start
```

## 📝 Development Guidelines

### Creating New Components

1. Create a folder: `src/components/MyComponent/`
2. Create three files:
   - `MyComponent.tsx` - Component logic
   - `MyComponent.types.ts` - TypeScript interfaces
   - `MyComponent.styles.ts` - StyleSheet definitions

3. Example:
```typescript
// MyComponent.types.ts
export interface MyComponentProps {
  title: string;
  onPress: () => void;
}

// MyComponent.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
  },
});

// MyComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './MyComponent.styles';
import { MyComponentProps } from './MyComponent.types';

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => (
  <View style={styles.container}>
    <Text>{title}</Text>
  </View>
);
```

### Using Theme

All styling values are imported from `src/styles/theme.ts`:

```typescript
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

// Use in styles
export const styles = StyleSheet.create({
  text: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
```

## 📚 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [Android TV Development](https://developer.android.com/training/tv)
- [React Native TV Support](https://reactnative.dev/docs/tvos)

## 🔗 Next Steps

1. Connect to real VOD/Live APIs
2. Implement video playback
3. Add user authentication
4. Create navigation screens
5. Implement playback tracking

## 📄 License

Training project - Free to use and modify

---

**Built with ❤️ for learning**
