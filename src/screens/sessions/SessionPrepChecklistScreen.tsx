import i18next from "i18next"; /**
* CPN-100 — Session Prep Checklist Screen
* Interactive checklist to help companions prepare before a session.
*/
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackScreenProps } from '@react-navigation/stack';

import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import type { SessionsStackParamList } from '../../types/navigation.types';
import { useTranslation } from "react-i18next";

type Props = StackScreenProps<SessionsStackParamList, typeof Routes.SESSION_PREP_CHECKLIST>;

// ─── Checklist data ───────────────────────────────────────────────────────────

interface CheckItem {
  id: string;
  icon: string;
  title: string;
  detail: string;
  category: 'safety' | 'personal' | 'professional';
}

const CHECKLIST: CheckItem[] = [{ id: "id_proof", icon: "badge", title: "content.sessions.SessionPrepChecklistScreen.checklist.0.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.0.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.0.category" }, { id: "dress_code", icon: "checkroom", title: "content.sessions.SessionPrepChecklistScreen.checklist.1.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.1.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.1.category" }, { id: "phone_battery", icon: "battery-charging-full", title: "content.sessions.SessionPrepChecklistScreen.checklist.2.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.2.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.2.category" }, { id: "arrive_early", icon: "schedule", title: "content.sessions.SessionPrepChecklistScreen.checklist.3.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.3.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.3.category" }, { id: "read_notes", icon: "description", title: "content.sessions.SessionPrepChecklistScreen.checklist.4.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.4.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.4.category" }, { id: "venue_check", icon: "storefront", title: "content.sessions.SessionPrepChecklistScreen.checklist.5.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.5.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.5.category" }, { id: "digital_pass", icon: "qr-code", title: "content.sessions.SessionPrepChecklistScreen.checklist.6.title", detail: "content.sessions.SessionPrepChecklistScreen.checklist.6.detail", category: "content.sessions.SessionPrepChecklistScreen.checklist.6.category" }] as any[];



















































const CATEGORY_COLORS: Record<CheckItem['category'], string> = {
  safety: colors.softWarning,
  personal: colors.infoBlue,
  professional: colors.gold
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function SessionPrepChecklistScreen({ navigation }: Props): React.JSX.Element {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;
  const allDone = doneCount === CHECKLIST.length;
  const progress = Math.round(doneCount / CHECKLIST.length * 100);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('sessions.prep_checklist')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

        {/* ── Motivational banner ── */}
        <View style={styles.banner}>
          <Icon name="star" size={16} color={colors.gold} style={{ flexShrink: 0 }} />
          <Text style={styles.bannerText}>
             {t('sessions.companions_who_prepare_well_get')} <Text style={styles.bannerHighlight}> {t('sessions.higher_ratings')} </Text>  {t('sessions.and_more_tips')} </Text>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{doneCount}  {t('sessions.of')} {CHECKLIST.length}  {t('sessions.items_checked')} </Text>
            <Text style={styles.progressPct}>{progress}{t("content.sessions.SessionPrepChecklistScreen.text")}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` as any }]} />
          </View>
          {allDone &&
          <View style={styles.allDoneRow}>
              <Icon name="check-circle" size={14} color={colors.safetyGreen} />
              <Text style={styles.allDoneText}> {t('sessions.you_re_all_set_great_job')} </Text>
            </View>
          }
        </View>

        {/* ── Checklist items ── */}
        {CHECKLIST.map((item) => {
          const isChecked = !!checked[item.id];
          const catColor = CATEGORY_COLORS[item.category];
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, isChecked && styles.itemChecked]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.75}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}>
              {/* Category dot */}
              <View style={[styles.catDot, { backgroundColor: catColor }]} />

              {/* Icon */}
              <View style={[styles.itemIconWrap, isChecked && styles.itemIconDone]}>
                <Icon name={item.icon as any} size={18}
                color={isChecked ? colors.safetyGreen : colors.gold} />
              </View>

              {/* Text */}
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, isChecked && styles.itemTitleDone]}>
                  {t(item.title)}
                </Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>

              {/* Checkbox */}
              <View style={[styles.checkbox, isChecked && styles.checkboxDone]}>
                {isChecked && <Icon name="check" size={13} color={colors.rootBg} />}
              </View>
            </TouchableOpacity>);

        })}

        {/* ── Category legend ── */}
        <View style={styles.legend}>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) =>
          <View key={cat} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendLabel}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            </View>
          )}
        </View>

        {/* ── Safety Guidelines link ── */}
        <TouchableOpacity
          style={styles.guidelinesLink}
          onPress={() => navigation.navigate(Routes.SAFETY_GUIDELINES)}
          activeOpacity={0.7}
          accessibilityLabel={t("accessibility.review_safety_guidelines")}>
          <Icon name="menu-book" size={14} color={colors.gold} />
          <Text style={styles.guidelinesLinkText}> {t('sessions.review_safety_guidelines')} </Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnGotIt, allDone && styles.btnGotItDone]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          accessibilityLabel={t("accessibility.close_checklist")}>
          <Icon name={allDone ? 'check-circle' : 'arrow-back'}
          size={18} color={allDone ? colors.rootBg : colors.gold}
          style={{ marginRight: 8 }} />
          <Text style={[styles.btnGotItText, allDone && styles.btnGotItTextDone]}>
            {allDone ? t("content.sessions.SessionPrepChecklistScreen.all_done_go_back") : t("content.sessions.SessionPrepChecklistScreen.got_it_go_back")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

export default SessionPrepChecklistScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 24 },

  banner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.10)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.28)',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md
  },
  bannerText: {
    fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.gold,
    lineHeight: 19, flex: 1
  },
  bannerHighlight: { fontFamily: fontFamily.interBold, color: colors.gold },

  progressWrap: {
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: spacing.md
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  progressLabel: { fontFamily: fontFamily.interMedium, fontSize: 13, color: colors.textSecondary },
  progressPct: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  progressBarBg: {
    height: 6, backgroundColor: colors.elevatedSurface,
    borderRadius: radius.full, overflow: 'hidden'
  },
  progressBarFill: { height: 6, backgroundColor: colors.gold, borderRadius: radius.full },
  allDoneRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm
  },
  allDoneText: { fontFamily: fontFamily.interMedium, fontSize: 12, color: colors.safetyGreen },

  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.cardSurface,
    borderRadius: radius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: spacing.sm, position: 'relative', overflow: 'hidden'
  },
  itemChecked: {
    borderColor: 'rgba(109,214,165,0.25)',
    backgroundColor: 'rgba(109,214,165,0.05)'
  },
  catDot: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 2
  },
  itemIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.elevatedSurface,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md, flexShrink: 0
  },
  itemIconDone: {
    backgroundColor: 'rgba(109,214,165,0.12)',
    borderColor: 'rgba(109,214,165,0.30)'
  },
  itemContent: { flex: 1, paddingRight: spacing.sm },
  itemTitle: { fontFamily: fontFamily.interSemiBold, fontSize: 14, color: colors.textPrimary, marginBottom: 3 },
  itemTitleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  itemDetail: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  checkbox: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2
  },
  checkboxDone: { backgroundColor: colors.safetyGreen, borderColor: colors.safetyGreen },

  legend: {
    flexDirection: 'row', justifyContent: 'center',
    gap: spacing.lg, marginTop: spacing.md
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  footer: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  btnGotIt: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.40)',
    backgroundColor: 'rgba(214,168,79,0.08)'
  },
  btnGotItDone: {
    backgroundColor: colors.safetyGreen,
    borderColor: colors.safetyGreen
  },
  btnGotItText: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.gold },
  btnGotItTextDone: { color: colors.rootBg },

  guidelinesLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: spacing.md, marginTop: spacing.sm },
  guidelinesLinkText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.gold }
});