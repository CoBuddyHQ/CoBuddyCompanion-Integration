import { apiClient } from '../services/api/client';
import { Endpoints } from '../services/api/endpoints';
import { UploadsService } from '../services/api/services/uploads.service';

describe('UploadsService', () => {
  afterEach(() => jest.restoreAllMocks());

  it('uses the authenticated multipart helper, longer KYC timeout, and persisted response URL', async () => {
    const persistedUpload = { url: 'https://cdn.example.test/private/kyc-front.jpg' };
    const post = jest.spyOn(apiClient, 'post').mockResolvedValue({
      data: { success: true, data: persistedUpload },
    } as any);

    const result = await UploadsService.uploadKycIdentity({
      uri: 'file:///tmp/kyc-front.jpg',
      type: 'image/jpeg',
      name: 'kyc-front.jpg',
    });

    expect(result).toEqual(persistedUpload);
    expect(post).toHaveBeenCalledWith(
      Endpoints.UPLOADS.KYC_IDENTITY,
      expect.any(FormData),
      expect.objectContaining({ timeout: 60_000 }),
    );
    // React Native must add the multipart boundary; a bare header breaks uploads.
    const requestConfig = post.mock.calls[0][2];
    expect(requestConfig?.headers?.['Content-Type']).toBeUndefined();
  });

  it('rejects an invalid local URI before starting an upload', async () => {
    const post = jest.spyOn(apiClient, 'post');
    await expect(UploadsService.uploadKycIdentity({ uri: '' })).rejects.toThrow('No valid document file provided');
    expect(post).not.toHaveBeenCalled();
  });
});
