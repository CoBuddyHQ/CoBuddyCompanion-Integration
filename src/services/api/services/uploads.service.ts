import { apiClient } from '../client';
import { Endpoints } from '../endpoints';

function extractUri(file: any): string {
  if (typeof file === 'string') return file;
  if (file && typeof file.uri === 'string') return file.uri;
  return '';
}

function isMockUri(uri: string): boolean {
  return (
    uri.startsWith('stub://') ||
    uri.startsWith('mock://') ||
    uri.startsWith('file:///data/user/0')
  );
}

const MOCK_DOC_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
const MOCK_VIDEO_URL = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';

export const UploadsService = {
  uploadProfilePhoto: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid image file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        key: 'mock_profile_photo',
        size: 1024,
        mimeType: 'image/jpeg',
      };
    }
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || 'profile_photo.jpg',
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.PROFILE_PHOTO, formData);
    return response.data;
  },

  uploadGalleryPhoto: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid image file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        key: 'mock_gallery_photo',
        size: 1024,
        mimeType: 'image/jpeg',
      };
    }
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `gallery_photo_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.GALLERY_PHOTO, formData);
    return response.data;
  },

  deleteGalleryPhoto: async (photoId: string) => {
    const url = Endpoints.UPLOADS.DELETE_PHOTO.replace(':photoId', photoId);
    const response = await apiClient.delete(url);
    return response.data;
  },

  uploadKycIdentity: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid document file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        key: 'mock_kyc_identity',
        size: 1024,
        mimeType: 'image/jpeg',
      };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `kyc_identity_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_IDENTITY, formData);
    return response.data;
  },

  uploadKycSelfie: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid video/photo file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        videoUrl: MOCK_VIDEO_URL,
        key: 'mock_kyc_selfie',
        size: 1024,
        mimeType: 'video/mp4',
      };
    }
    const formData = new FormData();
    formData.append('video', {
      uri,
      type: file?.type || 'video/mp4',
      name: file?.name || `kyc_selfie_${Date.now()}.mp4`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_SELFIE, formData);
    return response.data;
  },

  uploadKycAddress: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid address proof file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        key: 'mock_kyc_address',
        size: 1024,
        mimeType: 'image/jpeg',
      };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `kyc_address_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_ADDRESS, formData);
    return response.data;
  },

  uploadEvidence: async (file: any) => {
    const uri = extractUri(file);
    if (!uri) {
      throw new Error('No valid evidence file provided');
    }
    if (isMockUri(uri)) {
      return {
        url: MOCK_DOC_URL,
        photoUrl: MOCK_DOC_URL,
        key: 'mock_evidence',
        size: 1024,
        mimeType: 'image/jpeg',
      };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `evidence_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.EVIDENCE, formData);
    return response.data;
  },
};
