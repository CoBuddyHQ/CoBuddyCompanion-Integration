 /**
* EditLanguagesScreen (CPN-139)
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
import { useProfileStore } from '../../store/slices/profileStore';
import { useTranslation } from "react-i18next";

const ALL_LANGUAGES = ["English", "Hindi", "Hinglish", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam", "Punjabi", "French", "Spanish"] as any[];





// Nested component extraction: ItemSeparator was defined inside EditLanguagesScreen render.
// It uses no parent state/props (only global `s.sep` style). Extracted to module level.
const ItemSeparator = () => <View style={s.sep} />;

export function EditLanguagesScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);

  const [selected, setSelected] = useState<string[]>(profile?.languages ?? []);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() =>
  ALL_LANGUAGES.filter((l) => l.toLowerCase().includes(query.toLowerCase())),
  [query]
  );

  const toggle = (lang: string) => {
    setSelected((s) => s.includes(lang) ? s.filter((x) => x !== lang) : [...s, lang]);
  };

  const canSave = selected.length > 0;

  const handleSave = () => {
    if (!canSave) {return;}
    updateProfile({ languages: selected });
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  const renderItem = ({ item }: {item: string;}) => {
    const isActive = selected.includes(item);
    return (
      <TouchableOpacity accessibilityRole="button" style={s.row} onPress={() => toggle(item)} activeOpacity={0.75}>
        <Text style={[s.rowLabel, isActive && s.rowLabelActive]}>{item}</Text>
        <Icon name={isActive ? 'check-circle' : 'radio-button-unchecked'}
        size={22} color={isActive ? colors.gold : colors.textMuted} />
      </TouchableOpacity>);

  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />

      <View style={s.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
        style={s.headerBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}> {t('profile.edit_languages')} </Text>
        <TouchableOpacity accessibilityRole="button" onPress={handleSave} style={s.headerBtn} disabled={!canSave}>
          <Text style={[s.saveText, !canSave && s.saveTextDisabled]}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={[s.searchWrap, focused && s.searchWrapFocused]}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput style={s.searchInput} value={query} onChangeText={setQuery}
        placeholder={t('profile.search_languages')} placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        selectionColor={colors.gold} />
        {query.length > 0 &&
        <TouchableOpacity accessibilityRole="button" onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="cancel" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        }
      </View>

      {/* Selected count */}
      {selected.length > 0 &&
      <View style={s.selectedBar}>
          <Icon name="translate" size={14} color={colors.gold} />
          <Text style={s.selectedText}>
            {selected.length}  {t('profile.language')} {selected.length > 1 ? 's' : ''}  {t('profile.selected_1')} {selected.join(', ')}
          </Text>
        </View>
      }

      <FlatList data={filtered} keyExtractor={(i) => i} renderItem={renderItem}
      contentContainerStyle={s.list} ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
      <View style={s.empty}>
            <Icon name="search-off" size={32} color={colors.textMuted} />
            <Text style={s.emptyText}> {t('profile.no_languages_found')} </Text>
          </View>
      } />
      
    </SafeAreaView>);

}
export default EditLanguagesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' },
  headerBtn: { minWidth: 48, alignItems: 'center' },
  headerTitle: { fontFamily: fontFamily.interBold, fontSize: 17, color: colors.textPrimary },
  saveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  saveTextDisabled: { opacity: 0.35 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#0D1525', borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: spacing.lg, marginVertical: spacing.md, paddingHorizontal: spacing.md, paddingVertical: 10 },
  searchWrapFocused: { borderColor: colors.gold },
  searchInput: { flex: 1, fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, padding: 0 },
  selectedBar: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(214,168,79,0.14)' },
  selectedText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.gold, flex: 1, lineHeight: 18 },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.md },
  rowLabel: { fontFamily: fontFamily.interRegular, fontSize: 15, color: colors.textSecondary },
  rowLabelActive: { fontFamily: fontFamily.interSemiBold, color: colors.textPrimary },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  empty: { alignItems: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textMuted }
});