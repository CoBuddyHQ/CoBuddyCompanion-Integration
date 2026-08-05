import i18next from "i18next"; /**
* CPN-175 — Companion Profile Screen
* Root tab screen for the Profile stack.
* Shows the companion's public-facing profile, stats, gallery, and reviews.
*/
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Image } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useProfileStore } from '../../store/slices/profileStore';
import { useApplicationStore } from '../../store/slices/applicationStore';
import { useReviewsStore } from '../../store/slices/reviewsStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'CP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function CompanionProfileScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const applicationBio = useApplicationStore((s) => s.professionalBio);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
      useReviewsStore.getState().fetchReviews();
    }, [fetchProfile])
  );

  // Display values — fall back gracefully; never show another companion's data
  const bio = profile?.bio || applicationBio || '';
  const displayName = profile?.displayName ?? 'Companion';
  const tagline = bio;
  const rating = profile?.rating ?? 0;
  const totalReviews = profile?.totalReviews ?? 0;
  const sessionsCount = profile?.totalSessions ?? 0; // authoritative lifetime aggregate
  const isVerified = profile?.verificationStatus === 'approved';
  const isSuperBuddy = (profile?.trustScore ?? 0) >= 90;
  const initials = getInitials(displayName);

  const languages = profile?.languages ?? [];
  const categories = profile?.categories ?? [];
  const galleryPhotos = profile?.galleryPhotos ?? [];

  // Reviews — useReviewsStore is the single source of truth for all review data.
  const allReviews = useReviewsStore((s) => s.reviews ?? []);
  const topReviews = allReviews.slice(0, 2);

  function catLabel(c: string) {
    const m: Record<string, string> = {
      cafe_conversation: 'Café Conversation', city_walk: 'City Walk',
      food_experience: 'Food Experience', art_culture: 'Art & Culture',
      shopping_assistance: 'Shopping', events: 'Events',
      business_networking: 'Networking', bookstore: 'Bookstore',
      wellness_walk: 'Wellness', movies: 'Cinema'
    };
    return m[c] ?? c.replace(/_/g, ' ');
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <AppHeader
        tabScreen
        title={t('profile.my_profile')}
        subtitle={t('profile.your_public_identity')}
        rightIcon="settings"
        showBack={false}
        onRightPress={() => (navigation as any).navigate(Routes.ACCOUNT_SETTINGS  )} />
      

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                 HERO — Cover + Avatar + Name
              ══════════════════════════════════════════ */}
        <View style={styles.heroSection}>
          {/* Cover gradient */}
          <View style={[styles.coverGradient, { backgroundColor: '#0D1B2E' }]}>
            {/* Decorative pattern dots */}
            <View style={styles.coverDot1} />
            <View style={styles.coverDot2} />
            <View style={styles.coverDot3} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {profile?.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={{ width: '100%', height: '100%', borderRadius: 48 }} resizeMode="cover" />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            {/* Online indicator */}
            <View style={styles.onlineDot} />
          </View>

          {/* Name & tagline */}
          <Text style={styles.heroName}>{displayName}</Text>
          <Text style={styles.heroTagline}>{tagline}</Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            {isVerified &&
            <View style={styles.badgeGreen}>
                <Icon name="verified" size={12} color={colors.safetyGreen} />
                <Text style={styles.badgeGreenText}> {t('profile.verified_identity')} </Text>
              </View>
            }
            {isSuperBuddy &&
            <View style={styles.badgeGold}>
                <Icon name="star" size={12} color={colors.gold} />
                <Text style={styles.badgeGoldText}> {t('profile.super_buddy')} </Text>
              </View>
            }
          </View>
        </View>

        <View style={styles.body}>

          {/* ══════════════════════════════════════════
                   STATS ROW
                ══════════════════════════════════════════ */}
          <View style={styles.statsCard}>
            {[
            { value: `${rating.toFixed(1)} ⭐`, label: t("content.profile.CompanionProfileScreen.rating") },
            { value: String(sessionsCount), label: t("content.profile.CompanionProfileScreen.sessions") },
            { value: '100%', label: t("content.profile.CompanionProfileScreen.response") }].
            map((stat, i) =>
            <React.Fragment key={t(stat.label)}>
                {i > 0 && <View style={styles.statsDivider} />}
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{t(stat.label)}</Text>
                </View>
              </React.Fragment>
            )}
          </View>

          {/* ── Quick action pills ── */}
          <View style={styles.quickPills}>
            <TouchableOpacity accessibilityRole="button" style={styles.pill}
            onPress={() => (navigation as any).navigate(Routes.TRUST_SCORE_DASHBOARD  )}>
              <Icon name="shield" size={14} color={colors.gold} />
              <Text style={styles.pillText}> {t('profile.trust_score')} </Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.pill}
            onPress={() => (navigation as any).navigate(Routes.BADGES_ACHIEVEMENTS  )}>
              <Icon name="emoji-events" size={14} color={colors.gold} />
              <Text style={styles.pillText}> {t('profile.badges')} </Text>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.pill}
            onPress={() => (navigation as any).navigate(Routes.PROFILE_PREVIEW  )}>
              <Icon name="visibility" size={14} color={colors.gold} />
              <Text style={styles.pillText}> {t('profile.preview')} </Text>
            </TouchableOpacity>
          </View>

          {/* ══════════════════════════════════════════
                   ABOUT ME
                ══════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}> {t('profile.about_me')} </Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => (navigation as any).navigate(Routes.EDIT_BIO  )}>
                <Text style={styles.sectionLink}> {t('profile.edit')} </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bioText}>{bio}</Text>

            {/* Languages */}
            <View style={styles.tagsRow}>
              <Icon name="translate" size={14} color={colors.textMuted} style={{ marginRight: 5 }} />
              {languages.map((l) =>
              <View key={l} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{l}</Text>
                </View>
              )}
              <TouchableOpacity accessibilityRole="button" onPress={() => (navigation as any).navigate(Routes.EDIT_LANGUAGES  )}
              style={{ marginLeft: 4 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="edit" size={13} color={colors.gold} />
              </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={[styles.tagsRow, { marginTop: 6 }]}>
              <Icon name="category" size={14} color={colors.textMuted} style={{ marginRight: 5 }} />
              {categories.slice(0, 3).map((c) =>
              <View key={c} style={styles.tagChipGold}>
                  <Text style={styles.tagChipGoldText}>{catLabel(c)}</Text>
                </View>
              )}
              <TouchableOpacity accessibilityRole="button" onPress={() => (navigation as any).navigate(Routes.EDIT_CATEGORIES  )}
              style={{ marginLeft: 4 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="edit" size={13} color={colors.gold} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ══════════════════════════════════════════
                   GALLERY
                ══════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}> {t('profile.my_gallery')} </Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => (navigation as any).navigate(Routes.GALLERY_PHOTO_MANAGER  )}>
                <Text style={styles.sectionLink}> {t('profile.edit_photos')} </Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScroll}>
              {galleryPhotos.length > 0 ? (
                galleryPhotos.map((photoUrl, i) => (
                  <View key={photoUrl + i} style={styles.galleryThumb}>
                    <Image source={{ uri: photoUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  </View>
                ))
              ) : (
                <View style={[styles.galleryThumb, { backgroundColor: '#1E2D45' }]}>
                  <Icon name="image" size={24} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.galleryThumbLabel}>{t('profile.no_photos')}</Text>
                </View>
              )}
              <TouchableOpacity accessibilityRole="button"
                style={[styles.galleryThumb, styles.galleryAddThumb]}
                onPress={() => (navigation as any).navigate(Routes.GALLERY_PHOTO_MANAGER)}>
                <Icon name="add-photo-alternate" size={26} color={colors.textMuted} />
                <Text style={styles.galleryAddLabel}> {t('profile.manage')} </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* ══════════════════════════════════════════
                   REVIEWS SNIPPET
                ══════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}> {t('profile.recent_reviews')} </Text>
              <TouchableOpacity accessibilityRole="button" onPress={() => (navigation as any).navigate(Routes.REVIEWS_DASHBOARD  )}>
                <Text style={styles.sectionLink}> {t('profile.view_all')} </Text>
              </TouchableOpacity>
            </View>

            {topReviews.length === 0 ?
            <View style={styles.emptyReviews}>
                <Icon name="rate-review" size={28} color={colors.textMuted} />
                <Text style={styles.emptyReviewsText}> {t('profile.no_reviews_yet_complete_sessions_to_earn_reviews')} </Text>
              </View> :

            <>
                {topReviews.map((review) =>
              <TouchableOpacity accessibilityRole="button"
                key={review.id}
                style={styles.reviewCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(Routes.REVIEW_DETAIL, {
                  reviewText: review.comment, // Review shape: comment
                  reviewerName: review.customerName, // Review shape: customerName
                  reviewDate: review.date,
                  reviewRating: review.rating
                })}>
                    <View style={styles.reviewTop}>
                      <View style={styles.reviewAvatar}>
                        <Text style={styles.reviewAvatarText}>
                          {review.customerName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: spacing.sm }}>
                        <Text style={styles.reviewerName}>{review.customerName}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <View style={styles.reviewRatingBadge}>
                        <Icon name="star" size={11} color={colors.gold} />
                        <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewText} numberOfLines={2}>{review.comment}</Text>
                  </TouchableOpacity>
              )}

                {allReviews.length > 2 &&
              <TouchableOpacity accessibilityRole="button"
                style={styles.reviewsLink}
                onPress={() => (navigation as any).navigate(Routes.REVIEWS_DASHBOARD  )}>
                    <Icon name="star" size={14} color={colors.gold} />
                    <Text style={styles.reviewsLinkText}>
                      {rating.toFixed(1)}  {t('profile.avg_read_all')} {totalReviews}  {t('profile.reviews')} </Text>
                    <Icon name="arrow-forward" size={14} color={colors.gold} />
                  </TouchableOpacity>
              }
              </>
            }
          </View>

          {/* ══════════════════════════════════════════
                   PROFILE MANAGEMENT
                ══════════════════════════════════════════ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}> {t('profile.profile_management')} </Text>
            {[
            { icon: 'map', label: t("content.profile.CompanionProfileScreen.manage_service_areas"), route: Routes.EDIT_SERVICE_AREAS },
            { icon: 'my-location', label: t("content.profile.CompanionProfileScreen.travel_radius"), route: Routes.TRAVEL_RADIUS_PREFERENCE },
            { icon: 'photo-library', label: t("content.profile.CompanionProfileScreen.manage_photos"), route: Routes.GALLERY_PHOTO_MANAGER }].
            map((item) =>
            <TouchableOpacity accessibilityRole="button" key={t(item.label)} style={styles.menuRow}
            onPress={() => (navigation as any).navigate(item.route  )} activeOpacity={0.7}>
                <View style={styles.menuIconWrap}>
                  <Icon name={item.icon as any} size={18} color={colors.gold} />
                </View>
                <Text style={styles.menuLabel}>{t(item.label)}</Text>
                <Icon name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* ══════════════════════════════════════════
                   MORE
                ══════════════════════════════════════════ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}> {t('profile.more')} </Text>
            {[
            { icon: 'calendar-today', label: t("content.profile.CompanionProfileScreen.my_availability"), route: Routes.AVAILABILITY_CALENDAR },
            { icon: 'school', label: t("content.profile.CompanionProfileScreen.training_development"), route: Routes.TRAINING_HUB },
            { icon: 'shield', label: t("content.profile.CompanionProfileScreen.safety_hub"), route: Routes.COMPANION_SAFETY_HUB },
            { icon: 'help-center', label: t("content.profile.CompanionProfileScreen.help_support"), route: Routes.SUPPORT_CENTER },
            { icon: 'policy', label: t("content.profile.CompanionProfileScreen.policy_center"), route: Routes.POLICY_CENTER }].
            map((item) =>
            <TouchableOpacity accessibilityRole="button" key={t(item.label)} style={styles.menuRow}
            onPress={() => (navigation as any).navigate(item.route  )} activeOpacity={0.7}>
                <View style={styles.menuIconWrap}>
                  <Icon name={item.icon as any} size={18} color={colors.gold} />
                </View>
                <Text style={styles.menuLabel}>{t(item.label)}</Text>
                <Icon name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Edit Profile button ── */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.btnEditProfile}
            onPress={() => (navigation as any).navigate(Routes.EDIT_BASIC_PROFILE  )}
            activeOpacity={0.8}
            accessibilityLabel={t("accessibility.edit_profile")}>
            <Icon name="edit" size={17} color={colors.gold} style={{ marginRight: 8 }} />
            <Text style={styles.btnEditProfileText}> {t('profile.edit_profile')} </Text>
          </TouchableOpacity>

          {/* ── Hourly Rate / Pricing ── */}
          <TouchableOpacity accessibilityRole="button"
            style={styles.pricingCard}
            onPress={() => (navigation as any).navigate(Routes.EDIT_PRICING  )}
            activeOpacity={0.8}
            accessibilityLabel={t("accessibility.edit_pricing")}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pricingLabel}> {t('profile.your_hourly_rate')} </Text>
              <Text style={styles.pricingValue}>₹500<Text style={styles.pricingUnit}> {t('profile.hr')} </Text></Text>
              <Text style={styles.pricingEarns}> {t('profile.you_earn_400_after_platform_fee')} </Text>
            </View>
            <Icon name="edit" size={18} color={colors.gold} />
          </TouchableOpacity>

          {/* ══════════════════════════════════════════
                   DEV DEBUG: System & Account States
                   Only visible in __DEV__ (never shipped to production)
                ══════════════════════════════════════════ */}
          {__DEV__ &&
          <View style={styles.section}>
              <View style={styles.devSectionHeader}>
                <Icon name="science" size={13} color={colors.textMuted} />
                <Text style={styles.devSectionTitle}> {t('profile.developer_debug_system_account_states')} </Text>
              </View>
              {[
            { icon: 'block', label: t("content.profile.CompanionProfileScreen.account_suspended"), route: Routes.ACCOUNT_SUSPENDED },
            { icon: 'person-off', label: t("content.profile.CompanionProfileScreen.account_deactivated"), route: Routes.ACCOUNT_DEACTIVATED },
            { icon: 'hourglass-empty', label: t("content.profile.CompanionProfileScreen.account_under_review"), route: Routes.ACCOUNT_UNDER_MANUAL_REVIEW },
            { icon: 'send', label: t("content.profile.CompanionProfileScreen.submit_reactivation"), route: Routes.ACCOUNT_REACTIVATION_REQUEST },
            { icon: 'warning', label: t("content.profile.CompanionProfileScreen.policy_violation_notice"), route: Routes.POLICY_VIOLATION_NOTICE },
            { icon: 'wifi-off', label: t("content.profile.CompanionProfileScreen.network_error"), route: Routes.NETWORK_ERROR },
            { icon: 'engineering', label: t("content.profile.CompanionProfileScreen.maintenance_mode"), route: Routes.MAINTENANCE_MODE },
            { icon: 'system-update', label: t("content.profile.CompanionProfileScreen.force_update"), route: Routes.FORCE_UPDATE },
            { icon: 'call', label: t("content.profile.CompanionProfileScreen.incoming_call_test"), route: Routes.INCOMING_CALL }].
            map((item) =>
            <TouchableOpacity accessibilityRole="button" key={t(item.label)} style={styles.devMenuRow}
            onPress={() => (navigation as any).navigate(item.route)} activeOpacity={0.7}>
                  <View style={styles.devMenuIcon}>
                    <Icon name={item.icon as any} size={16} color={colors.textMuted} />
                  </View>
                  <Text style={styles.devMenuLabel}>{t(item.label)}</Text>
                  <Icon name="chevron-right" size={16} color={colors.textMuted} />
                </TouchableOpacity>
            )}
            </View>
          }

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </SafeAreaView>);

}

export default CompanionProfileScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },


  // Hero
  heroSection: { alignItems: 'center' },
  coverGradient: {
    width: '100%', height: 130, position: 'relative', overflow: 'hidden'
  },
  coverDot1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(214,168,79,0.06)', top: -60, left: -40
  },
  coverDot2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(214,168,79,0.04)', bottom: -30, right: 20
  },
  coverDot3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(109,214,165,0.04)', top: 20, right: 80
  },

  avatarWrap: { position: 'relative', marginTop: -48, zIndex: 10 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#1A2540',
    borderWidth: 3, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOpacity: 0.30,
    shadowRadius: 12, shadowOffset: { width: 0, height: 0 }
  },
  avatarText: { fontFamily: fontFamily.interBold, fontSize: 30, color: colors.gold },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.safetyGreen,
    borderWidth: 2, borderColor: colors.rootBg
  },

  heroName: {
    fontFamily: fontFamily.interBold, fontSize: 22, color: colors.textPrimary,
    marginTop: spacing.md, textAlign: 'center'
  },
  heroTagline: {
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted,
    fontStyle: 'italic', marginTop: 4, textAlign: 'center'
  },

  badgesRow: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.lg
  },
  badgeGreen: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.safetyGreenSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)',
    paddingHorizontal: 10, paddingVertical: 4
  },
  badgeGreenText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.safetyGreen },
  badgeGold: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.goldSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    paddingHorizontal: 10, paddingVertical: 4
  },
  badgeGoldText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.gold },

  body: { paddingHorizontal: spacing.lg },

  // Stats
  statsCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  statCell: { flex: 1, alignItems: 'center' },
  statsDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.07)' },
  statValue: { fontFamily: fontFamily.interBold, fontSize: 18, color: colors.textPrimary },
  statLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 3 },

  // Quick pills
  quickPills: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md
  },
  pill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, paddingVertical: 9,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)'
  },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.gold },

  // Section
  section: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md
  },
  sectionTitle: { fontFamily: fontFamily.playfairSemiBold, fontSize: 16, color: colors.gold },
  sectionLink: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },

  // About
  bioText: {
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    lineHeight: 22, marginBottom: spacing.md
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  tagChip: {
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 10, paddingVertical: 3
  },
  tagChipText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.textSecondary },
  tagChipGold: {
    backgroundColor: colors.goldSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    paddingHorizontal: 10, paddingVertical: 3
  },
  tagChipGoldText: { fontFamily: fontFamily.interMedium, fontSize: 11, color: colors.gold },

  // Gallery
  galleryScroll: { gap: spacing.sm, paddingRight: spacing.sm },
  galleryThumb: {
    width: 100, height: 100, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },
  galleryThumbLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 10, color: 'rgba(255,255,255,0.30)',
    marginTop: 4
  },
  galleryAddThumb: {
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border
  },
  galleryAddLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted, marginTop: 4
  },

  // Reviews
  reviewCard: {
    backgroundColor: colors.elevatedSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  reviewAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  reviewAvatarText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  reviewerName: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },
  reviewDate: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  reviewRatingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.goldSubtle,
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    paddingHorizontal: 8, paddingVertical: 3
  },
  reviewRatingText: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.gold },
  reviewText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  reviewsLink: {
    flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center'
  },
  reviewsLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  emptyReviews: {
    alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg
  },
  emptyReviewsText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted,
    textAlign: 'center', maxWidth: 240, lineHeight: 19
  },

  // Menu rows
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.goldSubtle,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  menuLabel: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, flex: 1 },

  // Edit button
  btnEditProfile: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.07)'
  },
  btnEditProfileText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },

  // Pricing card
  pricingCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)',
    padding: spacing.md, marginTop: spacing.sm
  },
  pricingLabel: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  pricingValue: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.gold },
  pricingUnit: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted },
  pricingEarns: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.safetyGreen, marginTop: 2 },

  // Dev debug section
  devSectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm,
    paddingBottom: spacing.xs, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  devSectionTitle: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  devMenuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)'
  },
  devMenuIcon: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  devMenuLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted, flex: 1 }
});