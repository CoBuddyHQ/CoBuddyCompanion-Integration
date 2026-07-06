import i18next from "i18next";
/**
 * InSessionChatScreen (CPN-108) — Premium redesign
 * Real-time chat UI with custom header, avatar, online status, and call shortcut.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from
'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Routes } from '../../navigation/routes';
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  sender: 'companion' | 'customer';
  time: string;
  status?: 'sent' | 'read';
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MESSAGES: Message[] = [
{ id: '1', sender: 'customer', text: 'Hey! Just reached the entrance, are you here yet?', time: '3:42 PM', status: 'read' },
{ id: '2', sender: 'companion', text: 'Yes! Coming from the metro side, 2 minutes away 😊', time: '3:43 PM', status: 'read' },
{ id: '3', sender: 'customer', text: 'No rush at all! I\'ll wait near the coffee counter.', time: '3:43 PM', status: 'read' },
{ id: '4', sender: 'companion', text: 'Perfect — I can see the sign now. See you in a sec!', time: '3:44 PM', status: 'read' },
{ id: '5', sender: 'customer', text: 'I\'m in a light blue jacket btw 🙂', time: '3:44 PM', status: 'read' }];


function nowTime(): string {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? i18next.t("content.sessions.InSessionChatScreen.pm") : i18next.t("content.sessions.InSessionChatScreen.am");
  return `${h % 12 || 12}:${m} ${ampm}`;
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

const Bubble: React.FC<{msg: Message;}> = ({ msg }) => {
  const isMe = msg.sender === 'companion';
  return (
    <View style={[s.bubbleWrap, isMe && s.bubbleWrapRight]}>
      {!isMe && <View style={s.customerDot} />}
      <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
        <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>{i18next.t(msg.text)}</Text>
        <View style={s.bubbleMeta}>
          <Text style={[s.bubbleTime, isMe && s.bubbleTimeMe]}>{msg.time}</Text>
          {isMe &&
          <Icon
            name={msg.status === 'read' ? 'done-all' : 'done'}
            size={12}
            color={msg.status === 'read' ? colors.safetyGreen : 'rgba(0,0,0,0.40)'}
            style={{ marginLeft: 3 }} />

          }
        </View>
      </View>
    </View>);

};

// ─── Screen ───────────────────────────────────────────────────────────────────

export function InSessionChatScreen(): React.JSX.Element {
  const { t } = useTranslation();

  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const sessionId: string = route.params?.sessionId ?? '';
  const customerName: string = route.params?.customerName ?? 'Customer';
  const initials = customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  // Scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 120);
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text) {return;}
    setMessages((prev) => [
    ...prev,
    { id: String(Date.now()), sender: 'companion', text, time: nowTime(), status: 'sent' }]
    );
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2E" />

      {/* ── Custom Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() ? navigation.goBack() : undefined}
          style={s.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>{initials}</Text>
          <View style={s.onlineDot} />
        </View>

        {/* Name + status */}
        <View style={s.headerInfo}>
          <Text style={s.headerName} numberOfLines={1}>{customerName}</Text>
          <Text style={s.headerStatus}> {i18next.t('sessions.online')} </Text>
        </View>

        {/* Call shortcut */}
        <TouchableOpacity
          style={s.callBtn}
          onPress={() => navigation.navigate(Routes.IN_SESSION_CALL, { sessionId, customerName })}
          accessibilityLabel={i18next.t("accessibility.call_customer")}>
          <Icon name="call" size={18} color={colors.gold} />
        </TouchableOpacity>
      </View>

      {/* ── Safety banner ── */}
      <View style={s.safetyPill}>
        <Icon name="lock" size={11} color={colors.gold} />
        <Text style={s.safetyPillText}> {i18next.t('sessions.this_chat_is_monitored_for_your_safety')} </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>

        {/* ── Messages ── */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble msg={item} />}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })} />
        

        {/* ── Input bar ── */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.attachBtn} accessibilityLabel={i18next.t("accessibility.attach")}>
            <Icon name="add-circle-outline" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder={i18next.t('sessions.type_a_message')}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
            selectionColor={colors.gold} />
          

          <TouchableOpacity
            style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
            accessibilityLabel={i18next.t("accessibility.send_message")}>
            <Icon name="send" size={17} color={input.trim() ? colors.rootBg : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>);

}

export default InSessionChatScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.rootBg },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#0D1B2E',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(214,168,79,0.15)'
  },
  backBtn: { padding: 4, flexShrink: 0 },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(214,168,79,0.18)',
    borderWidth: 2, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative'
  },
  headerAvatarText: { fontFamily: fontFamily.interBold, fontSize: 13, color: colors.gold },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.safetyGreen,
    borderWidth: 2, borderColor: '#0D1B2E'
  },
  headerInfo: { flex: 1 },
  headerName: { fontFamily: fontFamily.interBold, fontSize: 15, color: colors.textPrimary },
  headerStatus: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.safetyGreen, marginTop: 1 },
  callBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(214,168,79,0.12)',
    borderWidth: 1, borderColor: 'rgba(214,168,79,0.30)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },

  // Safety pill
  safetyPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    backgroundColor: 'rgba(214,168,79,0.07)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(214,168,79,0.10)',
    paddingVertical: 6
  },
  safetyPillText: { fontFamily: fontFamily.interRegular, fontSize: 11, color: colors.textMuted },

  // Message list
  listContent: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm, flexGrow: 1 },

  // Bubbles
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.sm },
  bubbleWrapRight: { justifyContent: 'flex-end' },
  customerDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.textMuted, marginRight: 6, marginBottom: 6, flexShrink: 0
  },
  bubble: {
    maxWidth: '76%', borderRadius: radius.xl, paddingHorizontal: 14, paddingVertical: 10
  },
  bubbleThem: {
    backgroundColor: '#162336',
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  bubbleMe: {
    backgroundColor: colors.gold,
    borderBottomRightRadius: 4
  },
  bubbleText: { fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  bubbleTextMe: { color: colors.rootBg },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
  bubbleTime: { fontFamily: fontFamily.interRegular, fontSize: 10, color: colors.textMuted },
  bubbleTimeMe: { color: 'rgba(0,0,0,0.40)' },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, paddingBottom: spacing.xl,
    backgroundColor: '#0D1B2E',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)'
  },
  attachBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  input: {
    flex: 1, backgroundColor: '#162336',
    borderRadius: radius.xxl,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md, paddingVertical: 9,
    fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.textPrimary,
    maxHeight: 100
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  sendBtnDisabled: { backgroundColor: colors.elevatedSurface }
});