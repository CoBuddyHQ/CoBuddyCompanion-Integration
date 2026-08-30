/**
 * ReviewDetailScreen (CPN-157)
 */
import { AdminConfig } from '../../config/adminValues';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useReviewsStore } from '../../store/slices/reviewsStore';
import { useTranslation } from "react-i18next";

function categoryLabel(cat: string): string {
  return AdminConfig.categoryDetails[cat]?.label ?? cat;
}

export function ReviewDetailScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const params = route.params ?? {};
  const reviewId = params.reviewId as string ?? '';
  const reviewText = params.reviewText as string ?? '';
  const reviewerName = params.reviewerName as string ?? 'Customer';
  const reviewDate = params.reviewDate as string ?? '';
  const reviewRating = params.reviewRating as number ?? 0;
  const sessionCategory = params.sessionCategory as string ?? 'cafe_conversation';
  const durationMinutes = params.durationMinutes as number ?? 120;

  // Derive initial values from the store if they exist
  const existingReview = useReviewsStore((s) => s.reviews.find((r) => r.id === reviewId));
  const addReplyToReview = useReviewsStore((s) => s.addReplyToReview);
  const reportReview = useReviewsStore((s) => s.reportReview);

  const [reply, setReply] = useState(existingReview?.replyText ?? '');
  const [focused, setFocused] = useState(false);
  const [posted, setPosted] = useState(!!existingReview?.replyText);

  const handlePost = () => {
    if (!reply.trim() || !reviewId) {return;}
    addReplyToReview(reviewId, reply);
    setPosted(true);
    Alert.alert(t("alerts.reply_posted"), t("alerts.your_reply_has_been_saved_successfully"));
  };

  const handleReport = () => {
    if (!reviewId) return;
    if (existingReview?.isReported) {
      Alert.alert(t("alerts.already_reported"), t("alerts.this_review_is_already_under_investigati"));
      return;
    }
    reportReview(reviewId, 'Inappropriate or fake review');
    Alert.alert(t("alerts.report_submitted"), t("alerts.our_team_will_review_this_report_within"));
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('profile.review_details')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Customer card */}
          <View style={s.customerCard}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {reviewerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={s.customerInfo}>
              <Text style={s.customerName}>{reviewerName}</Text>
              {reviewDate.length > 0 &&
              <Text style={s.customerDate}>{reviewDate}</Text>
              }
            </View>
            <View style={s.verifiedBadge}>
              <Icon name="verified" size={12} color={colors.safetyGreen} />
              <Text style={s.verifiedText}> {t('profile.verified')} </Text>
            </View>
          </View>

          {/* Rating stars */}
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((i) =>
            <Icon key={i} name={i <= Math.round(reviewRating) ? 'star' : 'star-border'}
            size={26} color={colors.gold} />
            )}
            <Text style={s.ratingNum}>{reviewRating > 0 ? reviewRating.toFixed(1) : '—'}</Text>
          </View>

          {/* Review text */}
          <View style={s.reviewCard}>
            <Icon name="format-quote" size={20} color="rgba(214,168,79,0.30)" style={{ marginBottom: 4 }} />
            {reviewText.length > 0 ?
            <Text style={s.reviewText}>{reviewText}</Text> :

            <Text style={[s.reviewText, { color: colors.textMuted, fontStyle: 'italic' }]}>
                 {t('profile.no_review_text_available')} </Text>
            }
          </View>

          {/* Session tag */}
          <View style={s.sessionTag}>
            <Icon name="local-activity" size={13} color={colors.textMuted} />
            <Text style={s.sessionTagText}>
               {t('profile.session')} {categoryLabel(sessionCategory)}{t("content.profile.ReviewDetailScreen.text")}{Math.round(durationMinutes / 60)}  {t('profile.hrs')} </Text>
          </View>

          {/* Reply section */}
          <Text style={s.sectionLabel}>{posted ? t("content.profile.ReviewDetailScreen.your_reply") : t("content.profile.ReviewDetailScreen.reply_to_customer")}</Text>
          {posted ?
          <View style={s.postedReply}>
              <Icon name="check-circle" size={14} color={colors.safetyGreen} />
              <Text style={s.postedReplyText}>{reply}</Text>
            </View> :

          <View style={[s.replyWrap, focused && s.replyWrapFocused]}>
              <TextInput style={[s.replyInput, { minHeight: 80 }]} value={reply} onChangeText={setReply}
            placeholder={t('profile.write_a_professional_reply')}
            placeholderTextColor={colors.textMuted} multiline
            textAlignVertical="top"
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            selectionColor={colors.gold} />
            </View>
          }
          {!posted &&
          <TouchableOpacity accessibilityRole="button" style={[s.postBtn, !reply.trim() && s.postBtnDisabled]}
          onPress={handlePost} disabled={!reply.trim()} activeOpacity={0.85}>
              <Icon name="send" size={16} color={reply.trim() ? colors.rootBg : colors.textMuted}
            style={{ marginRight: 8 }} />
              <Text style={[s.postBtnText, !reply.trim() && s.postBtnTextDisabled]}> {t('profile.post_reply')} </Text>
            </TouchableOpacity>
          }

          {/* Report link */}
          <TouchableOpacity accessibilityRole="button" style={s.reportLink}
          onPress={handleReport}
          disabled={existingReview?.isReported}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="flag" size={13} color={existingReview?.isReported ? colors.safetyGreen : colors.textMuted} />
            <Text style={[s.reportLinkText, existingReview?.isReported && { color: colors.safetyGreen }]}>
              {existingReview?.isReported ? t("content.profile.ReviewDetailScreen.report_submitted") : t("content.profile.ReviewDetailScreen.report_this_review")}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default ReviewDetailScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A2D45',
    borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.gold },
  customerInfo: { flex: 1 },
  customerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  customerDate: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.10)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontFamily: fontFamily.interBold, fontSize: 10, color: colors.safetyGreen },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  ratingNum: { fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold, marginLeft: 4 },
  reviewCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)', padding: spacing.md, marginBottom: spacing.sm },
  reviewText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  sessionTag: { flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: spacing.lg },
  sessionTagText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  replyWrap: { backgroundColor: '#0D1525', borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.md, marginBottom: spacing.sm },
  replyWrapFocused: { borderColor: colors.gold },
  replyInput: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  postedReply: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.20)', padding: spacing.md, marginBottom: spacing.sm },
  postedReplyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, flex: 1 },
  postBtn: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold, marginBottom: spacing.xl },
  postBtnDisabled: { backgroundColor: colors.cardSurface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  postBtnText: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.rootBg },
  postBtnTextDisabled: { color: colors.textMuted },
  reportLink: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center' },
  reportLinkText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted }
});