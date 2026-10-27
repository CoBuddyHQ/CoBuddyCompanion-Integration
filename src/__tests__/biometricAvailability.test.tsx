import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';
import ActionButton from '../components/actions/ActionButton';
import { apiPost } from '../services/api/client';
import { AuthService, BIOMETRIC_UNAVAILABLE_MESSAGE } from '../services/api/services/auth.service';

const mockSetAuthStatus = jest.fn();
const mockEnrollBiometric = jest.fn();

jest.mock('../store/slices/authStore', () => ({
  useAuthStore: () => ({
    setAuthStatus: mockSetAuthStatus,
    enrollBiometric: mockEnrollBiometric,
  }),
}));
jest.mock('../services/api/client', () => ({ apiPost: jest.fn() }));
jest.mock('../components/layout/ScreenTopBar', () => () => null);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, fallback?: string) => fallback || key }),
}));

describe('unavailable biometric enrollment', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects enrollment without calling the backend', async () => {
    await expect(AuthService.enrollBiometric({
      deviceId: 'synthetic-device', publicKey: 'synthetic-key',
    })).rejects.toThrow(BIOMETRIC_UNAVAILABLE_MESSAGE);
    expect(apiPost).not.toHaveBeenCalled();
  });

  it('shows availability honestly and continues PIN onboarding without enrollment', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<BiometricSetupScreen
        navigation={{ goBack: jest.fn() } as never}
        route={{} as never}
      />);
    });
    expect(JSON.stringify(renderer!.toJSON())).toContain('Biometric sign-in unavailable');
    const actions = renderer!.root.findAllByType(ActionButton);
    expect(actions).toHaveLength(1);
    expect(actions[0].props.label).toBe('Use PIN Only');
    expect(mockSetAuthStatus).not.toHaveBeenCalled();
    await act(async () => actions[0].props.onPress());
    expect(mockSetAuthStatus).toHaveBeenCalledWith('onboarding');
    expect(mockEnrollBiometric).not.toHaveBeenCalled();
    expect(apiPost).not.toHaveBeenCalled();
    await act(async () => renderer!.unmount());
  }, 30000);
});
