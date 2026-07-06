/**
 * TrainingCompletedScreen (CPN-152)
 * Celebration screen shown after a lesson is marked complete.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

export function TrainingCompletedScreen(): React.JSX.Element {
  const { t } = useTranslation();


  const navigation = useNavigation<any>();

  const scale = useRef(new Animated.Value(0.5)).current;
  const opac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
    Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
    Animated.timing(opac, { toValue: 1, duration: 600, useNativeDriver: true })]
    ).start();
  }, [scale, opac]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <Animated.View style={[s.body, { opacity: opac }]}>

        {/* Icon */}
        <Animated.View style={[s.iconWrap, { transform: [{ scale }] }]}>
          <Icon name="workspace-premium" size={64} color={colors.gold} />
        </Animated.View>

        {/* Title */}
        <Text style={s.title}> {t('training.lesson_completed')} </Text>

        {/* Subtitle */}
        <Text style={s.subtitle}>
           {t('training.great_job_you_are_one_step_closer_to_earning_your_safety_badge')} </Text>

        {/* Confetti-like dots row */}
        <View style={s.dotsRow}>
          {['#D6A84F', '#6DD6A5', '#D6A84F', '#6DD6A5', '#D6A84F'].map((c, i) =>
          <View key={i} style={[s.dot, { backgroundColor: c }]} />
          )}
        </View>
      </Animated.View>

      <View style={s.bar}>
        <TouchableOpacity style={s.btnHub}
        onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Icon name="school" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnHubText}> {t('training.return_to_hub')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default TrainingCompletedScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  iconWrap: { width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 2, borderColor: 'rgba(214,168,79,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: fontFamily.playfairBold, fontSize: 32, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 23, marginBottom: spacing.xl },
  dotsRow: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnHub: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnHubText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});