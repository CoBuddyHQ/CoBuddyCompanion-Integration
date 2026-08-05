/**
 * SupportCenterScreen (CPN-166)
 * Main help & support hub.
 */
import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import {Routes} from '../../navigation/routes';
import {useSupportStore} from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

const QUICK_HELP = [
  {icon: 'headset-mic',  label: 'Talk to Support',  route: Routes.LIVE_SUPPORT_CHAT},
  {icon: 'description',  label: 'View My Tickets',   route: Routes.SUPPORT_TICKET_DETAIL},
  {icon: 'gavel',        label: 'Dispute Center',    route: Routes.DISPUTE_CENTER},
  {icon: 'menu-book',    label: 'Help Articles',     route: Routes.HELP_ARTICLE},
];

export function SupportCenterScreen(): React.JSX.Element {
  const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
  const articles = useSupportStore(s => s.articles);
  const fetchArticles = useSupportStore(s => s.fetchArticles);
  const fetchTickets = useSupportStore(s => s.fetchTickets);
  const fetchDisputes = useSupportStore(s => s.fetchDisputes);

  useFocusEffect(
    React.useCallback(() => {
      fetchArticles();
      fetchTickets();
      fetchDisputes();
    }, [fetchArticles, fetchTickets, fetchDisputes])
  );

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleQuickHelp = (route: string | null) => {
    if (!route) {return;}
    if (route === Routes.SUPPORT_TICKET_DETAIL) {
      navigation.navigate(Routes.SUPPORT_TICKET_DETAIL, {ticketId: 'TKT-001', isNew: false});
    } else if (route === Routes.HELP_ARTICLE) {
      navigation.navigate(Routes.HELP_ARTICLE, {articleId: 'general', title: 'Help Center'});
    } else {
      navigation.navigate(route as any);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('support.help_support')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Search bar */}
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Icon name="search" size={20} color={focused ? colors.gold : colors.textMuted} />
          <TextInput style={s.searchInput} value={query} onChangeText={setQuery}
            placeholder={t('support.search_help_articles')} placeholderTextColor={colors.textMuted}
            selectionColor={colors.gold} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
          {query.length > 0 && (
            <TouchableOpacity accessibilityRole="button" onPress={() => setQuery('')} hitSlop={{top:8,bottom:8,left:8,right:8}}>
              <Icon name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick help grid */}
        <Text style={s.sectionLabel}> {t('support.quick_help')} </Text>
        <View style={s.grid}>
          {QUICK_HELP.map(item => (
            <TouchableOpacity accessibilityRole="button" key={item.label} style={s.gridCard}
              onPress={() => handleQuickHelp(item.route)} activeOpacity={0.75}>
              <View style={s.gridIconWrap}>
                <Icon name={item.icon as any} size={26} color={colors.gold} />
              </View>
              <Text style={s.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular articles */}
        <Text style={s.sectionLabel}> {t('support.popular_articles')} </Text>
        <View style={s.articlesCard}>
          {articles.map((art, i) => (
            <View key={art.id}>
              <TouchableOpacity accessibilityRole="button" style={s.articleRow}
                onPress={() => navigation.navigate(Routes.HELP_ARTICLE, {articleId: art.id, title: art.title})}
                activeOpacity={0.75}>
                <Icon name="article" size={18} color={colors.textMuted} />
                <Text style={s.articleTitle}>{art.title}</Text>
                <Icon name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {i < articles.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Footer buttons */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnGold}
          onPress={() => navigation.navigate(Routes.CREATE_SUPPORT_TICKET)} activeOpacity={0.85}>
          <Icon name="add" size={18} color={colors.rootBg} style={{marginRight: 8}} />
          <Text style={s.btnGoldText}> {t('support.create_new_ticket')} </Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={s.btnOutline}
          onPress={() => navigation.navigate(Routes.LIVE_SUPPORT_CHAT)} activeOpacity={0.75}>
          <Icon name="headset-mic" size={18} color={colors.gold} style={{marginRight: 8}} />
          <Text style={s.btnOutlineText}> {t('support.live_chat')} </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default SupportCenterScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  scroll: {flex: 1},
  content: {paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  searchBar: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md, height: 48, marginBottom: spacing.lg},
  searchBarFocused: {borderColor: colors.gold},
  searchInput: {flex: 1, fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary},
  sectionLabel: {fontFamily: fontFamily.interBold, fontSize: 11, color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg},
  gridCard: {width: '47%', backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm},
  gridIconWrap: {width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(214,168,79,0.10)', borderWidth: 1, borderColor: 'rgba(214,168,79,0.20)',
    alignItems: 'center', justifyContent: 'center'},
  gridLabel: {fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
  articlesCard: {backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: spacing.md},
  articleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md},
  articleTitle: {fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20},
  divider: {height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: spacing.md},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: spacing.sm},
  btnGold: {height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold},
  btnGoldText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
  btnOutline: {height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    backgroundColor: 'rgba(214,168,79,0.06)'},
  btnOutlineText: {fontFamily: fontFamily.interBold, fontSize: 14, color: colors.gold},
});
