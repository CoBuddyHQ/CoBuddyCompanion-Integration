/**
 * CoBuddy Companion App — ProfileAvatar Component
 * Circular avatar with gold verification ring.
 * Customer PII (name) must always be masked when shown.
 */

import React from 'react';
import {View, Image, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';
import {textStyles} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface ProfileAvatarProps {
  /** Image URI — null shows initials fallback */
  uri?: string | null;
  /** Initials to show when no image (e.g. "AK") */
  initials?: string;
  size?: AvatarSize;
  /** Show gold verified ring */
  verified?: boolean;
  /** Show online/active indicator dot */
  online?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = {
  sm: spacing.avatarSm,
  md: spacing.avatarMd,
  lg: spacing.avatarLg,
  xl: spacing.avatarXl,
  hero: spacing.avatarHero,
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  initials = '?',
  size = 'md',
  verified = false,
  online = false,
  style,
}) => {
  const dim = SIZES[size];
  const ringWidth = verified ? (size === 'sm' ? 1.5 : 2) : 0;
  const dotSize = Math.max(10, dim * 0.22);

  return (
    <View style={[styles.wrapper, style]}>
      {/* Avatar circle */}
      <View
        style={[
          styles.ring,
          {
            width: dim + ringWidth * 2 + 2,
            height: dim + ringWidth * 2 + 2,
            borderRadius: (dim + ringWidth * 2 + 2) / 2,
            borderWidth: ringWidth,
            borderColor: verified ? colors.gold : colors.borderSurface,
          },
        ]}>
        {uri ? (
          <Image
            source={{uri}}
            style={[styles.image, {width: dim, height: dim, borderRadius: dim / 2}]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.initials,
              {
                width: dim,
                height: dim,
                borderRadius: dim / 2,
                backgroundColor: colors.elevatedSurface,
              },
            ]}>
            <Text
              style={[
                size === 'sm' ? textStyles.labelXs : size === 'md' ? textStyles.labelSm : textStyles.labelMd,
                styles.initialsText,
              ]}>
              {initials.slice(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Verified badge */}
      {verified && size !== 'sm' && (
        <View style={[styles.badge, {bottom: 0, right: 0}]}>
          <Icon name="verified" size={size === 'md' ? 14 : 16} color={colors.gold} />
        </View>
      )}

      {/* Online indicator */}
      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              bottom: 1,
              right: verified ? 14 : 1,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: colors.cardSurface,
  },
  initials: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: colors.gold,
  },
  badge: {
    position: 'absolute',
    backgroundColor: colors.cardSurface,
    borderRadius: 10,
    padding: 1,
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: colors.safetyGreen,
    borderWidth: 2,
    borderColor: colors.cardSurface,
  },
});

export default ProfileAvatar;
