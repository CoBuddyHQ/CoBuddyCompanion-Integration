import i18next from "i18next"; /**
* EditServiceAreasScreen (CPN-181)
*/
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

const ALL_AREAS = ["Bandra", "Andheri", "Colaba", "Juhu", "Powai", "Dadar", "Kurla", "Thane", "Borivali", "Malad", "Goregaon", "Chembur", "Sion", "Worli", "Versova", "Vikhroli", "Mulund", "Kandivali", "Santacruz", "Vile Parle"] as any[];






// Nested component extraction: ItemSeparator was defined inside EditServiceAreasScreen render.
// It uses no parent state/props (only global `s.sep` style). Extracted to module level.
const ItemSeparator = () => <View style={s.sep} />;

export function EditServiceAreasScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [selected, setSelected] = useState<string[]>(profile?.serviceAreas ?? []);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() =>
  ALL_AREAS.filter((a) => a.toLowerCase().includes(query.toLowerCase())),
  [query]
  );

  const toggle = (area: string) =>
  setSelected((s) => s.includes(area) ? s.filter((x) => x !== area) : [...s, area]);

  const handleSave = () => {
    updateProfile({ serviceAreas: selected });
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  const renderItem = ({ item }: {item: string;}) => {
    const active = selected.includes(item);
    return (
      <TouchableOpacity accessibilityRole="button" style={s.row} onPress={() => toggle(item)} activeOpacity={0.75}>
        <View style={s.rowLeft}>
          <View style={[s.rowDot, active && s.rowDotActive]} />
          <Text style={[s.rowLabel, active && s.rowLabelActive]}>{item}</Text>
        </View>
        <Icon name={active ? 'check-circle' : 'radio-button-unchecked'}
        size={22} color={active ? colors.gold : colors.textMuted} />
      </TouchableOpacity>);

  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.hBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.hTitle}> {t('profile.service_areas')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.hBtn}>
          <Text style={s.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.subtitle}> {t('profile.which_neighbourhoods_are_you_willing_to_travel_to')} </Text>

      {/* Search */}
      <View style={[s.searchWrap, focused && s.searchFocused]}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput style={s.searchInput} value={query} onChangeText={setQuery}
        placeholder={t('profile.search_areas')} placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        selectionColor={colors.gold} />
        {query.length > 0 &&
        <TouchableOpacity accessibilityRole="button" onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="cancel" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        }
      </View>

      {/* Count */}
      {selected.length > 0 &&
      <View style={s.selectedBar}>
          <Icon name="location-on" size={13} color={colors.gold} />
          <Text style={s.selectedText}>{selected.length}  {t('profile.area')} {selected.length > 1 ? 's' : ''}  {t('profile.selected')} </Text>
        </View>
      }

      <FlatList data={filtered} keyExtractor={(i) => i} renderItem={renderItem}
      contentContainerStyle={s.list} ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false} />

      {/* View on Map CTA */}
      <View style={s.footer}>
        <TouchableOpacity accessibilityRole="button" style={s.mapBtn}
        onPress={() => navigation.navigate(Routes.SERVICE_AREA_MAP)} activeOpacity={0.85}>
          <Icon name="map" size={18} color={colors.rootBg} style={{ marginRight: 8 }} />
          <Text style={s.mapBtnText}> {t('profile.view_on_map')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default EditServiceAreasScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  hBtn: { minWidth: 48, alignItems: 'center' },
  hTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  subtitle: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#0D1525', borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: spacing.lg, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: 10 },
  searchFocused: { borderColor: colors.gold },
  searchInput: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 14,
    color: colors.textPrimary, padding: 0 },
  selectedBar: { flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(214,168,79,0.14)' },
  selectedText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.elevatedSurface },
  rowDotActive: { backgroundColor: colors.gold },
  rowLabel: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary },
  rowLabelActive: { fontFamily: fontFamily.interSemiBold, color: colors.textPrimary },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  mapBtn: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  mapBtnText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});