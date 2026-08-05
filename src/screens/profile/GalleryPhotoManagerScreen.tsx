import i18next from "i18next"; /**
* GalleryPhotoManagerScreen
* Companion manages their public profile gallery (add, delete, reorder photos).
* Accessed from: CompanionProfileScreen → Gallery section → "Manage".
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions, Alert, Image } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/layout/AppHeader';
import { useProfileStore } from '../../store/slices/profileStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_PAD = spacing.lg * 2; // total horizontal padding
const GRID_GAP = spacing.sm;
const TILE_SIZE = (SCREEN_W - GRID_PAD - GRID_GAP * 2) / 3;
const MAX_PHOTOS = 9;

// ─── Placeholder colors for mock tiles ───────────────────────────────────────

const TILE_COLORS = ["#1A2D48", "#162638", "#1E3350", "#15243A", "#1B3044", "#122033", "#192C44", "#13223A", "#1D3252"] as any[];

// ─── Photo Tile ───────────────────────────────────────────────────────────────

interface PhotoTileProps {
  index: number;
  photoRef: string;
  onDelete: () => void;
}

const PhotoTile: React.FC<PhotoTileProps> = ({ index, photoRef, onDelete }) => {
  const { t } = useTranslation();
  const isCover = index === 0;
  const isUrl = typeof photoRef === 'string' && (photoRef.startsWith('http') || photoRef.startsWith('file') || photoRef.startsWith('data') || photoRef.startsWith('content'));
  const colorIdx = photoRef.charCodeAt(photoRef.length - 1) % TILE_COLORS.length;

  return (
    <View style={[styles.tile, { backgroundColor: TILE_COLORS[colorIdx] }]}>
      {isUrl ? (
        <Image source={{ uri: photoRef }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <>
          <Icon name="image" size={28} color="rgba(255,255,255,0.12)" />
          <Text style={styles.tilePhotoLabel} numberOfLines={1}>
            {photoRef.replace(/\.[^.]+$/, '')}
          </Text>
        </>
      )}

      {/* Cover badge */}
      {isCover &&
      <View style={styles.coverBadge}>
          <Icon name="star" size={9} color={colors.rootBg} />
          <Text style={styles.coverBadgeText}> {t('profile.cover')} </Text>
        </View>
      }

      {/* Delete button */}
      <TouchableOpacity accessibilityRole="button"
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        accessibilityLabel={t("accessibility.delete_photo_num", { num: index + 1 })}>
        <Icon name="close" size={13} color="#fff" />
      </TouchableOpacity>
    </View>);

};

// ─── Upload tile ──────────────────────────────────────────────────────────────

const UploadTile: React.FC<{onPress: () => void;}> = ({ onPress }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity accessibilityRole="button" style={styles.uploadTile} onPress={onPress} activeOpacity={0.75}
    accessibilityLabel={t("accessibility.upload_new_photo")}>
    <Icon name="add-photo-alternate" size={28} color={colors.gold} />
    <Text style={styles.uploadTileText}> {t('profile.add_photo')} </Text>
  </TouchableOpacity>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function GalleryPhotoManagerScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  // Seed local gallery state from store (or mock fallback)
  const photos = profile?.galleryPhotos || [];
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDelete = (idx: number) => {

    Alert.alert(
      idx === 0 ? t("content.profile.GalleryPhotoManagerScreen.delete_cover_photo") : t("content.profile.GalleryPhotoManagerScreen.delete_photo"),
      idx === 0 ? t("content.profile.GalleryPhotoManagerScreen.the_next_photo_will_become_your_new_cove") : t("content.profile.GalleryPhotoManagerScreen.this_photo_will_be_removed_from_your_gal"),


      [
      { text: t("alerts.cancel"), style: 'cancel' },
      {
        text: t("alerts.delete"), style: 'destructive',
        onPress: async () => {
          setIsProcessing(true);
          try {
            const photoId = photos[idx];
            await useProfileStore.getState().deleteGalleryPhoto(photoId);
            Alert.alert(t("alerts.success"), t("alerts.photo_deleted"));
          } catch (e: any) {
            Alert.alert(t("alerts.error"), e.message || 'Failed to delete photo');
          } finally {
            setIsProcessing(false);
          }
        }
      }]

    );
  };

  const handleUpload = () => {

    Alert.alert(t("alerts.add_photo"), t("alerts.choose_an_option"),


    [
    {
      text: t("alerts.take_photo"),
      onPress: async () => {
        const newPhoto = `stub://camera_photo_${Date.now()}.jpg`;
        setIsProcessing(true);
        try {
          await useProfileStore.getState().uploadGalleryPhoto(newPhoto);
          Alert.alert(t("alerts.success"), t("alerts.photo_uploaded"));
        } catch (e: any) {
          Alert.alert(t("alerts.error"), e.message || 'Failed to upload photo');
        } finally {
          setIsProcessing(false);
        }
      }
    },
    {
      text: t("alerts.choose_from_gallery"),
      onPress: async () => {
        const newPhoto = `stub://gallery_photo_${Date.now()}.jpg`;
        setIsProcessing(true);
        try {
          await useProfileStore.getState().uploadGalleryPhoto(newPhoto);
          Alert.alert(t("alerts.success"), t("alerts.photo_uploaded"));
        } catch (e: any) {
          Alert.alert(t("alerts.error"), e.message || 'Failed to upload photo');
        } finally {
          setIsProcessing(false);
        }
      }
    },
    { text: t("alerts.cancel"), style: 'cancel' }]

    );
  };

  const handleSave = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader
        title={t('profile.manage_gallery')}
        showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* ══════════════════════════════════════════
                 INFO BANNER
              ══════════════════════════════════════════ */}
        <View style={styles.infoBanner}>
          <Icon name="tips-and-updates" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={styles.infoBannerText}>
             {t('profile.you_can_add_up_to')} {' '}
            <Text style={styles.infoBannerBold}> {t('profile.9_photos')} </Text>.
            {' '} {t('profile.high_quality_images_get')} {' '}
            <Text style={styles.infoBannerBold}> {t('profile.60_more_bookings')} </Text>
          </Text>
        </View>

        {/* ══════════════════════════════════════════
                 PHOTO COUNT INDICATOR
              ══════════════════════════════════════════ */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            <Text style={styles.countNum}>{photos.length}</Text>
            <Text style={styles.countMuted}> / {MAX_PHOTOS}  {t('profile.photos')} </Text>
          </Text>
          <View style={styles.countBar}>
            <View style={[styles.countBarFill, { width: `${photos.length / MAX_PHOTOS * 100}%` }]} />
          </View>
        </View>

        {/* ══════════════════════════════════════════
                 PHOTO GRID
              ══════════════════════════════════════════ */}
        <View style={styles.grid}>
          {photos.map((photo, idx) =>
          <PhotoTile
            key={`${photo}-${idx}`}
            index={idx}
            photoRef={photo}
            onDelete={() => handleDelete(idx)} />

          )}

          {/* Upload tile (only if slots remain) */}
          {canAddMore && <UploadTile onPress={handleUpload} />}
        </View>

        {/* ══════════════════════════════════════════
                 REORDER HINT
              ══════════════════════════════════════════ */}
        <View style={styles.reorderHint}>
          <Icon name="drag-indicator" size={14} color={colors.textMuted} />
          <Text style={styles.reorderHintText}>
             {t('profile.long_press_and_drag_photos_to_reorder_the')} {' '}
            <Text style={{ color: colors.gold }}> {t('profile.first_photo')} </Text>
            {' '} {t('profile.will_be_your_cover_image')} </Text>
        </View>

        {/* Cover photo tip */}
        {photos.length > 0 &&
        <View style={styles.coverTipRow}>
            <View style={styles.coverBadgeLarge}>
              <Icon name="star" size={12} color={colors.rootBg} />
              <Text style={styles.coverBadgeTextLarge}> {t('profile.cover')} </Text>
            </View>
            <Text style={styles.coverTipText}>
              "{photos[0].replace(/\.[^.]+$/, '')} {t('profile.is_currently_your_cover_photo')} </Text>
          </View>
        }

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
               STICKY BOTTOM BAR
            ══════════════════════════════════════════ */}
      <View style={styles.stickyBar}>
        <TouchableOpacity accessibilityRole="button"
          style={[styles.saveBtn, isProcessing && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isProcessing}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.save_gallery_changes")}>
          <Icon name="check-circle" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>
            {isProcessing ? t("alerts.processing") : t("profile.done")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default GalleryPhotoManagerScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  // Banner
  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md
  },
  infoBannerText: {
    fontFamily: fontFamily.interRegular, fontSize: 13,
    color: colors.textSecondary, lineHeight: 19, flex: 1
  },
  infoBannerBold: { fontFamily: fontFamily.interBold, color: colors.gold },

  // Count
  countRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginBottom: spacing.md
  },
  countText: { fontFamily: fontFamily.interRegular, fontSize: 13 },
  countNum: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  countMuted: { color: colors.textMuted },
  countBar: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: colors.elevatedSurface, overflow: 'hidden'
  },
  countBarFill: {
    height: '100%', borderRadius: 2, backgroundColor: colors.gold
  },

  // Grid
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP,
    marginBottom: spacing.md
  },

  // Photo tile
  tile: {
    width: TILE_SIZE, height: TILE_SIZE, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
  },
  tilePhotoLabel: {
    fontFamily: fontFamily.interRegular, fontSize: 9,
    color: 'rgba(255,255,255,0.25)', marginTop: 4, maxWidth: TILE_SIZE - 8
  },

  // Cover badge
  coverBadge: {
    position: 'absolute', top: 6, left: 6,
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: colors.gold, borderRadius: radius.full,
    paddingHorizontal: 6, paddingVertical: 2
  },
  coverBadgeText: { fontFamily: fontFamily.interBold, fontSize: 8, color: colors.rootBg },

  // Delete button
  deleteBtn: {
    position: 'absolute', top: 5, right: 5,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center', justifyContent: 'center'
  },

  // Upload tile
  uploadTile: {
    width: TILE_SIZE, height: TILE_SIZE, borderRadius: radius.lg,
    borderWidth: 2, borderColor: 'rgba(214,168,79,0.40)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: 'rgba(214,168,79,0.05)'
  },
  uploadTileText: { fontFamily: fontFamily.interSemiBold, fontSize: 11, color: colors.gold },

  // Reorder hint
  reorderHint: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    marginBottom: spacing.sm
  },
  reorderHintText: {
    fontFamily: fontFamily.interRegular, fontSize: 12,
    color: colors.textMuted, flex: 1, lineHeight: 18
  },

  // Cover tip
  coverTipRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    padding: spacing.sm
  },
  coverBadgeLarge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.gold, borderRadius: radius.full,
    paddingHorizontal: 8, paddingVertical: 3
  },
  coverBadgeTextLarge: { fontFamily: fontFamily.interBold, fontSize: 10, color: colors.rootBg },
  coverTipText: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textSecondary, flex: 1
  },

  // Sticky bar
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  unsavedHint: {
    fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.gold,
    textAlign: 'center', marginBottom: spacing.sm
  },
  saveBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});