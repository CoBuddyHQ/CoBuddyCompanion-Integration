/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
]);

const appNames = Array.from(new Set([appName, 'CoBuddyCompanion', 'cobuddyCustomer']));

appNames.forEach(name => {
  AppRegistry.registerComponent(name, () => App);
});
