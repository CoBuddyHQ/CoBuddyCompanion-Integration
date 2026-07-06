/**
 * TrustScoreImprovementTasksScreen (CPN-160)
 */
import React from 'react';
import {View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import {useTrustStore} from '../../store/slices/trustStore';
import {useSessionStore} from '../../store/slices/sessionStore';
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  icon: string;
  label: string;
  pts: string;
  sub?: string;
  progress?: {done: number; total: number};
  completed: boolean;
  onPress: () => void;
}

export function TrustScoreImprovementTasksScreen(): React.JSX.Element {
    const { t } = useTranslation();
  const navigation = useNavigation<any>();  
  const {completedTasks, completeTask} = useTrustStore(s => s);
  const completedSessions = useSessionStore(s => s.sessionHistory.filter((ses: any) => ses.status === 'completed').length);

  const isLinkedInDone = completedTasks.includes('task_linkedin');
  const isQuizDone     = completedTasks.includes('task_quiz');
  const isSessionsDone = completedTasks.includes('task_sessions') || completedSessions >= 10;

  const pendingPts = (isLinkedInDone ? 0 : 5) + (isQuizDone ? 0 : 5) + (isSessionsDone ? 0 : 10);

  const TASKS: Task[] = [
    {
      id: 'task_linkedin',
      icon: 'link',
      label: 'Link LinkedIn Account',
      pts: '+5 pts',
      sub: 'Verifies your professional identity',
      completed: isLinkedInDone,
      onPress: () => {
        if (isLinkedInDone) {return;}
        completeTask('task_linkedin', 5);
        Alert.alert('LinkedIn Linked', 'Your LinkedIn profile has been connected and +5 pts added!');
      },
    },
    {
      id: 'task_quiz',
      icon: 'quiz',
      label: 'Take Advanced Safety Quiz',
      pts: '+5 pts',
      sub: 'Demonstrate your safety knowledge',
      completed: isQuizDone,
      onPress: () => {
        if (isQuizDone) {return;}
        completeTask('task_quiz', 5);
        navigation.navigate(Routes.SAFETY_QUIZ);
      },
    },
    {
      id: 'task_sessions',
      icon: 'event-available',
      label: 'Complete 10 sessions without cancellations',
      pts: '+10 pts',
      progress: {done: Math.min(completedSessions, 10), total: 10},
      completed: isSessionsDone,
      onPress: () => {
        if (!isSessionsDone && completedSessions >= 10) {
          completeTask('task_sessions', 10);
        }
      },
    },
  ];

  const renderTask = ({item}: {item: Task}) => {
    const hasProgress = !!item.progress;
    const pct = hasProgress ? (item.progress!.done / item.progress!.total) * 100 : 0;
    const isDone = item.completed;

    return (
      <TouchableOpacity
        style={[s.taskCard, hasProgress && s.taskCardProgress, isDone && s.taskCardDone]}
        onPress={item.onPress} activeOpacity={hasProgress ? 1 : 0.8}
        disabled={isDone}>
        <View style={s.taskTop}>
          <View style={[s.taskIconWrap, isDone && s.taskIconWrapDone]}>
            <Icon name={isDone ? 'check-circle' : item.icon as any}
              size={22} color={isDone ? colors.safetyGreen : colors.gold} />
          </View>
          <View style={s.taskText}>
            <Text style={[s.taskLabel, isDone && s.taskLabelDone]}>{item.label}</Text>
            {item.sub && <Text style={s.taskSub}>{isDone ? 'Completed ✓' : item.sub}</Text>}
          </View>
          <View style={[s.ptsBadge, isDone && s.ptsBadgeDone]}>
            <Text style={[s.ptsText, isDone && s.ptsTextDone]}>{item.pts}</Text>
          </View>
        </View>

        {hasProgress && (
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, {width: `${pct}%` as any}]} />
            </View>
            <Text style={s.progressLabel}>
              {item.progress!.done}/{item.progress!.total}  {t('profile.sessions')} </Text>
          </View>
        )}

        {!hasProgress && !isDone && (
          <View style={s.taskAction}>
            <Text style={s.taskActionText}> {t('profile.tap_to_complete')} </Text>
            <Icon name="arrow-forward" size={14} color={colors.gold} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('profile.improve_your_score')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <FlatList
        data={TASKS}
        keyExtractor={t => t.id}
        renderItem={renderTask}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={s.subtitle}> {t('profile.complete_these_tasks_to_reach_100_points')} </Text>
            <View style={s.potentialCard}>
              <Icon name="trending-up" size={18} color={colors.gold} />
              <Text style={s.potentialText}> {t('profile.you_can_earn_up_to')} <Text style={s.potentialBold}>+{pendingPts}  {t('profile.more_points')} </Text></Text>
            </View>
            <Text style={s.sectionLabel}> {t('profile.pending_tasks')} </Text>
          </View>
        }
        ListFooterComponent={<View style={{height: 40}} />}
      />
    </SafeAreaView>
  );
}
export default TrustScoreImprovementTasksScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  list: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  subtitle: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginBottom: spacing.md, lineHeight: 19},
  potentialCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)', padding: spacing.md, marginBottom: spacing.md},
  potentialText: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary},
  potentialBold: {fontFamily: fontFamily.interBold, color: colors.gold},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  taskCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm},
  taskCardProgress: {borderColor: 'rgba(214,168,79,0.20)'},
  taskCardDone: {borderColor: 'rgba(109,214,165,0.25)', backgroundColor: 'rgba(109,214,165,0.04)'},
  taskTop: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: 8},
  taskIconWrap: {width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  taskIconWrapDone: {backgroundColor: 'rgba(109,214,165,0.10)', borderColor: 'rgba(109,214,165,0.30)'},
  taskText: {flex: 1},
  taskLabel: {fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: 3, lineHeight: 20},
  taskLabelDone: {color: colors.textMuted},
  taskSub: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted},
  ptsBadge: {backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0},
  ptsBadgeDone: {backgroundColor: 'rgba(109,214,165,0.18)', borderColor: 'rgba(109,214,165,0.40)'},
  ptsText: {fontFamily: fontFamily.interBold, fontSize: 12, color: colors.safetyGreen},
  ptsTextDone: {color: colors.safetyGreen},
  progressWrap: {gap: 6},
  progressTrack: {height: 6, backgroundColor: colors.elevatedSurface, borderRadius: 3, overflow: 'hidden'},
  progressFill: {height: '100%', backgroundColor: colors.gold, borderRadius: 3},
  progressLabel: {fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted},
  taskAction: {flexDirection: 'row', alignItems: 'center', gap: 4},
  taskActionText: {fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold},
});
