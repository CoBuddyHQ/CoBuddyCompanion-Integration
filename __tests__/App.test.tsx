/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
jest.mock('../src/navigation/RootNavigator', () => ({ __esModule: true, default: () => null }));
import App from '../App';

test('renders correctly', async () => {
  let renderer: any;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);

