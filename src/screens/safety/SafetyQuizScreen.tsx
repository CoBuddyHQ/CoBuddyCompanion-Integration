import i18next from "i18next"; /**
* SafetyQuizScreen (CPN-127)
* 5-question quiz to earn Safety Certified badge.
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

interface Question {q: string;options: string[];correct: number;}

const QUESTIONS: Question[] = [
{
  q: 'What should you do if a customer asks you to go to a private location?',
  options: ['Politely decline and suggest a public venue', 'Go along if they seem trustworthy', 'Ask CoBuddy support first', 'End the session immediately'],
  correct: 0
},
{
  q: 'How long should you wait before reporting a customer no-show?',
  options: ['5 minutes', '15 minutes', '30 minutes', '1 hour'],
  correct: 1
},
{
  q: 'What should you do if you feel uncomfortable during a session?',
  options: ['Continue to be polite and stay', 'Trust your instincts and end the session', 'Wait for the session to finish', 'Call a friend'],
  correct: 1
},
{
  q: 'Which of these is an approved venue for CoBuddy sessions?',
  options: ['Customer\'s home', 'Hotel room', 'Public café', 'Private office'],
  correct: 2
},
{
  q: 'What does the Safety Timer do if you don\'t check in before it ends?',
  options: ['Ends your session', 'Alerts your emergency contacts', 'Calls the police', 'Logs you out of the app'],
  correct: 1
}];


const OPTION_LETTERS = ["A", "B", "C", "D"] as any[];

export function SafetyQuizScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[index];
  const progress = (index + 1) / QUESTIONS.length;

  const handleSelect = (i: number) => {
    if (selected !== null) {return;}
    setSelected(i);
    if (i === q.correct) {setScore((s) => s + 1);}
  };

  const handleNext = () => {
    if (index < QUESTIONS.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const certified = score >= 4;

  if (finished) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
        <AppHeader title={t('safety.safety_quiz')} showBack onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
        <View style={s.resultBody}>
          <View style={[s.resultIcon, certified ? s.resultIconGold : s.resultIconAmber]}>
            <Icon name={certified ? 'emoji-events' : 'replay'} size={48} color={certified ? colors.gold : colors.softWarning} />
          </View>
          <Text style={[s.resultTitle, certified ? { color: colors.gold } : { color: colors.softWarning }]}>
            {certified ? `${score}/5 Correct — Safety Certified! 🏆` : `${score}/5 — Try Again`}
          </Text>
          <Text style={s.resultSub}>
            {certified ? t("content.safety.SafetyQuizScreen.congratulations_your_safety_certified_ba") : t("content.safety.SafetyQuizScreen.you_need_4_or_more_correct_answers_to_ea")

            }
          </Text>
          <TouchableOpacity style={[s.btn, { marginTop: spacing.xl }]}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} activeOpacity={0.85}>
            <Text style={s.btnText}>{t('common.done')}</Text>
          </TouchableOpacity>
          {!certified &&
          <TouchableOpacity style={s.retryBtn}
          onPress={() => {setIndex(0);setSelected(null);setScore(0);setFinished(false);}}
          activeOpacity={0.7}>
              <Text style={s.retryBtnText}> {t('safety.retry_quiz')} </Text>
            </TouchableOpacity>
          }
        </View>
      </SafeAreaView>);

  }

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.safety_quiz')} showBack onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={s.subtitle}> {t('safety.complete_this_quiz_to_unlock_your_safety_certified_badge')} </Text>

        {/* Progress */}
        <View style={s.progressWrap}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}> {t('safety.question')} {index + 1}  {t('safety.of')} {QUESTIONS.length}</Text>
            <Text style={s.progressPct}>{Math.round(progress * 100)}{t("content.safety.SafetyQuizScreen.text")}</Text>
          </View>
          <View style={s.progressBarBg}>
            <View style={[s.progressBarFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>

        {/* Question card */}
        <View style={s.questionCard}>
          <Text style={s.questionText}>{q.q}</Text>
        </View>

        {/* Options */}
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correct;
          const showResult = selected !== null;
          let borderColor: string = colors.border;
          let bgColor: string = colors.cardSurface;
          let textColor: string = colors.textPrimary;
          if (showResult && isCorrect) {borderColor = colors.safetyGreen;bgColor = 'rgba(109,214,165,0.10)';textColor = colors.safetyGreen;} else
          if (showResult && isSelected && !isCorrect) {borderColor = colors.softWarning;bgColor = 'rgba(200,40,40,0.08)';textColor = colors.softWarning;}
          return (
            <TouchableOpacity key={i}
            style={[s.option, { borderColor, backgroundColor: bgColor }]}
            onPress={() => handleSelect(i)} activeOpacity={selected !== null ? 1 : 0.75}>
              <View style={[s.optionLetter, { borderColor }]}>
                <Text style={[s.optionLetterText, { color: textColor }]}>{OPTION_LETTERS[i]}</Text>
              </View>
              <Text style={[s.optionText, { color: textColor }]}>{opt}</Text>
              {showResult && isCorrect && <Icon name="check-circle" size={18} color={colors.safetyGreen} />}
              {showResult && isSelected && !isCorrect && <Icon name="cancel" size={18} color={colors.softWarning} />}
            </TouchableOpacity>);

        })}

        <View style={{ height: 80 }} />
      </ScrollView>

      {selected !== null &&
      <View style={s.bar}>
          <TouchableOpacity style={s.btn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={s.btnText}>{index < QUESTIONS.length - 1 ? t("content.safety.SafetyQuizScreen.next_question") : t("content.safety.SafetyQuizScreen.see_results")}</Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>);

}
export default SafetyQuizScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 19 },
  progressWrap: { backgroundColor: colors.cardSurface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressLabel: { fontFamily: fontFamily.interMedium, fontSize: 13, color: colors.textSecondary },
  progressPct: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  progressBarBg: { height: 6, backgroundColor: colors.elevatedSurface, borderRadius: radius.full, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },
  questionCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)', marginBottom: spacing.md },
  questionText: { fontFamily: fontFamily.playfairBold, fontSize: 18, color: colors.textPrimary, lineHeight: 27 },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.cardSurface, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  optionLetter: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionLetterText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textMuted },
  optionText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btn: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.gold },
  btnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  resultBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  resultIcon: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  resultIconGold: { backgroundColor: 'rgba(214,168,79,0.12)', borderWidth: 2, borderColor: 'rgba(214,168,79,0.30)' },
  resultIconAmber: { backgroundColor: 'rgba(255,171,64,0.10)', borderWidth: 2, borderColor: 'rgba(255,171,64,0.28)' },
  resultTitle: { fontFamily: fontFamily.playfairBold, fontSize: 22, textAlign: 'center', marginBottom: spacing.sm },
  resultSub: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  retryBtn: { marginTop: spacing.md, paddingVertical: spacing.sm },
  retryBtnText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textMuted }
});