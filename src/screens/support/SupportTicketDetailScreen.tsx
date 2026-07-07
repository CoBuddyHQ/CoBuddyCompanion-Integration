/**
 * SupportTicketDetailScreen (CPN-169)
 * View and reply to a support ticket.
 */
import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useSupportStore, Message, SupportTicket } from '../../store/slices/supportStore';
import { useTranslation } from "react-i18next";

export function SupportTicketDetailScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const { ticketId = 'TKT-001', isNew = false } = route.params ?? {};

  const ticket = useSupportStore((s) => s.tickets.find((t) => t.id === ticketId));
  const messages = ticket?.messages ?? [];
  const addTicketReply = useSupportStore((s) => s.addTicketReply);

  const [reply, setReply] = useState('');
  const listRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!reply.trim()) {return;}
    addTicketReply(ticketId, reply.trim());
    setReply('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMsg = ({ item }: {item: Message;}) => {
    const isMe = item.from === 'me';
    return (
      <View style={[s.msgRow, isMe && s.msgRowMe]}>
        {!isMe &&
        <View style={s.agentAvatar}>
            <Icon name="headset-mic" size={16} color={colors.gold} />
          </View>
        }
        <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleAgent]}>
          <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{t(item.text)}</Text>
          <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
        </View>
      </View>);

  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={`Ticket #${ticketId}`} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />

      {/* Success banner */}
      {isNew &&
      <View style={s.successBanner}>
          <Icon name="check-circle" size={16} color={colors.safetyGreen} />
          <Text style={s.successText}> {t('support.ticket_submitted_successfully')} </Text>
        </View>
      }

      {/* Ticket info card */}
      <View style={s.infoCard}>
        <View style={s.statusRow}>
          <View style={s.statusBadge}>
            <Text style={s.statusText}>{ticket?.status ?? 'Open'}</Text>
          </View>
          <View style={s.priorityBadge}>
            <Text style={s.priorityText}>{ticket?.priority ?? 'Normal'}  {t('support.priority')} </Text>
          </View>
        </View>
        <Text style={s.infoSubject}>{ticket?.subject ?? 'Subject unavailable'}</Text>
        <Text style={s.infoMeta}>{ticket?.category ?? 'Category'}{t("content.support.SupportTicketDetailScreen.text")}{ticket?.date ?? 'Unknown'}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <FlatList ref={listRef} data={messages} keyExtractor={(item) => item.id}
        renderItem={renderMsg} contentContainerStyle={s.msgList}
        showsVerticalScrollIndicator={false} />

        {/* Reply bar */}
        <View style={s.inputBar}>
          <TextInput style={s.replyInput} value={reply} onChangeText={setReply}
          placeholder={t('support.add_a_reply')} placeholderTextColor={colors.textMuted}
          selectionColor={colors.gold} multiline />
          <TouchableOpacity accessibilityRole="button" style={[s.sendBtn, !reply.trim() && s.sendBtnDisabled]}
          onPress={handleSend} disabled={!reply.trim()} activeOpacity={0.8}>
            <Icon name="send" size={20} color={reply.trim() ? colors.rootBg : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default SupportTicketDetailScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(109,214,165,0.10)', borderBottomWidth: 1,
    borderBottomColor: 'rgba(109,214,165,0.20)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  successText: { fontFamily: fontFamily.interSemiBold, fontSize: 13, color: colors.safetyGreen },
  infoCard: { backgroundColor: colors.cardSurface, marginHorizontal: spacing.lg,
    marginVertical: spacing.sm, borderRadius: radius.xl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statusRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  statusBadge: { backgroundColor: 'rgba(109,214,165,0.12)', borderRadius: radius.full,
    borderWidth: 1, borderColor: 'rgba(109,214,165,0.25)', paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontFamily: fontFamily.interBold, fontSize: 11, color: colors.safetyGreen },
  priorityBadge: { backgroundColor: colors.elevatedSurface, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3 },
  priorityText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },
  infoSubject: { fontFamily: fontFamily.interBold, fontSize: 14, color: colors.textPrimary, marginBottom: 4 },
  infoMeta: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  msgList: { padding: spacing.lg, gap: spacing.md },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  msgRowMe: { flexDirection: 'row-reverse' },
  agentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '75%', borderRadius: radius.xl, padding: spacing.md },
  bubbleAgent: { backgroundColor: colors.cardSurface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  bubbleText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  bubbleTextMe: { color: colors.rootBg },
  bubbleTime: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted, marginTop: 4 },
  bubbleTimeMe: { color: 'rgba(10,18,32,0.60)', textAlign: 'right' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, paddingBottom: spacing.lg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  replyInput: { flex: 1, backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary,
    maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.elevatedSurface }
});