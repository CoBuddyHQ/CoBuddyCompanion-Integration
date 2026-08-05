import { apiClient } from '../client';
import { Endpoints } from '../endpoints';

const DEFAULT_STUB_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';

function extractUri(file: any): string {
  if (typeof file === 'string') return file;
  if (file && typeof file.uri === 'string') return file.uri;
  return '';
}

export const UploadsService = {
  uploadProfilePhoto: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL };
    }
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || 'profile_photo.jpg',
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.PROFILE_PHOTO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadGalleryPhoto: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL, photoId: `stub-${Date.now()}` };
    }
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `gallery_photo_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.GALLERY_PHOTO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteGalleryPhoto: async (photoId: string) => {
    const url = Endpoints.UPLOADS.DELETE_PHOTO.replace(':photoId', photoId);
    const response = await apiClient.delete(url);
    return response.data;
  },

  uploadKycIdentity: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `kyc_identity_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_IDENTITY, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadKycSelfie: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL };
    }
    const formData = new FormData();
    formData.append('video', {
      uri,
      type: file?.type || 'video/mp4',
      name: file?.name || `kyc_selfie_${Date.now()}.mp4`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_SELFIE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadKycAddress: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `kyc_address_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_ADDRESS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadEvidence: async (file: any) => {
    const uri = extractUri(file);
    if (!uri || uri.startsWith('stub://')) {
      return { photoUrl: DEFAULT_STUB_URL, url: DEFAULT_STUB_URL };
    }
    const formData = new FormData();
    formData.append('document', {
      uri,
      type: file?.type || 'image/jpeg',
      name: file?.name || `evidence_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.EVIDENCE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
