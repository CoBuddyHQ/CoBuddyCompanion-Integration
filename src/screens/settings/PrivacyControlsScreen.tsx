/**
 * PrivacyControlsScreen (CPN-144)
 * Privacy settings persist to settingsStore. Includes a sticky Save footer.
 */
import React, {useState} from 'react';
import {View, Text, Switch, ScrollView, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {useSettingsStore} from '../../store/slices/settingsStore';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import { useTranslation } from "react-i18next";

interface ToggleDef {key: 'showAge' | 'allowPromo' | 'showInSearch'; label: string; sub: string;}

const TOGGLES: ToggleDef[] = [
  {key: 'showAge',      label: 'Show my exact age',         sub: 'Customers will see your real age on your profile.'},
  {key: 'allowPromo',   label: 'Allow promotional messages', sub: 'Receive deals and offers from CoBuddy.'},
  {key: 'showInSearch', label: 'Show profile in search',     sub: 'Your profile may appear in Google search results.'},
];

export function PrivacyControlsScreen(): React.JSX.Element {
    const { t } = useTranslation();
  const navigation          = useNavigation<any>();  
  const storedPrivacy       = useSettingsStore(s => s.privacySettings);
  const updatePrivacySettings = useSettingsStore(s => s.updatePrivacySettings);

  // Local state mirrors store — committed on Save
  const [values, setValues] = useState(storedPrivacy);

  const toggle = (key: ToggleDef['key']) =>
    setValues(v => ({...v, [key]: !v[key]}));

  const handleSave = () => {
    updatePrivacySettings(values);
    navigation.canGoBack() ? navigation.goBack() : undefined;
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('settings.privacy_controls')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.card}>
          {TOGGLES.map((toggleItem, i) => (
            <View key={toggleItem.key}>
              {i > 0 && <View style={s.sep} />}
              <View style={s.row}>
                <View style={s.rowText}>
                  <Text style={s.rowLabel}>{t(toggleItem.label)}</Text>
                  <Text style={s.rowSub}>{t(toggleItem.sub)}</Text>
                </View>
                <Switch value={values[toggleItem.key]} onValueChange={() => toggle(toggleItem.key)}
                  trackColor={{false: colors.elevatedSurface, true: 'rgba(214,168,79,0.45)'}}
                  thumbColor={values[toggleItem.key] ? colors.gold : colors.textMuted} />
              </View>
            </View>
          ))}
        </View>

        <View style={s.banner}>
          <Icon name="shield" size={18} color={colors.gold} style={{flexShrink: 0}} />
          <Text style={s.bannerText}>
             {t('settings.your_phone_number_and_exact_location_are_always_hidden_from_customers')} </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky Save Footer */}
      <View style={s.stickyBar}>
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}
          accessibilityLabel="Save privacy settings">
          <Icon name="check-circle" size={18} color={colors.rootBg} style={{marginRight: 8}} />
          <Text style={s.saveBtnText}> {t('settings.save_changes')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default PrivacyControlsScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  card: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg},
  sep: {height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md},
  row: {flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md},
  rowText: {flex: 1},
  rowLabel: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, marginBottom: 2},
  rowSub: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, lineHeight: 17},
  banner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.08)', borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md},
  bannerText: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20},
  stickyBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)',
  },
  saveBtn: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold,
  },
  saveBtnText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
});
