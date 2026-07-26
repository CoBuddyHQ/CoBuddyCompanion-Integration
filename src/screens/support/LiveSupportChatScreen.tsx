import i18next from "i18next"; /**
* LiveSupportChatScreen (CPN-170)
* Real-time chat with a CoBuddy support agent.
*/
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/layout/AppHeader';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { useSupportStore, Message } from '../../store/slices/supportStore';
import { socketService } from '../../services/api/services/socket.service';
import { useTranslation } from "react-i18next";

const QUICK_REPLIES = ["Payment issue", "Session problem", "Account help", "Other"] as any[];

export function LiveSupportChatScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();
  const messages = useSupportStore((s) => s.liveChatMessages);
  const sendLiveChatMessage = useSupportStore((s) => s.sendLiveChatMessage);

  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    socketService.connectSupport('live_chat_default', (msg) => {
      useSupportStore.getState().receiveLiveChatMessage(msg);
    });
    return () => {
      socketService.disconnectSupport();
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) {return;}
    // Emit via socket service
    socketService.sendSupportMessage('live_chat_default', text.trim());
    // Optimistic local update
    sendLiveChatMessage(text.trim());
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMsg = ({ item }: {item: Message;}) => {
    const isMe = item.from === 'me';
    return (
      <View style={[s.msgRow, isMe && s.msgRowMe]}>
        {!isMe && <View style={s.agentAvatar}><Icon name="headset-mic" size={16} color={colors.gold} /></View>}
        <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleAgent]}>
          <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{t(item.text)}</Text>
          <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{item.time}</Text>
        </View>
      </View>);

  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.rootBg} />
      <AppHeader title={t('support.live_support')} showBack
      onBackPress={() => navigation.canGoBack() ? navigation.goBack() : undefined} />
      
      {/* Online status strip */}
      <View style={s.onlineStrip}>
        <View style={s.onlineDot} />
        <Text style={s.onlineText}> {t('support.support_online')} </Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList ref={listRef} data={messages} keyExtractor={(i) => i.id}
        renderItem={renderMsg} contentContainerStyle={s.msgList} showsVerticalScrollIndicator={false}
        ListHeaderComponent={
        <View style={s.chipsRow}>
              {QUICK_REPLIES.map((qr) =>
          <TouchableOpacity accessibilityRole="button" key={qr} style={s.chip} onPress={() => sendMessage(qr)} activeOpacity={0.75}>
                  <Text style={s.chipText}>{qr}</Text>
                </TouchableOpacity>
          )}
            </View>
        } />
        
        <View style={s.waitStrip}>
          <Icon name="schedule" size={13} color={colors.textMuted} />
          <Text style={s.waitText}> {t('support.estimated_wait_2_mins')} </Text>
        </View>
        <View style={s.inputBar}>
          <TextInput style={s.textInput} value={input} onChangeText={setInput}
          placeholder={t('support.type_a_message')} placeholderTextColor={colors.textMuted}
          selectionColor={colors.gold} multiline />
          <TouchableOpacity accessibilityRole="button" style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
          onPress={() => sendMessage(input)} disabled={!input.trim()} activeOpacity={0.8}>
            <Icon name="send" size={20} color={input.trim() ? colors.rootBg : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}
export default LiveSupportChatScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },
  onlineStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(109,214,165,0.15)',
    backgroundColor: 'rgba(109,214,165,0.05)' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.safetyGreen },
  onlineText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.safetyGreen },
  msgList: { padding: spacing.lg, gap: spacing.md },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: 'rgba(214,168,79,0.30)', backgroundColor: 'rgba(214,168,79,0.07)' },
  chipText: { fontFamily: fontFamily.interSemiBold, fontSize: 12, color: colors.gold },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  msgRowMe: { flexDirection: 'row-reverse' },
  agentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.25)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { maxWidth: '75%', borderRadius: radius.xl, padding: spacing.md },
  bubbleAgent: { backgroundColor: colors.cardSurface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  bubbleText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  bubbleTextMe: { color: colors.rootBg },
  bubbleTime: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted, marginTop: 4 },
  bubbleTimeMe: { color: 'rgba(10,18,32,0.60)', textAlign: 'right' },
  waitStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  waitText: { fontFamily: fontFamily.interRegular, fontSize: 12, color: colors.textMuted },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, paddingBottom: spacing.lg,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  textInput: { flex: 1, backgroundColor: colors.cardSurface, borderRadius: radius.xl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.elevatedSurface }
});