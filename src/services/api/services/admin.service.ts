import { apiGet } from '../client';
import { Endpoints } from '../endpoints';
import { AdminConfig } from '../../../config/adminValues';

export const MasterDataService = {
  // TODO: Implement actual API calls once endpoints are available on backend
  getLanguages: async () => {
    // return apiGet(Endpoints.MASTER_DATA.LANGUAGES);
    return []; // Stub
  },
  getCities: async () => {
    // return apiGet(Endpoints.MASTER_DATA.CITIES);
    return []; // Stub
  },
  getCategories: async () => {
    // return apiGet(Endpoints.MASTER_DATA.CATEGORIES);
    return []; // Stub
  },
  getInterests: async () => {
    // return apiGet(Endpoints.MASTER_DATA.INTERESTS);
    return []; // Stub
  },
};

export const ConfigService = {
  getAllConfig: async () => {
    // return apiGet(Endpoints.CONFIG.GET_ALL);
    return AdminConfig; // Return hardcoded config for now
  },
};
