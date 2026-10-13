import { apiClient } from '../client';
import { Endpoints } from '../endpoints';

function extractUri(file: any): string {
  if (typeof file === 'string') return file;
  if (file && typeof file.uri === 'string') return file.uri;
  return '';
}

function isValidMediaUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false;
  return (
    uri.startsWith('content://') ||
    uri.startsWith('file://') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://') ||
    uri.startsWith('data:')
  );
}

export const UploadsService = {
  uploadProfilePhoto: async (file: any) => {
    const uri = extractUri(file);
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid image file provided');
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
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid image file provided');
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
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid document file provided');
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
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid video/photo file provided');
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
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid address proof file provided');
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
    if (!isValidMediaUri(uri)) {
      throw new Error('No valid evidence file provided');
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
