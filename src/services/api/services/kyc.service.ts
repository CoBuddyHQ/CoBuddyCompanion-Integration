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
    
  savePan: (data: any) => {
    const rawPan = data?.panNumber || data?.maskedPan || '';
    const maskedPan = data?.maskedPan || (rawPan.length >= 6 ? `${rawPan.slice(0, 4)}****${rawPan.slice(-2)}` : rawPan);
    return apiPost(Endpoints.KYC.SAVE_PAN, { ...data, maskedPan });
  },

  saveBank: (data: any) => {
    const rawAcc = data?.accountNumber || data?.maskedAccount || '';
    const maskedAccount = data?.maskedAccount || (rawAcc.length >= 4 ? `••••${rawAcc.slice(-4)}` : rawAcc || '••••');
    return apiPost(Endpoints.KYC.SAVE_BANK, { ...data, maskedAccount });
  },

  verifyBank: (data: any) => 
    apiPost(Endpoints.KYC.VERIFY_BANK, data),

  saveUpi: (data: any) => {
    const rawUpi = data?.upiId || data?.maskedUpi || '';
    const maskedUpi = data?.maskedUpi || (rawUpi.includes('@') ? `${rawUpi.slice(0, 2)}••••@${rawUpi.split('@')[1]}` : rawUpi);
    return apiPost(Endpoints.KYC.SAVE_UPI, { ...data, maskedUpi });
  },

  saveEmergencyContact: (data: any) =>
    apiPost(Endpoints.KYC.SAVE_EMERGENCY, data),

  acceptTerms: (): Promise<any> =>
    apiPost(Endpoints.KYC.ACCEPT_TERMS, {}),
};
