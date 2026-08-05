/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
  '[react-native-gesture-handler] Seems like you\'re using an old API',
  'Gesture handler is already enabled',
]);

const appNames = Array.from(new Set([appName, 'CoBuddyCompanion', 'cobuddyCustomer']));

appNames.forEach(name => {
  AppRegistry.registerComponent(name, () => App);
});
