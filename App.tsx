import React, { useEffect } from 'react';
import './src/i18n';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { useAuthStore } from './src/store/slices/authStore';
import { useNotificationStore } from './src/store/slices/notificationStore';
import { socketService } from './src/services/api/services/socket.service';
import { firebaseService } from './src/services/firebase/firebase.service';
import { FlowTracker } from './src/services/flowTracker';
import { initAppStateSync } from './src/services/serverState';

export const navigationRef = createNavigationContainerRef<any>();

const CoBuddyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.gold,
    background: colors.rootBg,
    card: colors.secondaryBg,
    text: colors.textPrimary,
    border: colors.borderSurface,
    notification: colors.softWarning,
  },
};

const App: React.FC = () => {
  const restoreAuth = useAuthStore((s) => s.restoreAuth);
  const authStatus = useAuthStore((s) => s.authStatus);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // ── Restore auth on mount & start AppState sync ───────────────────────────
  useEffect(() => {
    restoreAuth();
    const cleanup = initAppStateSync(async () => {
      if (useAuthStore.getState().authStatus !== 'unauthenticated') {
        await useAuthStore.getState().restoreAuth();
      }
    });
    return cleanup;
  }, []);

  // ── Wire Socket.IO & Firebase FCM after auth ──────────────────────────────
  useEffect(() => {
    if (authStatus === 'active' || authStatus === 'applying' || authStatus === 'pending_verification') {
      // Connect global app socket for booking request alerts & notifications
      socketService.connectApp();

      // Initialize Firebase FCM — registers device token with backend
      firebaseService.initialize((notif) => {
        // Foreground push notification received — add to in-app store
        if (notif.title) {
          addNotification({
            notificationId: `fcm-${Date.now()}`,
            category: 'system',
            title: notif.title,
            body: notif.body ?? '',
            isRead: false,
            createdAt: new Date().toISOString(),
          } as any);
        }
      }).catch(() => {});
    } else if (authStatus === 'unauthenticated') {
      // Clean up on logout
      socketService.disconnectAll();
      firebaseService.cleanup();
    }
  }, [authStatus]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.rootBg}
          translucent={false}
        />
        <NavigationContainer
          ref={navigationRef}
          theme={CoBuddyTheme}
          onStateChange={() => {
            if (navigationRef.isReady()) {
              const currentRoute = navigationRef.getCurrentRoute();
              if (currentRoute && currentRoute.name) {
                FlowTracker.saveActiveScreen(currentRoute.name);
              }
            }
          }}
        >
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
