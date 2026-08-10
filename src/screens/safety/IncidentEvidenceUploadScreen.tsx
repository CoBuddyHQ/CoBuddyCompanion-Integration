/**
 * IncidentEvidenceUploadScreen (CPN-135)
 * Upload photo/document evidence for an incident report.
 */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import {colors} from '../../theme/colors';
import {fontFamily} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {radius} from '../../theme/radius';
import { useTranslation } from "react-i18next";
import { UploadsService } from '../../services/api/services/uploads.service';

const MAX_FILES = 6;

interface FileSlot {id: string; filled: boolean;}

const INITIAL_SLOTS: FileSlot[] = [
  {id: '1', filled: true},
  {id: '2', filled: true},
  {id: '3', filled: false},
  {id: '4', filled: false},
  {id: '5', filled: false},
  {id: '6', filled: false},
];

export function IncidentEvidenceUploadScreen(): React.JSX.Element {
    const { t } = useTranslation();
   
  const navigation = useNavigation<any>();
  const [slots, setSlots] = useState<FileSlot[]>(INITIAL_SLOTS);

  const uploadedCount = slots.filter(s => s.filled).length;

  const handleAdd = async (id: string) => {
    try {
      const file = {
        uri: 'file:///data/user/0/com.cobuddycompanion/cache/evidence_screenshot.jpg',
        type: 'image/jpeg',
        name: `evidence_${Date.now()}.jpg`,
      };
      const res = await UploadsService.uploadEvidence(file);
      setSlots(prev => prev.map(sl => sl.id === id ? {...sl, filled: true, uri: res.url} : sl));
    } catch (e: any) {
      Alert.alert(t('alerts.error'), e?.message || 'Failed to upload evidence');
    }
  };

  const handleRemove = (id: string) => {
    setSlots(prev => prev.map(sl => sl.id === id ? {...sl, filled: false} : sl));
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('safety.add_evidence')} showBack
        onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      <View style={s.body}>
        {/* Info banner */}
        <View style={s.infoBanner}>
          <Icon name="info" size={16} color={colors.gold} />
          <Text style={s.infoText}>
             {t('safety.upload_photos_or_screenshots_to_support_your_report')} </Text>
        </View>

        {/* Counter */}
        <Text style={s.counter}>{uploadedCount}  {t('safety.of')} {MAX_FILES}  {t('safety.files_added')} </Text>

        {/* Upload grid */}
        <View style={s.grid}>
          {slots.map(slot => (
            <View key={slot.id} style={s.cell}>
              {slot.filled ? (
                /* Filled slot */
                <View style={s.filledCell}>
                  <Icon name="image" size={32} color="rgba(255,255,255,0.25)" />
                  <TouchableOpacity accessibilityRole="button" style={s.removeBtn}
                    onPress={() => handleRemove(slot.id)} hitSlop={{top: 4, bottom: 4, left: 4, right: 4}}>
                    <Icon name="cancel" size={20} color="#E74C3C" />
                  </TouchableOpacity>
                </View>
              ) : (
                /* Empty slot */
                <TouchableOpacity accessibilityRole="button" style={s.emptyCell} onPress={() => handleAdd(slot.id)} activeOpacity={0.7}>
                  <Icon name="add-circle-outline" size={30} color={colors.gold} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* File type strip */}
        <View style={s.fileTypeRow}>
          <Icon name="description" size={14} color={colors.textMuted} />
          <Text style={s.fileTypeText}> {t('safety.jpg_png_pdf_up_to_10mb_each')} </Text>
        </View>
      </View>

      {/* Done button */}
      <View style={s.bar}>
        <TouchableOpacity accessibilityRole="button" style={s.btnDone}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
          activeOpacity={0.85}>
          <Icon name="check" size={18} color={colors.rootBg} style={{marginRight: 8}} />
          <Text style={s.btnDoneText}>{t('common.done')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
export default IncidentEvidenceUploadScreen;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.rootBg},
  body: {flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md},
  infoBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: 'rgba(214,168,79,0.07)', borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.22)', padding: spacing.md, marginBottom: spacing.lg},
  infoText: {fontFamily: fontFamily.interRegular, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 19},
  counter: {fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.textMuted,
    marginBottom: spacing.md},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  cell: {width: '31%', aspectRatio: 1},
  filledCell: {flex: 1, backgroundColor: colors.elevatedSurface, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center', position: 'relative'},
  removeBtn: {position: 'absolute', top: -6, right: -6,
    backgroundColor: colors.rootBg, borderRadius: 10},
  emptyCell: {flex: 1, borderRadius: radius.lg,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.35)',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(214,168,79,0.03)'},
  fileTypeRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.lg},
  fileTypeText: {fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted},
  bar: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md, paddingBottom: spacing.xl,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'},
  btnDone: {height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.gold},
  btnDoneText: {fontFamily: fontFamily.interBold, fontSize: 15, color: colors.rootBg},
});
