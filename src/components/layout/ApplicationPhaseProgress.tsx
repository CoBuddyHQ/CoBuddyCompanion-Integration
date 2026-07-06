import i18next from "i18next"; /**
 * ApplicationPhaseProgress
 * Shows the active application phase below the top bar on CPN-033 to CPN-044.
 *
 * Displays phase name as a gold caps chip. Does NOT show step counters.
 * Active phase for CPN-033–044: "Financial Setup"
 *
 * Usage:
 *   <ApplicationPhaseProgress activePhase="financial" />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../theme/colors';
import { textStyles } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export type ApplicationPhase =
'identity' |
'safety' |
'financial' |
'profile' |
'submit';

interface ApplicationPhaseProgressProps {
  activePhase: ApplicationPhase;
}

const PHASE_CONFIG: Record<
  ApplicationPhase,
  {label: string;icon: string;}> =
{
  identity: { label: i18next.t("content.layout.ApplicationPhaseProgress.identity"), icon: 'badge' },
  safety: { label: i18next.t("content.layout.ApplicationPhaseProgress.safety"), icon: 'shield' },
  financial: { label: i18next.t("content.layout.ApplicationPhaseProgress.financial_setup"), icon: 'account-balance-wallet' },
  profile: { label: i18next.t("content.layout.ApplicationPhaseProgress.profile"), icon: 'person' },
  submit: { label: i18next.t("content.layout.ApplicationPhaseProgress.submit"), icon: 'check-circle' }
};

const ApplicationPhaseProgress: React.FC<ApplicationPhaseProgressProps> = ({
  activePhase
}) => {
  const config = PHASE_CONFIG[activePhase];
  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <Icon name={config.icon} size={12} color={colors.gold} />
        <Text style={styles.chipText}>{config.label.toUpperCase()}</Text>
      </View>
    </View>);

};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.rootBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSurface,
    alignItems: 'flex-start'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipText: {
    ...textStyles.capsSm,
    color: colors.gold
  }
});

export default ApplicationPhaseProgress;