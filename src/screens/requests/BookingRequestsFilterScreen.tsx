import i18next from "i18next";import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import AppHeader from '../../components/layout/AppHeader';
import { useRequestStore, FilterState, DEFAULT_FILTER } from '../../store/slices/requestStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { fontFamily } from '../../theme/typography';

const EXPERIENCE_CATEGORIES = [{ id: "cafe_conversation", label: "content.requests.BookingRequestsFilterScreen.experience_categories.0.label", icon: "local-cafe" }, { id: "city_walk", label: "content.requests.BookingRequestsFilterScreen.experience_categories.1.label", icon: "directions-walk" }, { id: "art_culture", label: "content.requests.BookingRequestsFilterScreen.experience_categories.2.label", icon: "palette" }, { id: "food_experience", label: "content.requests.BookingRequestsFilterScreen.experience_categories.3.label", icon: "restaurant" }, { id: "business_networking", label: "content.requests.BookingRequestsFilterScreen.experience_categories.4.label", icon: "business-center" }, { id: "movies", label: "content.requests.BookingRequestsFilterScreen.experience_categories.5.label", icon: "movie" }, { id: "wellness_walk", label: "content.requests.BookingRequestsFilterScreen.experience_categories.6.label", icon: "self-improvement" }, { id: "bookstore", label: "content.requests.BookingRequestsFilterScreen.experience_categories.7.label", icon: "menu-book" }] as any[];










export function BookingRequestsFilterScreen() {const { t } = useTranslation();
  const navigation = useNavigation();

  const { storeFilter, setStoreFilter, resetStoreFilter } = useRequestStore(
    useShallow((s) => ({
      storeFilter: s.activeFilter,
      setStoreFilter: s.setFilter,
      resetStoreFilter: s.resetFilter
    }))
  );

  const [localFilter, setLocalFilter] = useState<FilterState>(storeFilter || DEFAULT_FILTER);

  const handleReset = () => {
    setLocalFilter(DEFAULT_FILTER);
    resetStoreFilter();
    navigation.goBack();
  };

  const handleApply = () => {
    setStoreFilter(localFilter);
    navigation.goBack();
  };

  const toggleCategory = (catId: string) => {
    setLocalFilter((prev) => {
      if (prev.categories.includes(catId)) {
        return { ...prev, categories: prev.categories.filter((c) => c !== catId) };
      }
      return { ...prev, categories: [...prev.categories, catId] };
    });
  };

  // Count active filters
  let activeCount = 0;
  if (localFilter.status !== 'all') activeCount++;
  if (localFilter.minEarning > 0) activeCount++;
  if (localFilter.categories.length > 0) activeCount += localFilter.categories.length;
  if (localFilter.sortBy !== 'newest') activeCount++;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      
      <AppHeader
        title={t("application.filter_requests")}
        showBack={true}
        rightText={t("application.reset")}
        onRightTextPress={handleReset} />
      

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ── SORT BY SECTION ── */}
        <Text style={styles.sectionLabel}>{t("application.sort_by")}</Text>
        <View style={styles.radioGroup}>
          {(['newest', 'expiring_soon', 'highest_earning'] as const).map((sortType) => {
            const isSelected = localFilter.sortBy === sortType;
            let label = '';
            let iconName = '';

            if (sortType === 'newest') {
              label = 'Newest First';
              iconName = 'sort';
            } else if (sortType === 'expiring_soon') {
              label = 'Expiring Soon';
              iconName = 'timer';
            } else {
              label = 'Highest Earning';
              iconName = 'attach-money';
            }

            return (
              <TouchableOpacity
                key={sortType}
                style={styles.radioRow}
                onPress={() => setLocalFilter((p) => ({ ...p, sortBy: sortType }))}
                activeOpacity={0.7}>
                
                <View style={styles.radioLeft}>
                  <Icon name={iconName} size={20} color={colors.textMuted} />
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {label}
                  </Text>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <Icon name="check" size={14} color={colors.rootBg} />}
                </View>
              </TouchableOpacity>);

          })}
        </View>

        {/* ── STATUS SECTION ── */}
        <Text style={styles.sectionLabel}>{t("application.request_status")}</Text>
        <View style={styles.radioGroup}>
          {(['all', 'pending', 'counter_proposed', 'expired'] as const).map((status) => {
            const isSelected = localFilter.status === status;
            let label = '';
            let iconName = '';

            if (status === 'all') {
              label = 'All Requests';
              iconName = 'all-inbox';
            } else if (status === 'pending') {
              label = 'Pending';
              iconName = 'schedule';
            } else if (status === 'counter_proposed') {
              label = 'Countered';
              iconName = 'compare-arrows';
            } else {
              label = 'Expired';
              iconName = 'event-busy';
            }

            return (
              <TouchableOpacity
                key={status}
                style={styles.radioRow}
                onPress={() => setLocalFilter((p) => ({ ...p, status }))}
                activeOpacity={0.7}>
                
                <View style={styles.radioLeft}>
                  <Icon name={iconName} size={20} color={colors.textMuted} />
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {label}
                  </Text>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <Icon name="check" size={14} color={colors.rootBg} />}
                </View>
              </TouchableOpacity>);

          })}
        </View>

        {/* ── EXPERIENCE TYPE SECTION ── */}
        <Text style={styles.sectionLabel}>{t("application.experience_type")}</Text>
        <View style={styles.grid}>
          {EXPERIENCE_CATEGORIES.map((cat) => {
            const isSelected = localFilter.categories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => toggleCategory(cat.id)}
                activeOpacity={0.7}>
                
                <Icon
                  name={cat.icon}
                  size={24}
                  color={isSelected ? colors.gold : colors.textMuted} />
                
                <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                  {t(cat.label)}
                </Text>
              </TouchableOpacity>);

          })}
        </View>

        {/* ── MINIMUM EARNING SECTION ── */}
        <Text style={styles.sectionLabel}>{t("application.minimum_earning")}</Text>
        
        {/* Part A: Manual Input */}
        <View style={styles.earningInputContainer}>
          <Text style={styles.earningPrefix}>{t("content.requests.BookingRequestsFilterScreen.text")}</Text>
          <TextInput
            style={styles.earningInput}
            keyboardType="numeric"
            placeholder={t("application.enter_amount")}
            placeholderTextColor={colors.textMuted}
            value={localFilter.minEarning ? localFilter.minEarning.toString() : ''}
            onChangeText={(text) => {
              const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
              setLocalFilter((p) => ({ ...p, minEarning: isNaN(num) ? 0 : num }));
            }} />
          
        </View>

        {/* Part B: Quick Select Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.earningQuickBar}>
          
          {[0, 500, 1000, 2000, 5000].map((val) => {
            const isSelected = localFilter.minEarning === val;
            const label = val === 0 ? t("content.requests.BookingRequestsFilterScreen.any") : `₹${val.toLocaleString('en-IN')}`;

            return (
              <TouchableOpacity
                key={val}
                style={[styles.earningPill, isSelected && styles.earningPillSelected]}
                onPress={() => setLocalFilter((p) => ({ ...p, minEarning: val }))}
                activeOpacity={0.7}>
                
                <Text style={[styles.earningPillText, isSelected && styles.earningPillTextSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>);

          })}
        </ScrollView>

      </ScrollView>

      {/* ── FIXED BOTTOM BUTTON ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>
            {activeCount > 0 ? `Apply Filters (${activeCount} active)` : t("content.requests.BookingRequestsFilterScreen.apply_filters")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.rootBg
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  sectionLabel: {
    fontFamily: fontFamily.interBold,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 28,
    marginBottom: 12
  },
  radioGroup: {
    marginBottom: 8
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  radioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  radioLabel: {
    fontFamily: fontFamily.interMedium,
    fontSize: 15,
    color: colors.textPrimary
  },
  radioLabelSelected: {
    color: colors.gold,
    fontFamily: fontFamily.interSemiBold
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.gold
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  card: {
    width: '48%',
    backgroundColor: colors.elevatedSurface || '#1A1A1A', // fallback if elevatedSurface missing
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 16,
    alignItems: 'center',
    gap: 8
  },
  cardSelected: {
    backgroundColor: 'rgba(214,168,79,0.08)',
    borderColor: colors.gold
  },
  cardText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 14,
    color: colors.textPrimary
  },
  cardTextSelected: {
    fontFamily: fontFamily.interBold,
    color: colors.gold
  },
  earningInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(214,168,79,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 64,
    marginBottom: 16
  },
  earningPrefix: {
    fontFamily: fontFamily.interBold,
    fontSize: 24,
    color: colors.gold,
    marginRight: 8
  },
  earningInput: {
    flex: 1,
    fontFamily: fontFamily.interBold,
    fontSize: 24,
    color: colors.gold
  },
  earningQuickBar: {
    paddingRight: 20,
    gap: 8
  },
  earningPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  earningPillSelected: {
    backgroundColor: 'rgba(214,168,79,0.15)',
    borderWidth: 1,
    borderColor: colors.gold
  },
  earningPillText: {
    fontFamily: fontFamily.interMedium,
    fontSize: 14,
    color: colors.textMuted
  },
  earningPillTextSelected: {
    fontFamily: fontFamily.interBold,
    color: colors.gold
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.rootBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  applyBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    fontFamily: fontFamily.interBold,
    fontSize: 16,
    color: colors.rootBg
  }
});