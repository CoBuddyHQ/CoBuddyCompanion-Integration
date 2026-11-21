import { apiGet } from '../client';
import { updateAdminConfig } from '../../../config/adminValues';
import { updateDynamicKycContent } from '../../../content/applicationKycContent';

export class MasterDataService {
  private static cachedBundle: any = null;

  static async fetchMasterData(): Promise<any> {
    try {
      const res: any = await apiGet('/master-data');
      const bundle = res?.data || res;
      if (bundle && (bundle.cities || bundle.interests)) {
        MasterDataService.cachedBundle = bundle;
        updateAdminConfig(bundle);
        updateDynamicKycContent(bundle);
        return bundle;
      }
    } catch {
      // Graceful fallback
    }
    return MasterDataService.cachedBundle;
  }

  static getCached(): any {
    return MasterDataService.cachedBundle;
  }
}
