# CoBuddy Companion App - Full Architecture & Logic Report

This report contains all the backend, state, navigation, and logic files that power the app behind the scenes.

## Overview
- **Total Architectural Files:** 70

### __Tests__
- __tests__/missingRequirementFlow.test.ts

### Config
- config/devQaPrefill.ts

### Content
- content/applicationKycContent.ts
- content/authOnboardingContent.ts
- content/canonicalContentRules.ts
- content/screenContentFixes.ts

### I18n
- i18n/locales/en.json
- i18n/index.ts

### Navigation
- navigation/ApplicationNavigator.tsx
- navigation/AuthNavigator.tsx
- navigation/stacks/AvailabilityStack.tsx
- navigation/CompanionTabNavigator.tsx
- navigation/stacks/DashboardStack.tsx
- navigation/stacks/EarningsStack.tsx
- navigation/missingRequirementNavigation.ts
- navigation/navigatorOptions.ts
- navigation/OnboardingNavigator.tsx
- navigation/stacks/ProfileStack.tsx
- navigation/stacks/RequestsStack.tsx
- navigation/stacks/ReviewsStack.tsx
- navigation/RootNavigator.tsx
- navigation/routes.ts
- navigation/stacks/SafetyStack.tsx
- navigation/stacks/SessionsStack.tsx
- navigation/stacks/SupportStack.tsx
- navigation/stacks/TrainingStack.tsx
- navigation/VerificationNavigator.tsx

### Services
- services/api/client.ts
- services/api/endpoints.ts
- services/mock/mockEarnings.ts
- services/mock/mockNotifications.ts
- services/mock/mockProfile.ts
- services/mock/mockRequests.ts
- services/mock/mockReviews.ts
- services/mock/mockSafety.ts
- services/mock/mockSessions.ts
- services/mock/mockSupport.ts

### Store
- store/selectors/applicationReadinessSelector.ts
- store/slices/applicationStore.ts
- store/slices/authStore.ts
- store/slices/availabilityStore.ts
- store/slices/earningsStore.ts
- store/index.ts
- store/slices/notificationStore.ts
- store/slices/profileStore.ts
- store/slices/requestStore.ts
- store/slices/reviewsStore.ts
- store/slices/safetyStore.ts
- store/slices/sessionStore.ts
- store/slices/settingsStore.ts
- store/types/store.types.ts
- store/slices/supportStore.ts
- store/slices/trainingStore.ts
- store/slices/trustStore.ts
- store/slices/uiStore.ts

### Theme
- theme/colors.ts
- theme/index.ts
- theme/radius.ts
- theme/shadows.ts
- theme/spacing.ts
- theme/typography.ts

### Types
- types/i18next.d.ts
- types/navigation.types.ts

### Utils
- utils/currency.ts
- utils/datetime.ts
- utils/errorHandler.ts
- utils/index.ts
- utils/logger.ts
- utils/masking.ts
- utils/validators.ts


