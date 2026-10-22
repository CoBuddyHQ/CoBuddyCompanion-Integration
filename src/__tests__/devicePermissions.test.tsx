import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import { requestLocationAccess, requestNotificationAccess } from '../services/devicePermissions';
import LocationPermissionScreen from '../screens/auth/LocationPermissionScreen';
import NotificationPermissionScreen from '../screens/auth/NotificationPermissionScreen';
import ActionButton from '../components/actions/ActionButton';
import { Routes } from '../navigation/routes';

jest.mock('../components/layout/ScreenTopBar', () => () => null);
jest.mock('../components/feedback/HeroIcon', () => () => null);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, fallback?: string) => fallback || key }),
}));
jest.mock('i18next', () => ({ t: (key: string) => key }));

const { PERMISSIONS, RESULTS } = PermissionsAndroid;

beforeEach(() => {
  jest.replaceProperty(Platform, 'OS', 'android');
  jest.spyOn(Platform, 'Version', 'get').mockReturnValue(35);
  jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(false);
  jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue(RESULTS.DENIED);
  jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
    [PERMISSIONS.ACCESS_FINE_LOCATION]: RESULTS.DENIED,
    [PERMISSIONS.ACCESS_COARSE_LOCATION]: RESULTS.DENIED,
  } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>);
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe('Android device permission adapter', () => {
  it('requests foreground fine and coarse location together', async () => {
    jest.mocked(PermissionsAndroid.requestMultiple).mockResolvedValue({
      [PERMISSIONS.ACCESS_FINE_LOCATION]: RESULTS.GRANTED,
      [PERMISSIONS.ACCESS_COARSE_LOCATION]: RESULTS.GRANTED,
    } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>);
    await expect(requestLocationAccess()).resolves.toBe('granted');
    expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
      PERMISSIONS.ACCESS_FINE_LOCATION, PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  });

  it('distinguishes approximate location from precise access', async () => {
    jest.mocked(PermissionsAndroid.requestMultiple).mockResolvedValue({
      [PERMISSIONS.ACCESS_FINE_LOCATION]: RESULTS.DENIED,
      [PERMISSIONS.ACCESS_COARSE_LOCATION]: RESULTS.GRANTED,
    } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>);
    await expect(requestLocationAccess()).resolves.toBe('limited');
  });

  it.each([
    [RESULTS.DENIED, 'denied'],
    [RESULTS.NEVER_ASK_AGAIN, 'blocked'],
  ])('preserves location result %s', async (status, expected) => {
    jest.mocked(PermissionsAndroid.requestMultiple).mockResolvedValue({
      [PERMISSIONS.ACCESS_FINE_LOCATION]: status,
      [PERMISSIONS.ACCESS_COARSE_LOCATION]: status,
    } as Awaited<ReturnType<typeof PermissionsAndroid.requestMultiple>>);
    await expect(requestLocationAccess()).resolves.toBe(expected);
  });

  it.each([
    [RESULTS.GRANTED, 'granted'],
    [RESULTS.DENIED, 'denied'],
    [RESULTS.NEVER_ASK_AGAIN, 'blocked'],
  ])('preserves Android notification result %s', async (status, expected) => {
    jest.mocked(PermissionsAndroid.request).mockResolvedValue(status);
    await expect(requestNotificationAccess()).resolves.toBe(expected);
    expect(PermissionsAndroid.request).toHaveBeenCalledWith(PERMISSIONS.POST_NOTIFICATIONS);
  });

  it('does not prompt again for already granted permissions', async () => {
    jest.mocked(PermissionsAndroid.check).mockResolvedValue(true);
    await expect(requestLocationAccess()).resolves.toBe('granted');
    await expect(requestNotificationAccess()).resolves.toBe('granted');
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    expect(PermissionsAndroid.requestMultiple).not.toHaveBeenCalled();
  });

  it('does not claim notification grant on Android versions without a runtime prompt', async () => {
    jest.spyOn(Platform, 'Version', 'get').mockReturnValue(32);
    await expect(requestNotificationAccess()).resolves.toBe('not-required');
    expect(PermissionsAndroid.check).not.toHaveBeenCalled();
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
  });

  it('reports unsupported iOS requests without inventing authorization', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    await expect(requestLocationAccess()).resolves.toBe('unavailable');
    await expect(requestNotificationAccess()).resolves.toBe('unavailable');
    expect(PermissionsAndroid.check).not.toHaveBeenCalled();
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    expect(PermissionsAndroid.requestMultiple).not.toHaveBeenCalled();
  });

  it('handles native errors without exposing error contents or claiming success', async () => {
    jest.mocked(PermissionsAndroid.check).mockRejectedValue(new Error('native failure'));
    await expect(requestLocationAccess()).resolves.toBe('unavailable');
    await expect(requestNotificationAccess()).resolves.toBe('unavailable');
  });
});

describe.each([
  ['location', LocationPermissionScreen, Routes.CREATE_PIN],
  ['notifications', NotificationPermissionScreen, Routes.LOCATION_PERMISSION],
] as const)('%s onboarding permission screen', (_label, Screen, nextRoute) => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  const navigate = jest.fn();

  beforeEach(async () => {
    navigate.mockClear();
    await act(async () => {
      renderer = ReactTestRenderer.create(<Screen
        navigation={{ navigate, goBack: jest.fn() } as never}
        route={{} as never}
      />);
    });
  });

  afterEach(async () => {
    await act(async () => renderer?.unmount());
  });

  it('keeps the screen open and explains denial', async () => {
    await act(async () => renderer.root.findByType(ActionButton).props.onPress());
    expect(navigate).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('not granted'));
  }, 30000);

  it('continues after a confirmed native grant', async () => {
    jest.mocked(PermissionsAndroid.check).mockResolvedValue(true);
    await act(async () => renderer.root.findByType(ActionButton).props.onPress());
    expect(navigate).toHaveBeenCalledWith(nextRoute);
    expect(Alert.alert).not.toHaveBeenCalled();
  }, 30000);

  it('allows explicit skip without requesting or claiming permission', async () => {
    const skip = renderer.root.findAllByType(TouchableOpacity)
      .find(node => node.props.onPress !== renderer.root.findByType(ActionButton).props.onPress);
    expect(skip).toBeDefined();
    await act(async () => skip!.props.onPress());
    expect(navigate).toHaveBeenCalledWith(nextRoute);
    expect(PermissionsAndroid.check).not.toHaveBeenCalled();
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
    expect(PermissionsAndroid.requestMultiple).not.toHaveBeenCalled();
  }, 30000);
});
