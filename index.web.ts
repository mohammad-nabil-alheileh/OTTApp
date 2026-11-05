/// <reference lib="dom" />
// Browsers have no D-pad focus engine; this makes arrow keys (LG remote) move focus.
import 'spatial-navigation-polyfill';
import { AppRegistry } from 'react-native';
import App from './src/App';
import appConfig from './app.json';

AppRegistry.registerComponent(appConfig.name, () => App);
AppRegistry.runApplication(appConfig.name, {
  rootTag: document.getElementById('root'),
});
