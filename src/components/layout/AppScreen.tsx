/**
 * CoBuddy Companion App — AppScreen Component
 * Base layout wrapper for all screens.
 * Provides: safe area, scroll/flat, root background, keyboard handling.
 */

import React, {ReactNode} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface AppScreenProps {
  children: ReactNode;
  /** Whether to wrap in a ScrollView (default: true) */
  scrollable?: boolean;
  /** Whether to add horizontal padding (default: true) */
  padded?: boolean;
  /** Override background color */
  backgroundColor?: string;
  /** Custom style for the content container */
  contentStyle?: ViewStyle;
  /** Enable pull-to-refresh */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Safe area edges to apply (default: all) */
  edges?: Edge[];
  /** Whether to use keyboard avoiding view */
  avoidKeyboard?: boolean;
}

const AppScreen: React.FC<AppScreenProps> = ({
  children,
  scrollable = true,
  padded = true,
  backgroundColor = colors.rootBg,
  contentStyle,
  onRefresh,
  refreshing = false,
  edges = ['top', 'left', 'right', 'bottom'],
  avoidKeyboard = false,
}) => {
  const bg = {backgroundColor};

  const inner = scrollable ? (
    <ScrollView
      style={[styles.scroll, bg]}
      contentContainerStyle={[
        styles.scrollContent,
        padded && styles.padded,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
            colors={[colors.gold]}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[styles.fixed, bg, padded && styles.padded, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, bg]} edges={edges}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {inner}
        </KeyboardAvoidingView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.screenBottom,
  },
  fixed: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.screenTop,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});

export default AppScreen;
