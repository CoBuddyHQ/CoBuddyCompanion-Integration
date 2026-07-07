import i18next from "i18next"; /**
* CustomerRatingFeedbackScreen (CPN-120)
* Interactive star rating with dynamic praise/concern tags — no back gesture.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

const CAT_MAP: Record<string, string> = {
  cafe_conversation: 'Café Conversation', city_walk: 'City Walk',
  art_culture: 'Art & Culture', food_experience: 'Food Experience',
  shopping_assistance: 'Shopping Assistance', events: 'Public Event',
  business_networking: 'Networking', bookstore: 'Bookstore Visit',
  wellness_walk: 'Wellness Walk', movies: 'Cinema'
};

const STAR_LABELS = ["", "Very Poor", "Poor", "Okay", "Good", "Excellent!"] as any[];
const PRAISE_TAGS = ["Punctual", "Friendly", "Respectful", "Good Communicator", "Fun"] as any[];
const CONCERN_TAGS = ["Late arrival", "Rude", "Made me uncomfortable", "No-show risk"] as any[];

export function CustomerRatingFeedbackScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);
  const customerInitials = (session?.customer?.displayInitials ?? 'C').slice(0, 2);
  const customerName = session?.customer?.displayInitials ?? 'Customer';
  const activityLabel = session?.category ?
  CAT_MAP[session.category] ?? session.category.replace(/_/g, ' ') : t("content.sessions.CustomerRatingFeedbackScreen.session");


  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (t: string) =>
  setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSubmit = () => {
    if (!rating || submitting) {return;}
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      navigation.navigate(Routes.POST_SESSION_NOTES, { sessionId });
    }, 800);
  };

  const showPraise = rating >= 4;
  const showConcern = rating > 0 && rating <= 2;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header text */}
        <Text style={s.title}> {t('sessions.rate_your_customer')} </Text>
        <Text style={s.subtitle}>
           {t('sessions.your_feedback_is_private_and_helps_cobuddy_maintain_quality')} </Text>

        {/* Customer card */}
        <View style={s.customerCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{customerInitials}</Text>
          </View>
          <View style={s.customerInfo}>
            <Text style={s.customerName}>{customerName}</Text>
            <Text style={s.customerMeta}>{activityLabel}  {t('sessions.today')} </Text>
          </View>
          <View style={s.sessionBadge}>
            <Icon name="check-circle" size={14} color={colors.safetyGreen} />
            <Text style={s.sessionBadgeText}> {t('sessions.completed')} </Text>
          </View>
        </View>

        {/* Star rating */}
        <View style={s.starsSection}>
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((star) =>
            <TouchableOpacity accessibilityRole="button"
              key={star}
              onPress={() => {setRating(star);setTags([]);}}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityLabel={t("accessibility.rate_stars", { count: star })}>
                <Icon
                name={star <= rating ? 'star' : 'star-border'}
                size={48}
                color={star <= rating ? colors.gold : colors.border} />
              
              </TouchableOpacity>
            )}
          </View>
          {rating > 0 &&
          <Text style={[s.starLabel, rating >= 4 && s.starLabelGood, rating <= 2 && s.starLabelBad]}>
              {STAR_LABELS[rating]}
            </Text>
          }
        </View>

        {/* Praise tags */}
        {showPraise &&
        <>
            <Text style={s.sectionTitle}> {t('sessions.what_went_well')} </Text>
            <View style={s.tagsRow}>
              {PRAISE_TAGS.map((t) =>
            <TouchableOpacity accessibilityRole="button" key={t}
            style={[s.tag, tags.includes(t) && s.tagActiveGold]}
            onPress={() => toggleTag(t)} activeOpacity={0.75}>
                  <Text style={[s.tagText, tags.includes(t) && s.tagTextGold]}>{t}</Text>
                </TouchableOpacity>
            )}
            </View>
          </>
        }

        {/* Concern tags */}
        {showConcern &&
        <>
            <Text style={s.sectionTitle}> {t('sessions.any_concerns')} </Text>
            <View style={s.tagsRow}>
              {CONCERN_TAGS.map((t) =>
            <TouchableOpacity accessibilityRole="button" key={t}
            style={[s.tag, tags.includes(t) && s.tagActiveRed]}
            onPress={() => toggleTag(t)} activeOpacity={0.75}>
                  <Text style={[s.tagText, tags.includes(t) && s.tagTextRed]}>{t}</Text>
                </TouchableOpacity>
            )}
            </View>
          </>
        }

        {/* Optional comment */}
        <Text style={s.sectionTitle}> {t('sessions.add_a_comment_optional')} </Text>
        <TextInput
          style={s.commentInput}
          value={comment}
          onChangeText={(t) => setComment(t.slice(0, 200))}
          placeholder={t('sessions.anything_else_you_d_like_to_share')}
          placeholderTextColor={colors.textMuted}
          multiline maxLength={200}
          selectionColor={colors.gold}
          textAlignVertical="top" />
        
        <Text style={s.charCount}>{comment.length}/200</Text>

        {/* Skip link */}
        <TouchableOpacity accessibilityRole="button" style={s.skipLink}
        onPress={() => (navigation as any).navigate(Routes.HOME_DASHBOARD  )}
        activeOpacity={0.6}>
          <Text style={s.skipText}> {t('sessions.skip_for_now')} </Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky submit */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btnSubmit, (!rating || submitting) && s.btnDisabled]}
          onPress={handleSubmit}
          disabled={!rating || submitting}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.submit_rating")}>
          <Icon name="star" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.btnSubmitText}>{submitting ? t("content.sessions.CustomerRatingFeedbackScreen.submitting") : t("content.sessions.CustomerRatingFeedbackScreen.submit_rating")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CustomerRatingFeedbackScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },

  title: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: spacing.xl },

  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.xl },
  avatar: { width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(214,168,79,0.15)',
    borderWidth: 2, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold },
  customerInfo: { flex: 1 },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  customerMeta: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sessionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3 },
  sessionBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 10, color: colors.safetyGreen },

  starsSection: { alignItems: 'center', marginBottom: spacing.xl },
  starsRow: { flexDirection: 'row', gap: spacing.sm },
  starLabel: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.textMuted, marginTop: spacing.sm },
  starLabelGood: { color: colors.safetyGreen },
  starLabelBad: { color: colors.softWarning },

  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  tagActiveGold: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  tagActiveRed: { borderColor: colors.softWarning, backgroundColor: 'rgba(200,40,40,0.08)' },
  tagText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  tagTextGold: { color: colors.gold },
  tagTextRed: { color: colors.softWarning },

  commentInput: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    padding: spacing.md, minHeight: 100,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', marginTop: 4, marginBottom: spacing.sm },

  skipLink: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnSubmit: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.45 },
  btnSubmitText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});