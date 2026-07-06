const fs = require('fs');
const path = require('path');

const rootNavPath = path.join(__dirname, 'src', 'navigation', 'RootNavigator.tsx');
let content = fs.readFileSync(rootNavPath, 'utf8');

// Imports to add
const missingImports = `
// Added to fix global stack navigation
import {InSessionChatScreen} from '../screens/sessions/InSessionChatScreen';
import {InSessionCallScreen} from '../screens/sessions/InSessionCallScreen';
import {NavigationToVenueScreen} from '../screens/sessions/NavigationToVenueScreen';
import {VenueMeetingPointDetailScreen} from '../screens/sessions/VenueMeetingPointDetailScreen';
import {SessionPrepChecklistScreen} from '../screens/sessions/SessionPrepChecklistScreen';
import {CustomerProfileSafetySummaryScreen} from '../screens/sessions/CustomerProfileSafetySummaryScreen';
import {PublicVenueRulesScreen} from '../screens/safety/PublicVenueRulesScreen';
import {ReportCustomerScreen} from '../screens/safety/ReportCustomerScreen';
import {BlockCustomerScreen} from '../screens/safety/BlockCustomerScreen';
import {SessionReminderScreen} from '../screens/sessions/SessionReminderScreen';
import {DigitalSessionPassScreen} from '../screens/sessions/DigitalSessionPassScreen';
import {SessionCompleteScreen} from '../screens/sessions/SessionCompleteScreen';
import {PreArrivalScreen} from '../screens/sessions/PreArrivalScreen';
import {CancelSessionRequestScreen} from '../screens/sessions/CancelSessionRequestScreen';
import {ProfilePreviewScreen} from '../screens/profile/ProfilePreviewScreen';
import {EditBasicProfileScreen} from '../screens/profile/EditBasicProfileScreen';
import {EditBioScreen} from '../screens/profile/EditBioScreen';
import {EditCategoriesScreen} from '../screens/profile/EditCategoriesScreen';
import {EditLanguagesScreen} from '../screens/profile/EditLanguagesScreen';
import {EditServiceAreasScreen} from '../screens/profile/EditServiceAreasScreen';
import {EditPricingScreen} from '../screens/profile/EditPricingScreen';
import {GalleryPhotoManagerScreen} from '../screens/profile/GalleryPhotoManagerScreen';
import HomeDashboardScreen from '../screens/dashboard/HomeDashboardScreen';
`;

// Insert imports after the last import statement
const lastImportIndex = content.lastIndexOf('import');
const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
content = content.slice(0, insertIndex) + missingImports + content.slice(insertIndex);

// Screens to add
const missingScreens = `
      {/* ── Screens added to fix global stack back behavior ── */}
      <Stack.Screen name={Routes.IN_SESSION_CHAT} component={InSessionChatScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.IN_SESSION_CALL} component={InSessionCallScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.NAVIGATION_TO_VENUE} component={NavigationToVenueScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.VENUE_MEETING_POINT_DETAIL} component={VenueMeetingPointDetailScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.SESSION_PREP_CHECKLIST} component={SessionPrepChecklistScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.CUSTOMER_PROFILE_SAFETY_SUMMARY} component={CustomerProfileSafetySummaryScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.PUBLIC_VENUE_RULES} component={PublicVenueRulesScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.REPORT_CUSTOMER} component={ReportCustomerScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.BLOCK_CUSTOMER} component={BlockCustomerScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.SESSION_REMINDER} component={SessionReminderScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.DIGITAL_SESSION_PASS} component={DigitalSessionPassScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.SESSION_COMPLETE} component={SessionCompleteScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.PRE_ARRIVAL} component={PreArrivalScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.CANCEL_SESSION_REQUEST} component={CancelSessionRequestScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.PROFILE_PREVIEW} component={ProfilePreviewScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_BASIC_PROFILE} component={EditBasicProfileScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_BIO} component={EditBioScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_CATEGORIES} component={EditCategoriesScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_LANGUAGES} component={EditLanguagesScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_SERVICE_AREAS} component={EditServiceAreasScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.EDIT_PRICING} component={EditPricingScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.GALLERY_PHOTO_MANAGER} component={GalleryPhotoManagerScreen} options={{headerShown: false}} />
      <Stack.Screen name={Routes.HOME_DASHBOARD} component={HomeDashboardScreen} options={{headerShown: false}} />
`;

// Insert screens before </Stack.Navigator>
content = content.replace('    </Stack.Navigator>', missingScreens + '    </Stack.Navigator>');

fs.writeFileSync(rootNavPath, content, 'utf8');
console.log('Successfully injected screens into RootNavigator.tsx');
