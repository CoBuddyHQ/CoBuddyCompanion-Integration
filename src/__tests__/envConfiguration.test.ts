import { resolveCompanionEndpoints } from '../config/env';

describe('Companion App environment configuration', () => {
  it('uses local Docker endpoints only in development and resolves Android localhost', () => {
    expect(resolveCompanionEndpoints(undefined, undefined, undefined, 'android')).toMatchObject({
      appEnvironment: 'development',
      apiBaseUrl: 'http://10.0.2.2:4001/api/v1',
      socketUrl: 'http://10.0.2.2:4001',
    });
    expect(resolveCompanionEndpoints('test', 'http://localhost:4001/api/v1', 'http://127.0.0.1:4001', 'android'))
      .toMatchObject({ apiBaseUrl: 'http://10.0.2.2:4001/api/v1', socketUrl: 'http://10.0.2.2:4001' });
  });

  it('requires explicit API and socket URLs in deployed environments', () => {
    expect(() => resolveCompanionEndpoints('production', undefined, undefined, 'ios'))
      .toThrow('API_BASE_URL is required');
    expect(() => resolveCompanionEndpoints('staging', 'https://api.example.invalid', undefined, 'ios'))
      .toThrow('SOCKET_URL is required');
  });

  it.each(['production', 'staging'])('rejects non-HTTPS deployed URLs in %s', (environment) => {
    expect(() => resolveCompanionEndpoints(environment, 'http://api.example.invalid', 'wss://socket.example.invalid', 'ios'))
      .toThrow('API_BASE_URL must use HTTPS');
    expect(() => resolveCompanionEndpoints(environment, 'https://api.example.invalid', 'http://socket.example.invalid', 'ios'))
      .toThrow('SOCKET_URL must use HTTPS');
  });

  it('rejects embedded credentials in URLs', () => {
    expect(() => resolveCompanionEndpoints('production', 'https://user:pass@api.example.invalid', 'https://socket.example.invalid', 'ios'))
      .toThrow('without embedded credentials');
  });
});
