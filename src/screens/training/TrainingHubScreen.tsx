/**
 * TrainingHubScreen (CPN-150)
 * Central hub for all companion training modules — progress driven by trainingStore.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useTrainingStore, Lesson } from '../../store/slices/trainingStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

export function TrainingHubScreen(): React.JSX.Element {
  const { t } = useTranslation();


  const navigation = useNavigation<any>();
  const { lessons, completedLessons } = useTrainingStore((s) => s);

  const REQUIRED_IDS = lessons.filter((l) => l.required).map((l) => l.id);
  const TOTAL_REQUIRED = REQUIRED_IDS.length;

  // ── Derived progress ──────────────────────────────────────────────────────
  const completedRequired = completedLessons.filter((id) => REQUIRED_IDS.includes(id)).length;
  const progressPercent = Math.min(completedRequired / TOTAL_REQUIRED * 100, 100);
  const isProUnlocked = completedRequired >= TOTAL_REQUIRED;
  const isLesson1Done = completedLessons.includes('1');
  const isLesson2Done = completedLessons.includes('2');
  const isLesson3Done = completedLessons.includes('3');

  const getLessonStatus = (lesson: Lesson): 'completed' | 'pending' | 'locked' => {
    if (lesson.id === '1') {return isLesson1Done ? 'completed' : 'pending';}
    if (lesson.id === '2') {return isLesson2Done ? 'completed' : 'pending';}
    if (lesson.id === '3') {
      if (!isProUnlocked) {return 'locked';}
      return isLesson3Done ? 'completed' : 'pending';
    }
    return 'pending';
  };

  const STATUS_CONFIG = {
    completed: { icon: 'check-circle', color: colors.safetyGreen, label: t("content.training.TrainingHubScreen.completed") },
    pending: { icon: 'play-circle-outline', color: colors.softWarning, label: t("content.training.TrainingHubScreen.start") },
    locked: { icon: 'lock', color: colors.textMuted, label: t("content.training.TrainingHubScreen.locked") }
  };

  const handleLesson = (lesson: Lesson) => {
    const status = getLessonStatus(lesson);
    if (status === 'locked') {
      Alert.alert(t("alerts.locked"), t("alerts.complete_required_modules_first"));
      return;
    }
    navigation.navigate(Routes.TRAINING_LESSON, { lessonId: lesson.id, title: lesson.title });
  };

  const renderLesson = (lesson: Lesson) => {
    const status = getLessonStatus(lesson);
    const cfg = STATUS_CONFIG[status];
    return (
      <TouchableOpacity accessibilityRole="button" key={lesson.id} style={s.lessonCard}
      onPress={() => handleLesson(lesson)} activeOpacity={0.78}>
        <View style={s.lessonLeft}>
          <Icon name={cfg.icon as any} size={24} color={cfg.color} />
        </View>
        <View style={s.lessonMid}>
          <Text style={[s.lessonTitle, status === 'locked' && s.lessonTitleLocked]}>
            {t(lesson.title)}
          </Text>
          <View style={s.lessonMeta}>
            <Icon name="schedule" size={12} color={colors.textMuted} />
            <Text style={s.lessonDuration}>{lesson.duration}</Text>
          </View>
        </View>
        <Text style={[s.lessonStatus, { color: cfg.color }]}>{t(cfg.label)}</Text>
        {status !== 'locked' &&
        <Icon name="chevron-right" size={18} color={colors.textMuted} />
        }
      </TouchableOpacity>);

  };

  const required = lessons.filter((l) => l.required);
  const optional = lessons.filter((l) => !l.required);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('training.training_resources')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Progress card */}
        <View style={s.progressCard}>
          <View style={s.progressHeader}>
            <Text style={s.progressTitle}> {t('training.your_progress')} </Text>
            <Text style={s.progressCount}>
              {completedRequired}  {t('training.of')} {TOTAL_REQUIRED} {t('common.required')}</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={s.progressSub}>
            {progressPercent === 100 ? t("content.training.TrainingHubScreen.all_required_modules_done_safety_badge_e") :

            `${TOTAL_REQUIRED - completedRequired} module${TOTAL_REQUIRED - completedRequired > 1 ? 's' : ''} remaining for Safety Badge`}
          </Text>
        </View>

        {/* Required modules */}
        <Text style={s.sectionLabel}> {t('training.required_for_safety_badge')} </Text>
        <View style={s.lessonsCard}>
          {required.map((lesson, i) =>
          <View key={lesson.id}>
              {renderLesson(lesson)}
              {i < required.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>

        {/* Optional modules */}
        <Text style={[s.sectionLabel, { marginTop: spacing.md }]}>
           {t('training.pro_tips')} {isProUnlocked ? t("content.training.TrainingHubScreen.unlocked") : t("content.training.TrainingHubScreen.optional_complete_required_first")}
        </Text>
        <View style={s.lessonsCard}>
          {optional.map((lesson, i) =>
          <View key={lesson.id}>
              {renderLesson(lesson)}
              {i < optional.length - 1 && <View style={s.divider} />}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default TrainingHubScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  progressCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', marginBottom: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  progressTitle: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  progressCount: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  progressTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  progressFill: { height: 8, backgroundColor: colors.gold, borderRadius: 4 },
  progressSub: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  lessonsCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  lessonCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  lessonLeft: { width: 32, alignItems: 'center', flexShrink: 0 },
  lessonMid: { flex: 1 },
  lessonTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, marginBottom: 3 },
  lessonTitleLocked: { color: colors.textMuted },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonDuration: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  lessonStatus: { fontFamily: fontFamily.interSemiBold, fontSize: 12, marginRight: 4 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md }
});