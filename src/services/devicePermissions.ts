import { PermissionsAndroid, Platform } from 'react-native';

export type PermissionOutcome =
  | 'granted'
  | 'limited'
  | 'denied'
  | 'blocked'
  | 'unavailable'
  | 'not-required';

/** Request foreground access only. Never request background location here. */
export async function requestLocationAccess(): Promise<PermissionOutcome> {
  if (Platform.OS !== 'android') return 'unavailable';
  const fine = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
  const coarse = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
  try {
    if (await PermissionsAndroid.check(fine)) return 'granted';
    // Android 12+ requires both declarations in the same runtime request.
    const result = await PermissionsAndroid.requestMultiple([fine, coarse]);
    if (result[fine] === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
    if (result[coarse] === PermissionsAndroid.RESULTS.GRANTED) return 'limited';
    if (result[fine] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        result[coarse] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
    return 'denied';
  } catch {
    return 'unavailable';
  }
}

/** OS permission does not establish FCM registration or notification delivery. */
export async function requestNotificationAccess(): Promise<PermissionOutcome> {
  if (Platform.OS !== 'android') return 'unavailable';
  const apiLevel = Number(Platform.Version);
  if (!Number.isFinite(apiLevel)) return 'unavailable';
  // Earlier Android versions have no notification runtime permission prompt.
  if (apiLevel < 33) return 'not-required';
  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  try {
    if (await PermissionsAndroid.check(permission)) return 'granted';
    const result = await PermissionsAndroid.request(permission);
    if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
    return 'denied';
  } catch {
    return 'unavailable';
  }
}
