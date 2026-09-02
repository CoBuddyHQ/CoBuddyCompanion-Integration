/**
 * ReportCustomerScreen (CPN-133)
 * Report a customer for policy violations.
 */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import { useTranslation } from "react-i18next";
import { SafetyService } from '../../services/api/services/index';
import { AdminConfig } from '../../config/adminValues';



export function ReportCustomerScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
   
  const route = useRoute<any>();
  const customerName = typeof route.params?.customerName === 'string' ? route.params.customerName : 'Customer';
  const customerId = typeof route.params?.customerId === 'string' ? route.params.customerId : 'CUST_PLACEHOLDER';

  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [alsoBlock,   setAlsoBlock]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const initials = customerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const canSubmit = category.length > 0 && description.trim().length > 10;


  const handleSubmit = async () => {
    if (!canSubmit || submitting) {return;}
    setSubmitting(true);
    try {
      await SafetyService.reportCustomer(customerId, {
        reason: category,
        details: description
      });
      if (alsoBlock) {
        await SafetyService.blockCustomer(customerId, { reason: category });
      }
      setSubmitting(false);
      navigation.navigate(Routes.INCIDENT_SUBMITTED, {type: 'report'});
    } catch (e) {
      console.warn('Report failed:', e);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.report_customer')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Customer card */}
        <View style={s.customerCard}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials || 'C'}</Text></View>
          <Text style={s.customerName}>{customerName}</Text>
        </View>

        {/* Report categories */}
        <Text style={s.sectionLabel}> {t('safety.report_category')} </Text>
        {AdminConfig.incidentTypes.map(cat => (
          <TouchableOpacity accessibilityRole="button" key={cat.code}
            style={[s.categoryCard, category === cat.code && s.categoryCardActive]}
            onPress={() => setCategory(cat.code)} activeOpacity={0.75}>
            <Icon name={((cat as any).icon ?? "report") as any} size={22}
              color={category === cat.code ? colors.gold : colors.textMuted} />
            <Text style={[s.categoryText, category === cat.code && s.categoryTextActive]}>
              {cat.label}
            </Text>
            {category === cat.code &&
              <Icon name="radio-button-on" size={18} color={colors.gold} />}
          </TouchableOpacity>
        ))}

        {/* Description */}
        <Text style={[s.sectionLabel, {marginTop: spacing.md}]}> {t('safety.description')} </Text>
        <View style={s.descWrap}>
          <TextInput
            style={s.descInput}
            value={description}
            onChangeText={t => setDescription(t.slice(0, 500))}
            placeholder={t('safety.describe_what_happened_in_detail')}
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={5}
            selectionColor={colors.gold}
            textAlignVertical="top"
          />
          <Text style={s.charCount}>{description.length}/500</Text>
        </View>

        {/* Attach evidence */}
        <TouchableOpacity accessibilityRole="button" style={s.attachRow}
          onPress={() => navigation.navigate(Routes.INCIDENT_EVIDENCE_UPLOAD)}
          activeOpacity={0.75}>
          <Icon name="attach-file" size={18} color={colors.textMuted} />
          <Text style={s.attachText}> {t('safety.attach_evidence')} </Text>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Also block */}
        <TouchableOpacity accessibilityRole="button" style={s.checkRow}
          onPress={() => setAlsoBlock(b => !b)} activeOpacity={0.75}>
          <Icon name={alsoBlock ? 'check-circle' : 'radio-button-unchecked'} size={22}
            color={alsoBlock ? colors.gold : colors.textMuted} />
          <Text style={s.checkText}> {t('safety.also_block_this_customer')} </Text>
        </TouchableOpacity>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Footer confidential strip + submit */}
      <View style={s.bar}>
        <View style={s.confidentialRow}>
          <Icon name="lock" size={13} color={colors.textMuted} />
          <Text style={s.confidentialText}> {t('safety.report_is_confidential')} </Text>
        </View>
        <TouchableOpacity accessibilityRole="button"
          style={[s.btnSubmit, (!canSubmit || submitting) && s.btnDisabled]}
          onPress={handleSubmit} disabled={!canSubmit || submitting} activeOpacity={0.85}>
          <Icon name="flag" size={18} color="#fff" style={{marginRight: 8}} />
          <Text style={s.btnSubmitText}>{submitting ? 'Submitting…' : 'Submit Report'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default ReportCustomerScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  customerCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg},
  avatar: {width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  avatarText: {fontFamily: fontFamily.interBold, fontSize: 16, color: colors.gold},
  customerName: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary, flex: 1},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  categoryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm},
  categoryCardActive: {borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.07)'},
  categoryText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary, flex: 1},
  categoryTextActive: {color: colors.gold},
  descWrap: {backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', marginBottom: spacing.md, overflow: 'hidden'},
  descInput: {padding: spacing.md, minHeight: 120,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary},
  charCount: {fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', paddingHorizontal: spacing.md, paddingBottom: spacing.sm},
  attachRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md, marginBottom: spacing.sm},
  attachText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary, flex: 1},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md},
  checkText: {fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm},
  confidentialRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5},
  confidentialText: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted},
  btnSubmit: {height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: '#C0392B'},
  btnDisabled: {opacity: 0.45},
  btnSubmitText: {fontFamily: fontFamily.interBold, fontSize: 15, color: '#fff'},
});
