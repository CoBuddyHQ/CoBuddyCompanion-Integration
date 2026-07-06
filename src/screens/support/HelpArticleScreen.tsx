/**
 * HelpArticleScreen (CPN-171)
 * Display a help article with feedback actions.
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useSupportStore } from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

export function HelpArticleScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const { articleId = '', title = 'Help Article' } = route.params ?? {};

  const articles = useSupportStore((s) => s.articles);
  const article = articles.find((a) => a.id === articleId);

  const content = {
    category: article?.category ?? 'General',
    body: article?.body ?? ['Content unavailable'],
    updatedDate: article?.updatedDate ?? 'Recently'
  };

  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (val: 'up' | 'down') => {
    setFeedback(val);
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={title} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>{title}</Text>

        <View style={s.metaRow}>
          <View style={s.categoryPill}>
            <Text style={s.categoryPillText}>{content.category}</Text>
          </View>
          <Text style={s.updatedText}> {t('support.updated')} {content.updatedDate}</Text>
        </View>

        <View style={s.divider} />

        {content.body.map((para, i) =>
        <Text key={i} style={s.bodyText}>{para}</Text>
        )}

        {/* Feedback */}
        <View style={s.feedbackCard}>
          <Text style={s.feedbackLabel}> {t('support.was_this_helpful')} </Text>
          <View style={s.feedbackBtns}>
            <TouchableOpacity style={[s.feedbackBtn, feedback === 'up' && s.feedbackBtnUp]}
            onPress={() => handleFeedback('up')} activeOpacity={0.75}>
              <Icon name="thumb-up" size={20} color={feedback === 'up' ? colors.safetyGreen : colors.textMuted} />
              <Text style={[s.feedbackBtnText, feedback === 'up' && { color: colors.safetyGreen }]}>{t('common.yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.feedbackBtn, feedback === 'down' && s.feedbackBtnDown]}
            onPress={() => handleFeedback('down')} activeOpacity={0.75}>
              <Icon name="thumb-down" size={20} color={feedback === 'down' ? '#E74C3C' : colors.textMuted} />
              <Text style={[s.feedbackBtnText, feedback === 'down' && { color: '#E74C3C' }]}>{t('common.no')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity style={s.btnContact}
        onPress={() => navigation.navigate(Routes.CREATE_SUPPORT_TICKET)} activeOpacity={0.85}>
          <Text style={s.btnContactText}> {t('support.contact_support')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default HelpArticleScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.gold, lineHeight: 30, marginBottom: spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  categoryPill: { backgroundColor: 'rgba(214,168,79,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', paddingHorizontal: 10, paddingVertical: 4 },
  categoryPillText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.gold },
  updatedText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.lg },
  bodyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    lineHeight: 22, marginBottom: spacing.md },
  feedbackCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  feedbackLabel: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  feedbackBtns: { flexDirection: 'row', gap: spacing.md },
  feedbackBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  feedbackBtnUp: { borderColor: 'rgba(109,214,165,0.35)', backgroundColor: 'rgba(109,214,165,0.08)' },
  feedbackBtnDown: { borderColor: 'rgba(231,76,60,0.35)', backgroundColor: 'rgba(231,76,60,0.08)' },
  feedbackBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnContact: { height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnContactText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});