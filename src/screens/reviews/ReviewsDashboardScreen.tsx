/**
 * CPN-131 — Reviews Dashboard Screen
 * Shows the companion's overall rating summary and all customer reviews.
 */
import React, { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { Routes } from '../../navigation/routes';
import AppHeader from '../../components/layout/AppHeader';
import { useReviewsStore, Review } from '../../store/slices/reviewsStore';
import { useProfileStore } from '../../store/slices/profileStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

// ─── Star Rating Row ──────────────────────────────────────────────────────────

const StarRow: React.FC<{rating: number;size?: number;}> = ({ rating, size = 14 }) =>
<View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) =>
  <Icon
    key={i}
    name={i <= rating ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-border'}
    size={size}
    color={i <= Math.round(rating) ? colors.gold : colors.border} />

  )}
  </View>;


// ─── Rating Bar (breakdown row) ───────────────────────────────────────────────

const RatingBar: React.FC<{star: number;count: number;total: number;}> = ({ star, count, total }) => {
  const pct = total > 0 ? count / total * 100 : 0;
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.starLabel}>{star}</Text>
      <Icon name="star" size={12} color={colors.gold} />
      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={barStyles.count}>{count}</Text>
    </View>);

};

const barStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  starLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted, width: 10, textAlign: 'right' },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.elevatedSurface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
  count: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, width: 18, textAlign: 'right' }
});

// ─── Tag Pill ─────────────────────────────────────────────────────────────────

const TagPill: React.FC<{label: string;}> = ({ label }) =>
<View style={styles.tagPill}>
    <Text style={styles.tagPillText}>{label}</Text>
  </View>;


// ─── Review Card ─────────────────────────────────────────────────────────────

const ReviewCard: React.FC<{item: Review;onPress: () => void;}> = ({ item, onPress }) => {
  const initials = item.customerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <TouchableOpacity accessibilityRole="button" style={styles.reviewCard} onPress={onPress} activeOpacity={0.8}>
      {/* Top row */}
      <View style={styles.reviewTop}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{initials}</Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewerName}>{item.customerName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewRatingBadge}>
          <Icon name="star" size={12} color={colors.gold} />
          <Text style={styles.reviewRatingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Star row */}
      <View style={{ marginBottom: spacing.sm }}>
        <StarRow rating={item.rating} size={13} />
      </View>

      {/* Comment */}
      <Text style={styles.reviewComment}>{item.comment}</Text>

      {/* Tags */}
      {item.tags.length > 0 &&
      <View style={styles.tagRow}>
          {item.tags.map((tag) => <TagPill key={tag} label={tag} />)}
        </View>
      }
    </TouchableOpacity>);

};

// ─── Pagination Footer ──────────────────────────────────────────────────────

const ListFooter: React.FC<{shown: number;total: number;}> = ({ shown, total }) => {
  const { t } = useTranslation();
  const hasMore = shown < total;
  return (
    <View style={footerStyles.wrap}>
      {hasMore ?
      <>
          <ActivityIndicator size="small" color={colors.gold} />
          <Text style={footerStyles.text}>
             {t('reviews.showing')} {shown}  {t('reviews.of')} {total}  {t('reviews.reviews_more_coming_soon')} </Text>
        </> :

      <View style={footerStyles.endRow}>
          <Text style={footerStyles.endDot}>{t("content.reviews.ReviewsDashboardScreen.text")}</Text>
          <Text style={footerStyles.endText}> {t('reviews.end_of_reviews')} </Text>
          <Text style={footerStyles.endDot}>{t("content.reviews.ReviewsDashboardScreen.text")}</Text>
        </View>
      }
    </View>);

};

const footerStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center', paddingVertical: 28, gap: 10
  },
  text: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: '#6B7280', textAlign: 'center'
  },
  endRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10
  },
  endDot: {
    fontSize: 10, color: 'rgba(214,168,79,0.40)'
  },
  endText: {
    fontFamily: 'Inter-Regular', fontSize: 12, color: '#6B7280'
  }
});

// ─── Header (ListHeaderComponent) ─────────────────────────────────────────────

const ListHeader: React.FC<{
  averageRating: number;
  totalReviews: number;
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}> = ({ averageRating, totalReviews, breakdown }) => {
  const { t } = useTranslation();
  return (
    <View>
    {/* ── Summary card ── */}
    <View style={styles.summaryCard}>
      {/* Big rating */}
      <View style={styles.summaryTop}>
        <View style={styles.summaryLeft}>
          <View style={styles.bigRatingRow}>
            <Text style={styles.bigRatingNum}>{averageRating.toFixed(1)}</Text>
            <Icon name="star" size={32} color={colors.gold} style={{ marginLeft: 6, marginTop: 2 }} />
          </View>
          <StarRow rating={averageRating} size={18} />
          <Text style={styles.basedOnText}> {t('reviews.based_on')} {totalReviews}  {t('reviews.reviews')} </Text>
        </View>

        {/* Breakdown bars */}
        <View style={styles.breakdownWrap}>
          {([5, 4, 3, 2, 1] as const).map((star) =>
            <RatingBar key={star} star={star} count={breakdown[star]} total={totalReviews} />
            )}
        </View>
      </View>

      {/* Status banner */}
      <View style={styles.statusBanner}>
        <Icon name="verified" size={15} color={colors.safetyGreen} style={{ marginRight: 6 }} />
        <Text style={styles.statusBannerText}>
           {t('reviews.keep_your_rating_above')} {' '}
          <Text style={styles.statusBannerHighlight}>4.5</Text>
          {' '} {t('reviews.to_maintain')} {' '}
          <Text style={styles.statusBannerHighlight}> {t('reviews.super_buddy')} </Text>  {t('reviews.status')} </Text>
      </View>
    </View>

    {/* ── Section title ── */}
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}> {t('reviews.all_reviews')} </Text>
      <Text style={styles.sectionCount}>{totalReviews}  {t('reviews.total')} </Text>
    </View>
  </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

// Nested component extraction: ItemSeparator was defined inside ReviewsDashboardScreen render.
// It uses no parent state/props (only global spacing theme). Extracted to module level.
const ItemSeparator = () => <View style={{ height: spacing.sm }} />;

export function ReviewsDashboardScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  // Aggregate stats — profileStore is the single source of truth (matches CompanionProfileScreen)
  const profile = useProfileStore((s) => s.profile);
  const averageRating = profile?.rating ?? 0;
  const totalReviews = profile?.totalReviews ?? 0;

  // Review list data — reviewsStore owns the individual review objects and bar chart breakdown
  const breakdown = useReviewsStore((s) => s.ratingBreakdown);
  const reviews = useReviewsStore((s) => s.reviews);

  const header = useMemo(() =>
  <ListHeader
    averageRating={averageRating}
    totalReviews={totalReviews}
    breakdown={breakdown} />,

  [averageRating, totalReviews, breakdown]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('reviews.reviews_ratings')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
        <ReviewCard item={item}
        onPress={() => navigation.navigate(Routes.REVIEW_DETAIL, {
          reviewId: item.id,
          reviewText: item.comment,
          reviewerName: item.customerName,
          reviewDate: item.date,
          reviewRating: item.rating,
          sessionCategory: item.sessionCategory,
          durationMinutes: item.durationMinutes
        })} />
        }
        ListHeaderComponent={header}
        ListFooterComponent={<ListFooter shown={reviews.length} total={totalReviews} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator} />
      
    </SafeAreaView>);

}

export default ReviewsDashboardScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Summary card
  summaryCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xxl, padding: spacing.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    marginBottom: spacing.lg
  },
  summaryTop: {
    flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md
  },
  summaryLeft: { flex: 0.9 },
  bigRatingRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6 },
  bigRatingNum: {
    fontFamily: fontFamily.playfairBold, fontSize: 56, color: colors.gold, lineHeight: 60
  },
  basedOnText: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginTop: 6
  },
  breakdownWrap: { flex: 1, justifyContent: 'center' },

  // Status banner
  statusBanner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: 'rgba(109,214,165,0.09)',
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(109,214,165,0.22)',
    padding: spacing.md
  },
  statusBannerText: {
    fontFamily: fontFamily.interRegular, fontSize: 12,
    color: colors.textSecondary, flex: 1, lineHeight: 18
  },
  statusBannerHighlight: {
    fontFamily: fontFamily.interBold, color: colors.safetyGreen
  },

  // Section title
  sectionTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md
  },
  sectionTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 16, color: colors.gold },
  sectionCount: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },

  // Review card
  reviewCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)'
  },
  reviewTop: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm
  },
  reviewAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  reviewAvatarText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  reviewMeta: { flex: 1, marginLeft: spacing.sm },
  reviewerName: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary },
  reviewDate: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  reviewRatingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.goldSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    paddingHorizontal: 8, paddingVertical: 3
  },
  reviewRatingText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.gold },
  reviewComment: {
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md
  },

  // Tags
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagPill: {
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    paddingHorizontal: 10, paddingVertical: 3
  },
  tagPillText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.gold }
});