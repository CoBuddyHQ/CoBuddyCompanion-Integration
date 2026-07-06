/**
 * TrainingLessonScreen (CPN-151)
 * Displays a training lesson — marks complete via trainingStore on CTA tap.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useTrainingStore } from '../../store/slices/trainingStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// Training content is now loaded from trainingStore

export function TrainingLessonScreen(): React.JSX.Element {
  const { t } = useTranslation();


  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const { lessonId = '1', title = 'Training Lesson' } = route.params ?? {};

  const markLessonCompleted = useTrainingStore((s) => s.markLessonCompleted);
  const { lessons, completedLessons } = useTrainingStore((s) => s);
  const isAlreadyCompleted = completedLessons.includes(lessonId);

  const lesson = lessons.find((l) => l.id === lessonId);
  const content = {
    body: lesson?.body ?? [],
    takeaways: lesson?.takeaways ?? [],
    duration: lesson?.duration ?? '5 min'
  };

  const handleComplete = () => {
    markLessonCompleted(lessonId);
    navigation.replace(Routes.TRAINING_COMPLETED, { lessonId });
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={title} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Already completed banner */}
        {isAlreadyCompleted &&
        <View style={s.completedBanner}>
            <Icon name="check-circle" size={16} color={colors.safetyGreen} />
            <Text style={s.completedBannerText}> {t('training.you_have_already_completed_this_lesson')} </Text>
          </View>
        }

        {/* Video thumbnail */}
        <View style={s.videoPlaceholder}>
          <Icon name="play-circle-filled" size={56} color={colors.gold} />
        </View>

        {/* Lesson title */}
        <Text style={s.lessonTitle}>{title}</Text>

        {/* Time estimate */}
        <View style={s.metaRow}>
          <Icon name="schedule" size={14} color={colors.textMuted} />
          <Text style={s.metaText}>{content.duration}  {t('training.read')} </Text>
        </View>

        <View style={s.divider} />

        {/* Body paragraphs */}
        {content.body.map((para, i) =>
        <Text key={i} style={s.bodyText}>{para}</Text>
        )}

        {/* Key takeaways */}
        <View style={s.takeawaysCard}>
          <Text style={s.takeawaysTitle}> {t('training.key_takeaways')} </Text>
          {content.takeaways.map((item, i) =>
          <View key={i} style={s.takeawayRow}>
              <Icon name="check-circle" size={16} color={colors.safetyGreen} style={{ flexShrink: 0 }} />
              <Text style={s.takeawayText}>{item}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity style={s.btnComplete} onPress={handleComplete} activeOpacity={0.85}>
          <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnCompleteText}>
            {isAlreadyCompleted ? t("content.training.TrainingLessonScreen.completed_view_certificate") : t("content.training.TrainingLessonScreen.mark_as_completed")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default TrainingLessonScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  completedBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)',
    padding: spacing.md, marginBottom: spacing.md },
  completedBannerText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.safetyGreen },
  videoPlaceholder: { height: 200, backgroundColor: '#0D1525', borderRadius: radius.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.15)' },
  lessonTitle: { fontFamily: fontFamily.playfairBold, fontSize: 22, color: colors.gold,
    lineHeight: 30, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  metaText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: spacing.lg },
  bodyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    lineHeight: 22, marginBottom: spacing.md },
  takeawaysCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.15)', padding: spacing.lg, gap: spacing.sm },
  takeawaysTitle: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm },
  takeawayRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  takeawayText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    flex: 1, lineHeight: 20 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnComplete: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnCompleteText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});