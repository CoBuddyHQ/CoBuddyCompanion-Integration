import i18next from "i18next"; /**
* EditCategoriesScreen (CPN-138)
*/
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

const MAX_SELECT = 3;

interface Category {id: string;label: string;icon: string;}
const CATEGORIES: Category[] = [{ id: "movies", label: "content.profile.EditCategoriesScreen.categories.0.label", icon: "local-movies" }, { id: "dining", label: "content.profile.EditCategoriesScreen.categories.1.label", icon: "restaurant" }, { id: "coffee", label: "content.profile.EditCategoriesScreen.categories.2.label", icon: "local-cafe" }, { id: "events", label: "content.profile.EditCategoriesScreen.categories.3.label", icon: "event" }, { id: "travel", label: "content.profile.EditCategoriesScreen.categories.4.label", icon: "flight" }, { id: "sports", label: "content.profile.EditCategoriesScreen.categories.5.label", icon: "sports-soccer" }, { id: "shopping", label: "content.profile.EditCategoriesScreen.categories.6.label", icon: "shopping-bag" }, { id: "gaming", label: "content.profile.EditCategoriesScreen.categories.7.label", icon: "sports-esports" }, { id: "music", label: "content.profile.EditCategoriesScreen.categories.8.label", icon: "music-note" }, { id: "fitness", label: "content.profile.EditCategoriesScreen.categories.9.label", icon: "fitness-center" }, { id: "art", label: "content.profile.EditCategoriesScreen.categories.10.label", icon: "palette" }, { id: "books", label: "content.profile.EditCategoriesScreen.categories.11.label", icon: "menu-book" }] as any[];














export function EditCategoriesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [selected, setSelected] = useState<string[]>(profile?.categories ?? []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected((s) => s.filter((x) => x !== id));
    } else if (selected.length < MAX_SELECT) {
      setSelected((s) => [...s, id]);
    }
  };

  const handleSave = () => {
    updateProfile({ categories: selected });
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.headerBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}> {t('profile.edit_categories')} </Text>
        <TouchableOpacity onPress={handleSave} style={s.headerBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}> {t('profile.select_up_to')} {MAX_SELECT}  {t('profile.categories_you_specialise_in')} </Text>

        {/* Selection counter */}
        <View style={s.counterRow}>
          <View style={[s.counterBadge, selected.length >= MAX_SELECT && s.counterBadgeFull]}>
            <Text style={[s.counterText, selected.length >= MAX_SELECT && s.counterTextFull]}>
              {selected.length}/{MAX_SELECT}  {t('profile.selected')} </Text>
          </View>
          {selected.length >= MAX_SELECT &&
          <Text style={s.limitNote}> {t('profile.maximum_reached_deselect_one_to_change')} </Text>
          }
        </View>

        {/* Pills grid */}
        <View style={s.grid}>
          {CATEGORIES.map((cat) => {
            const isActive = selected.includes(cat.id);
            const isDisabled = !isActive && selected.length >= MAX_SELECT;
            return (
              <TouchableOpacity key={cat.id}
              style={[s.pill, isActive && s.pillActive, isDisabled && s.pillDisabled]}
              onPress={() => toggle(cat.id)}
              disabled={isDisabled} activeOpacity={0.75}>
                <Icon name={cat.icon as any} size={16}
                color={isActive ? colors.gold : isDisabled ? colors.textMuted : colors.textSecondary} />
                <Text style={[s.pillText, isActive && s.pillTextActive, isDisabled && s.pillTextDisabled]}>
                  {t(cat.label)}
                </Text>
                {isActive && <Icon name="check" size={14} color={colors.gold} />}
              </TouchableOpacity>);

          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>);

}
export default EditCategoriesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  headerBtn: { minWidth: 48, alignItems: 'center' },
  headerTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textSecondary,
    lineHeight: 20, marginBottom: spacing.md },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  counterBadge: { backgroundColor: colors.cardSurface, borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 4 },
  counterBadgeFull: { backgroundColor: 'rgba(214,168,79,0.12)', borderColor: 'rgba(214,168,79,0.35)' },
  counterText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  counterTextFull: { color: colors.gold },
  limitNote: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted, flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardSurface, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md, paddingVertical: 10 },
  pillActive: { backgroundColor: 'rgba(214,168,79,0.10)', borderColor: colors.gold },
  pillDisabled: { opacity: 0.40 },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary },
  pillTextActive: { color: colors.gold },
  pillTextDisabled: { color: colors.textMuted }
});