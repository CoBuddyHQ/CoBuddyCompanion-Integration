/**
 * ProfilePreviewScreen (CPN-141)
 * Read-only customer-facing view of the companion's profile.
 * All data read from useProfileStore — no hardcoded dummy values.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

const COVER_HEIGHT = 180;
const AVATAR_SIZE = 96;

export function ProfilePreviewScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const profile = useProfileStore((s) => s.profile);

  // ── Dynamic display values ──────────────────────────────────────────────────
  const displayName = profile?.displayName ?? 'Companion';
  const city = profile?.city ?? '';
  const rating = profile?.rating ?? 0;
  const totalReviews = profile?.totalReviews ?? 0;
  const totalSessions = profile?.totalSessions ?? 0;
  const bio = profile?.bio ?? '';
  const languages = profile?.languages ?? [];
  const categories = profile?.categories ?? [];
  const isVerified = profile?.verificationStatus === 'approved';

  // Age is not stored on CompanionProfile — display name only
  const nameDisplay = displayName;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
          style={s.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={s.previewBadge}>
          <Icon name="visibility" size={14} color={colors.gold} />
          <Text style={s.previewBadgeText}> {t('profile.customer_view')} </Text>
        </View>

        {/* Spacer to centre badge */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Cover + Avatar */}
        <View style={s.cover}>
          <View style={s.dot1} />
          <View style={s.dot2} />
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Icon name="person" size={44} color={colors.gold} />
            </View>
            <View style={s.onlineDot} />
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>

          {/* Name + Verified */}
          <View style={s.nameRow}>
            <Text style={s.name}>{nameDisplay}</Text>
            {isVerified &&
            <View style={s.verifiedBadge}>
                <Icon name="verified" size={13} color={colors.safetyGreen} />
                <Text style={s.verifiedText}> {t('profile.verified')} </Text>
              </View>
            }
          </View>

          {city.length > 0 &&
          <View style={s.metaRow}>
              <Icon name="location-on" size={13} color={colors.textMuted} />
              <Text style={s.metaText}>{city}</Text>
            </View>
          }

          {/* Rating */}
          <View style={s.ratingRow}>
            <Icon name="star" size={15} color={colors.gold} />
            <Text style={s.ratingText}>{rating > 0 ? rating.toFixed(1) : '—'}</Text>
            <Text style={s.ratingCount}>
              {totalReviews > 0 ? `(${totalReviews} reviews)` : t("content.profile.ProfilePreviewScreen.no_reviews_yet")}
            </Text>
            {totalSessions > 0 &&
            <>
                <View style={s.ratingDot} />
                <Text style={s.sessionsText}>{totalSessions}  {t('profile.sessions')} </Text>
              </>
            }
          </View>

          {/* Bio */}
          {bio.length > 0 &&
          <View style={s.section}>
              <Text style={s.sectionTitle}> {t('profile.about')} </Text>
              <Text style={s.bioText}>{bio}</Text>
            </View>
          }

          {/* Categories */}
          {categories.length > 0 &&
          <View style={s.section}>
              <Text style={s.sectionTitle}> {t('profile.experiences')} </Text>
              <View style={s.tagsRow}>
                {categories.map((cat) =>
              <View key={cat} style={s.tag}>
                    <Text style={s.tagText}>{cat.replace(/_/g, ' ')}</Text>
                  </View>
              )}
              </View>
            </View>
          }

          {/* Languages */}
          {languages.length > 0 &&
          <View style={s.section}>
              <Text style={s.sectionTitle}> {t('profile.languages')} </Text>
              <Text style={s.langText}>{languages.join(', ')}</Text>
            </View>
          }

          {/* Empty state if profile not loaded yet */}
          {!profile &&
          <View style={s.emptyWrap}>
              <Icon name="person-outline" size={40} color={colors.textMuted} />
              <Text style={s.emptyText}> {t('profile.profile_not_loaded_yet')} </Text>
            </View>
          }

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky footer — preview only, disabled */}
      <View style={s.footer}>
        <View style={s.previewNote}>
          <Icon name="visibility" size={13} color={colors.textMuted} />
          <Text style={s.previewNoteText}> {t('profile.this_is_how_customers_see_your_profile')} </Text>
        </View>
        <TouchableOpacity style={s.bookBtnDisabled} disabled activeOpacity={1}>
          <Icon name="calendar-today" size={16} color="rgba(10,18,32,0.45)" style={{ marginRight: 8 }} />
          <Text style={s.bookBtnText}>
            {profile?.hourlyRate ? `Book for ₹${profile.hourlyRate}/hr` : t("content.profile.ProfilePreviewScreen.book_a_session")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default ProfilePreviewScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
    backgroundColor: colors.rootBg
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.cardSurface,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center'
  },
  previewBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    paddingHorizontal: 12, paddingVertical: 5
  },
  previewBadgeText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },

  scroll: { flex: 1 },

  cover: {
    height: COVER_HEIGHT, backgroundColor: '#1A2640', position: 'relative',
    alignItems: 'center', justifyContent: 'flex-end',
    paddingBottom: AVATAR_SIZE / 2, overflow: 'hidden'
  },
  dot1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(214,168,79,0.07)', top: -70, left: -50
  },
  dot2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(109,214,165,0.05)', bottom: -40, right: 20
  },

  avatarWrap: { position: 'relative' },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(214,168,79,0.15)', borderWidth: 3, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center'
  },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.safetyGreen, borderWidth: 2.5, borderColor: colors.rootBg
  },

  body: { paddingHorizontal: spacing.lg, paddingTop: AVATAR_SIZE / 2 + spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4, flexWrap: 'wrap' },
  name: { fontFamily: fontFamily.playfairBold, fontSize: 26, color: colors.textPrimary },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,214,165,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.28)', paddingHorizontal: 8, paddingVertical: 3
  },
  verifiedText: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.safetyGreen },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  metaText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.lg, flexWrap: 'wrap' },
  ratingText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  ratingCount: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  ratingDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted },
  sessionsText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: spacing.sm
  },
  bioText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.cardSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', paddingHorizontal: 14, paddingVertical: 7
  },
  tagText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold },
  langText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary },

  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted },

  footer: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    paddingBottom: spacing.xl, gap: spacing.sm,
    backgroundColor: colors.rootBg
  },
  previewNote: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  previewNoteText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  bookBtnDisabled: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: 'rgba(214,168,79,0.30)'
  },
  bookBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: 'rgba(10,18,32,0.50)' }
});