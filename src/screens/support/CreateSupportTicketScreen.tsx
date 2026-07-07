import i18next from "i18next"; /**
* CreateSupportTicketScreen (CPN-168)
* Submit a new support ticket.
*/
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useSupportStore } from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

const CATEGORIES = [{ icon: "payment", label: "content.support.CreateSupportTicketScreen.categories.0.label" }, { icon: "event-busy", label: "content.support.CreateSupportTicketScreen.categories.1.label" }, { icon: "security", label: "content.support.CreateSupportTicketScreen.categories.2.label" }, { icon: "account-balance", label: "content.support.CreateSupportTicketScreen.categories.3.label" }, { icon: "help-outline", label: "content.support.CreateSupportTicketScreen.categories.4.label" }] as any[];






const PRIORITIES = ["Normal", "High", "Urgent"] as any[];
const PRIORITY_COLORS: Record<string, string> = { Normal: colors.textMuted, High: colors.softWarning, Urgent: '#E74C3C' };

export function CreateSupportTicketScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Normal');
  const createTicket = useSupportStore((s) => s.createTicket);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = category.length > 0 && subject.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || submitting) {return;}
    const newId = createTicket(category, subject.trim(), description.trim(), priority);
    navigation.navigate(Routes.SUPPORT_TICKET_DETAIL, { ticketId: newId, isNew: true });
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('support.new_support_ticket')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <Text style={s.sectionLabel}> {t('support.category')} </Text>
          {CATEGORIES.map((cat) =>
          <TouchableOpacity accessibilityRole="button" key={t(cat.label)}
          style={[s.catCard, category === cat.label && s.catCardActive]}
          onPress={() => setCategory(cat.label)} activeOpacity={0.75}>
              <Icon name={cat.icon as any} size={22} color={category === cat.label ? colors.gold : colors.textMuted} />
              <Text style={[s.catText, category === cat.label && s.catTextActive]}>{t(cat.label)}</Text>
              {category === cat.label && <Icon name="check-circle" size={18} color={colors.gold} />}
            </TouchableOpacity>
          )}

          <Text style={[s.sectionLabel, { marginTop: spacing.md }]}> {t('support.subject')} </Text>
          <TextInput style={s.input} value={subject}
          onChangeText={(t) => setSubject(t.slice(0, 100))}
          placeholder={t('support.brief_description_of_your_issue')}
          placeholderTextColor={colors.textMuted} selectionColor={colors.gold} returnKeyType="next" />
          <Text style={s.counter}>{subject.length}/100</Text>

          <Text style={s.sectionLabel}> {t('support.description')} </Text>
          <View style={s.descWrap}>
            <TextInput style={s.descInput} value={description}
            onChangeText={(t) => setDescription(t.slice(0, 1000))}
            placeholder={t('support.explain_your_issue_in_detail')}
            placeholderTextColor={colors.textMuted} multiline selectionColor={colors.gold} textAlignVertical="top" />
            <Text style={s.charCount}>{description.length}/1000</Text>
          </View>

          <Text style={s.sectionLabel}> {t('support.priority')} </Text>
          <View style={s.pillsRow}>
            {PRIORITIES.map((p) =>
            <TouchableOpacity accessibilityRole="button" key={p} style={[s.pill, priority === p && s.pillActive]}
            onPress={() => setPriority(p)} activeOpacity={0.75}>
                <Text style={[s.pillText, priority === p && { color: PRIORITY_COLORS[p] }]}>{p}</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity accessibilityRole="button" style={s.attachRow}
          onPress={() => {}}
          activeOpacity={0.75}>
            <Icon name="attach-file" size={18} color={colors.textMuted} />
            <Text style={s.attachText}> {t('support.add_attachment')} </Text>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btnSubmit, (!canSubmit || submitting) && s.btnDisabled]}
        onPress={handleSubmit} disabled={!canSubmit || submitting} activeOpacity={0.85}>
          <Text style={s.btnSubmitText}>{submitting ? t('common.submitting', { defaultValue: 'Submitting…' }) : t('support.submit_ticket', { defaultValue: 'Submit Ticket' })}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default CreateSupportTicketScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg }, scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  sectionLabel: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  catCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md, marginBottom: spacing.sm },
  catCardActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.07)' },
  catText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary, flex: 1 },
  catTextActive: { color: colors.gold },
  input: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', paddingHorizontal: spacing.md, height: 50,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  counter: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', marginBottom: spacing.md },
  descWrap: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)', marginBottom: spacing.md, overflow: 'hidden' },
  descInput: { padding: spacing.md, minHeight: 150,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  pillsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  pillActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.08)' },
  pillText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textMuted },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: spacing.md },
  attachText: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textSecondary, flex: 1 },
  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  btnSubmit: { height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.45 },
  btnSubmitText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg }
});