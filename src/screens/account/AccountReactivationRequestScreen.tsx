/**
 * AccountReactivationRequestScreen (CPN-199)
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function AccountReactivationRequestScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) {Alert.alert(t('account.empty_appeal'), t('account.please_type_your_message_first'));return;}
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t('account.appeal_sent'), t('account.we_will_review_and_email_you_within_3_business_days'),
      [{ text: t('account.ok'), onPress: () => navigation.canGoBack() ? navigation.goBack() : undefined }]);
    }, 800);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('account.submit_appeal')} showBack onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={s.titleBlock}>
            <Icon name="send" size={28} color={colors.gold} />
            <Text style={s.title}> {t('account.request_reactivation')} </Text>
            <Text style={s.subtitle}> {t('account.our_team_reviews_all_appeals_manually_and_responds_within')} <Text style={s.bold}> {t('account.3_business_days')} </Text>.</Text>
          </View>
          <View style={s.tipsCard}>
            <Text style={s.tipsTitle}> {t('account.tips_for_a_strong_appeal')} </Text>
            {[t('account.acknowledge_the_violation_clearly') as string, t('account.explain_any_misunderstanding') as string, t('account.commit_to_following_community_guidelines') as string].map((tip) =>
            <View key={tip} style={s.tipRow}>
                <Icon name="check-circle-outline" size={14} color={colors.safetyGreen} />
                <Text style={s.tipText}>{tip}</Text>
              </View>
            )}
          </View>
          <Text style={s.inputLabel}> {t('account.your_message')} </Text>
          <View style={s.inputCard}>
            <TextInput style={s.input} value={message} onChangeText={(t) => setMessage(t.slice(0, 800))}
            placeholder={t('account.type_your_appeal_message_here')} placeholderTextColor={colors.textMuted}
            multiline textAlignVertical="top" selectionColor={colors.gold} />
            <Text style={s.charCount}>{message.length}/800</Text>
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={s.footer}>
        <TouchableOpacity style={[s.submitBtn, (!message.trim() || loading) && s.submitBtnDisabled]}
        onPress={handleSubmit} disabled={!message.trim() || loading} activeOpacity={0.85}>
          <Icon name="send" size={17} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.submitBtnText}>{loading ? t('account.submitting') : t('account.submit_appeal_btn')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default AccountReactivationRequestScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg }, content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  titleBlock: { alignItems: 'center', marginBottom: spacing.xl, gap: spacing.sm },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
  bold: { fontFamily: fontFamily.interBold, color: colors.gold },
  tipsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: spacing.lg, marginBottom: spacing.lg },
  tipsTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: 4 },
  tipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1, lineHeight: 19 },
  inputLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  inputCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  input: { padding: spacing.lg, minHeight: 140, fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, lineHeight: 22 },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, textAlign: 'right', padding: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  submitBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.gold, borderRadius: radius.md },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});