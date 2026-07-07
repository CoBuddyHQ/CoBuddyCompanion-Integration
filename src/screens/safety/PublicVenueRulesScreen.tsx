/**
 * PublicVenueRulesScreen (CPN-126)
 * Approved/disallowed venue types and FAQ accordion.
 */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, LayoutAnimation} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import { useTranslation } from "react-i18next";

const APPROVED = [
  {emoji: '☕', name: 'Cafes & Coffee Shops'},
  {emoji: '🍽', name: 'Restaurants'},
  {emoji: '🏛', name: 'Museums & Galleries'},
  {emoji: '🌳', name: 'Public Parks'},
  {emoji: '🛍', name: 'Shopping Malls'},
  {emoji: '🎬', name: 'Cinemas & Event Venues'},
];

const NOT_ALLOWED = [
  'Private residences',
  'Hotels or private rooms',
  'Isolated or poorly lit areas',
];

const FAQS = [
  {
    q: 'What if the customer suggests going to a private place?',
    a: 'Politely decline and suggest an approved public venue instead. If they insist, end the session and use the in-app report feature.',
  },
  {
    q: 'What if I feel unsafe at the venue?',
    a: "Trust your instincts. You can end the session at any time using the 'End Session Early' option. Tap SOS immediately in any emergency.",
  },
  {
    q: 'Can I suggest a different venue?',
    a: 'Yes! You can message the customer through the app before the session to agree on an approved venue that works for both of you.',
  },
];

const FAQItem: React.FC<{item: {q: string; a: string}}> = ({item}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(v => !v);
  };

  return (
    <TouchableOpacity accessibilityRole="button" style={s.faqItem} onPress={toggle} activeOpacity={0.75}>
      <View style={s.faqHeader}>
        <Text style={s.faqQ}>{item.q}</Text>
        <Icon name={open ? 'expand-less' : 'expand-more'} size={20} color={colors.textMuted} />
      </View>
      {open && <Text style={s.faqA}>{item.a}</Text>}
    </TouchableOpacity>
  );
};

export function PublicVenueRulesScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.venue_rules')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Intro */}
        <View style={s.introCard}>
          <Icon name="place" size={18} color={colors.gold} />
          <Text style={s.introText}>
             {t('safety.all_cobuddy_sessions_must_take_place_at')} <Text style={s.introBold}> {t('safety.approved_public_venues')} </Text>  {t('safety.only')} </Text>
        </View>

        {/* Approved */}
        <Text style={s.sectionTitle}> {t('safety.approved_venue_types')} </Text>
        <View style={s.approvedGrid}>
          {APPROVED.map(v => (
            <View key={v.name} style={s.approvedTile}>
              <Text style={s.approvedEmoji}>{v.emoji}</Text>
              <Text style={s.approvedName}>{v.name}</Text>
            </View>
          ))}
        </View>

        {/* Not allowed */}
        <Text style={[s.sectionTitle, {marginTop: spacing.lg}]}> {t('safety.not_allowed')} </Text>
        {NOT_ALLOWED.map((item, idx) => (
          <View key={idx} style={s.notAllowedCard}>
            <Icon name="cancel" size={16} color={colors.softWarning} />
            <Text style={s.notAllowedText}>{item}</Text>
          </View>
        ))}

        {/* FAQ */}
        <Text style={[s.sectionTitle, {marginTop: spacing.lg}]}> {t('safety.frequently_asked')} </Text>
        <View style={s.faqCard}>
          {FAQS.map((f, i) => (
            <View key={f.q}>
              <FAQItem item={f} />
              {i < FAQS.length - 1 && <View style={s.faqDivider} />}
            </View>
          ))}
        </View>

        <View style={{height: 48}} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default PublicVenueRulesScreen;

const s = StyleSheet.create({
  root:    {flex: 1, backgroundColor: colors.rootBg},
  scroll:  {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},

  introCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)', padding: spacing.md, marginBottom: spacing.lg},
  introText: {fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, flex: 1, lineHeight: 20},
  introBold: {fontFamily: fontFamily.interBold, color: colors.gold},

  sectionTitle: {fontFamily: fontFamily.interBold, fontSize: 13, color: colors.textPrimary,
    marginBottom: spacing.sm},

  approvedGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  approvedTile: {width: '47%', flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.15)',
    padding: spacing.md},
  approvedEmoji:{fontSize: 20},
  approvedName: {fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textPrimary, flex: 1},

  notAllowedCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: 'rgba(200,40,40,0.07)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(200,40,40,0.20)',
    padding: spacing.md, marginBottom: spacing.sm},
  notAllowedText: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: 'rgba(255,100,100,0.85)'},

  faqCard:    {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden'},
  faqItem:    {padding: spacing.md},
  faqHeader:  {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  faqQ:       {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20},
  faqA:       {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    marginTop: spacing.sm, lineHeight: 19},
  faqDivider: {height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md},
});
