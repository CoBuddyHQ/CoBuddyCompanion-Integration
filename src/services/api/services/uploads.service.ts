import { apiClient } from '../client';
import { Endpoints } from '../endpoints';

export const UploadsService = {
  uploadProfilePhoto: async (photoUri: string) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'profile_photo.jpg',
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.PROFILE_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadGalleryPhoto: async (photoUri: string) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: `gallery_photo_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.GALLERY_PHOTO, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteGalleryPhoto: async (photoId: string) => {
    const url = Endpoints.UPLOADS.DELETE_PHOTO.replace(':photoId', photoId);
    const response = await apiClient.delete(url);
    return response.data;
  },

  uploadKycIdentity: async (fileUri: string) => {
    const formData = new FormData();
    formData.append('document', {
      uri: fileUri,
      type: 'image/jpeg',
      name: `kyc_identity_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_IDENTITY, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadKycSelfie: async (fileUri: string) => {
    const formData = new FormData();
    formData.append('video', {
      uri: fileUri,
      type: 'video/mp4',
      name: `kyc_selfie_${Date.now()}.mp4`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_SELFIE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  uploadKycAddress: async (fileUri: string) => {
    const formData = new FormData();
    formData.append('document', {
      uri: fileUri,
      type: 'image/jpeg',
      name: `kyc_address_${Date.now()}.jpg`,
    } as any);

    const response = await apiClient.post(Endpoints.UPLOADS.KYC_ADDRESS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
