import { apiGet, apiPost } from '../client';
import { Endpoints } from '../endpoints';

export const KycService = {
  getKycStatus: (): Promise<any> => apiGet(Endpoints.KYC.STATUS),
  saveDraft: (data: any) => apiPost(Endpoints.KYC.SAVE_DRAFT, data),
  submit: (data: any) => apiPost(Endpoints.KYC.SUBMIT, data),
  
  saveBasicDetails: (data: any) =>
    apiPost(Endpoints.KYC.BASIC_DETAILS, data),
    
  saveDeclaration: (data: any) =>
    apiPost(Endpoints.KYC.SAVE_DECLARATION, data),
  
  updateGovernmentIdType: (data: { documentType: string }) => 
    apiPost(Endpoints.KYC.SET_GOVERNMENT_ID_TYPE, data),
    
  submitGovernmentId: (data: { documentType: string; frontUrl: string; backUrl?: string }) => 
    apiPost(Endpoints.KYC.UPLOAD_GOVERNMENT_ID, data),
    
  submitSelfie: (data: { imageUrl: string; videoUrl?: string }) => 
    apiPost(Endpoints.KYC.UPLOAD_SELFIE, data),
    
  saveAddress: (data: any) => 
    apiPost(Endpoints.KYC.SAVE_ADDRESS, data),
    
  savePan: (data: any) => 
    apiPost(Endpoints.KYC.SAVE_PAN, data),
    
  saveBank: (data: any) => 
    apiPost(Endpoints.KYC.SAVE_BANK, data),
    
  verifyBank: (data: any) => 
    apiPost(Endpoints.KYC.VERIFY_BANK, data),
    
  saveUpi: (data: any) => 
    apiPost(Endpoints.KYC.SAVE_UPI, data),
    
  saveEmergencyContact: (data: any) =>
    apiPost(Endpoints.KYC.SAVE_EMERGENCY, data),
};
