import i18next from "i18next"; /**
* PostSessionNotesScreen (CPN-118)
* Private session notes with mood selector and tags — visible only to companion.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { useSessionStore } from '../../store/slices/sessionStore';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useTranslation } from "react-i18next";

const MAX_CHARS = 500;
const MOODS = ["\uD83D\uDE0A", "\uD83D\uDE10", "\uD83D\uDE14", "\uD83D\uDE24", "\uD83E\uDD29"] as any[];
const TAGS = ["Great customer", "Repeat likely", "Handle with care", "Safety concern"] as any[];

export function PostSessionNotesScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const session = useSessionStore((s) =>
  [...s.upcomingSessions, ...(s.activeSession ? [s.activeSession] : []), ...s.sessionHistory].
  find((ses) => ses.sessionId === sessionId) ?? null);
  const saveNotes = useSessionStore((s) => s.saveNotes);
  const customerName = session?.customer?.displayInitials ?? '—';
  const activityLabel = session?.category ? session.category.replace(/_/g, ' ') : '—';
  const durationLabel = session?.durationMinutes ? `${session.durationMinutes} min` : '—';
  const earningsLabel = session?.estimatedTotal != null ?
  `₹${session.estimatedTotal.toLocaleString('en-IN')}` : '—';

  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) =>
  setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const goToDashboard = () => {
    navigation.navigate('MainApp', { screen: 'DashboardTab' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNotes(sessionId, notes.trim(), true);
    } catch (_) {
      // Notes are non-blocking — navigate regardless
    } finally {
      setSaving(false);
      goToDashboard();
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.session_notes')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Privacy note */}
        <View style={s.privacyBanner}>
          <Text style={s.privacyText}> {t('sessions.these_notes_are_private_and_only_visible_to_you')} </Text>
        </View>

        {/* Session summary */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}> {t('sessions.session_summary')} </Text>
          <View style={s.summaryGrid}>
            {[
            { label: t("content.sessions.PostSessionNotesScreen.customer"), value: customerName },
            { label: t("content.sessions.PostSessionNotesScreen.date"), value: 'Today' },
            { label: t("content.sessions.PostSessionNotesScreen.activity"), value: activityLabel },
            { label: t("content.sessions.PostSessionNotesScreen.duration"), value: durationLabel },
            { label: t("content.sessions.PostSessionNotesScreen.earnings"), value: earningsLabel }].
            map((row) =>
            <View key={t(row.label)} style={s.summaryRow}>
                <Text style={s.summaryLabel}>{t(row.label)}</Text>
                <Text style={s.summaryValue}>{row.value}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Notes input */}
        <Text style={s.sectionTitle}> {t('sessions.your_notes')} </Text>
        <TextInput
          style={s.notesInput}
          value={notes}
          onChangeText={(t) => setNotes(t.slice(0, MAX_CHARS))}
          placeholder={t('sessions.how_did_the_session_go_any_memorable_moments_or_things_to_remember')}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={MAX_CHARS}
          selectionColor={colors.gold}
          textAlignVertical="top" />
        
        <Text style={s.charCount}>{notes.length}/{MAX_CHARS}</Text>

        {/* Mood selector */}
        <Text style={s.sectionTitle}> {t('sessions.overall_mood')} </Text>
        <View style={s.moodRow}>
          {MOODS.map((emoji, i) =>
          <TouchableOpacity accessibilityRole="button"
            key={i}
            style={[s.moodBtn, mood === i && s.moodBtnActive]}
            onPress={() => setMood(i === mood ? null : i)}
            activeOpacity={0.75}>
              <Text style={s.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tags */}
        <Text style={s.sectionTitle}> {t('sessions.quick_tags')} </Text>
        <View style={s.tagsRow}>
          {TAGS.map((t) =>
          <TouchableOpacity accessibilityRole="button"
            key={t}
            style={[s.tag, tags.includes(t) && s.tagActive]}
            onPress={() => toggleTag(t)}
            activeOpacity={0.75}>
              <Text style={[s.tagText, tags.includes(t) && s.tagTextActive]}>{t}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={[s.btnSave, saving && s.btnDisabled]}
        onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          <Text style={s.btnSaveText}>{saving ? t("content.sessions.PostSessionNotesScreen.saving") : t("content.sessions.PostSessionNotesScreen.save_notes")}</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={goToDashboard}
        activeOpacity={0.6} style={s.skipBtn}>
          <Text style={s.skipText}> {t('sessions.skip')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}
export default PostSessionNotesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  privacyBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.18)',
    paddingHorizontal: spacing.md, paddingVertical: 8, marginBottom: spacing.md
  },
  privacyText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },

  summaryCard: { backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.lg },
  summaryTitle: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold,
    textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: spacing.md },
  summaryGrid: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  summaryLabel: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted },
  summaryValue: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textPrimary },

  sectionTitle: { fontFamily: fontFamily.interBold, fontSize: 12, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },

  notesInput: { backgroundColor: colors.cardSurface, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    padding: spacing.md, minHeight: 150,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, lineHeight: 22 },
  charCount: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted,
    textAlign: 'right', marginTop: 4, marginBottom: spacing.lg },

  moodRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.cardSurface },
  moodBtnActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  moodEmoji: { fontSize: 22 },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.cardSurface },
  tagActive: { borderColor: colors.gold, backgroundColor: 'rgba(214,168,79,0.10)' },
  tagText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted },
  tagTextActive: { color: colors.gold },

  bar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.xs },
  btnSave: { height: 52, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold },
  btnDisabled: { opacity: 0.6 },
  btnSaveText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg },
  skipBtn: { alignItems: 'center', paddingVertical: spacing.sm },
  skipText: { fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textMuted }
});