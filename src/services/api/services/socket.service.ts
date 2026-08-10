/**
 * CoBuddy Companion — Enhanced Socket.IO Service
 * Manages 3 namespaces:
 *  - /           Global app socket (booking requests, notifications)
 *  - /sessions   Active session (chat, live location, typing indicators)
 *  - /support    Support ticket live chat
 *
 * Features:
 *  - Auto-reconnect with exponential backoff
 *  - Offline message queue
 *  - Connection status tracking
 *  - JWT auth injection
 */

import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../../store/slices/authStore';
import { useNotificationStore } from '../../../store/slices/notificationStore';
import { ENV } from '../../../config/env';
import type { AppNotification } from '../../../store/types/store.types';

const SOCKET_URL = ENV.SOCKET_URL;

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface ChatMessage {
  senderId: string;
  senderType: 'companion' | 'customer' | 'support';
  text: string;
  attachmentUrl?: string;
  timestamp: string;
}

// ─── Message Queue for offline support ────────────────────────────────────────
interface QueuedMessage {
  namespace: 'session' | 'support';
  event: string;
  payload: any;
}

class SocketService {
  private sessionSocket: Socket | null = null;
  private supportSocket: Socket | null = null;
  private appSocket: Socket | null = null;

  private sessionStatus: ConnectionStatus = 'disconnected';
  private supportStatus: ConnectionStatus = 'disconnected';

  private messageQueue: QueuedMessage[] = [];
  private currentSessionId: string | null = null;

  // Callbacks
  private onSessionMessage: ((msg: ChatMessage) => void) | null = null;
  private onTypingIndicator: ((data: { isTyping: boolean; userId: string }) => void) | null = null;
  private onLocationUpdate: ((data: { lat: number; lng: number }) => void) | null = null;
  private onSupportMessage: ((msg: ChatMessage) => void) | null = null;

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private makeSocketOptions() {
    return {
      auth: { token: this.getToken() },
      transports: ['polling', 'websocket'] as any,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    };
  }

  // ─── App Socket (Global Notifications & Booking Alerts) ─────────────────────

  connectApp(): void {
    if (this.appSocket?.connected) return;
    const token = this.getToken();
    if (!token) return;

    this.appSocket = io(SOCKET_URL, this.makeSocketOptions());

    this.appSocket.on('connect', () => {
      console.log('[Socket] App connected');
    });

    this.appSocket.on('disconnect', (reason) => {
      console.log('[Socket] App disconnected:', reason);
    });

    // New booking request — add to notification store
    this.appSocket.on('new_booking_request', (data: any) => {
      const reqId = data?.requestId || data?.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      console.log('[Socket] New booking request received:', reqId);
      const notification: AppNotification = {
        id: `req-${reqId}`,
        notificationId: `req-${reqId}`,
        category: 'booking',
        title: 'New Booking Request',
        body: `New request from ${data?.customerInitials ?? 'a customer'}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/requests/${reqId}`,
      } as any;
      useNotificationStore.getState().addNotification(notification);
    });

    // Real-time notification push
    this.appSocket.on('notification', (data: AppNotification) => {
      useNotificationStore.getState().addNotification(data);
    });

    this.appSocket.on('connect_error', (err: Error) => {
      console.warn('[Socket] App connection error:', err.message);
    });
  }

  disconnectApp(): void {
    this.appSocket?.disconnect();
    this.appSocket = null;
  }

  // ─── Session Socket (Chat, Location, Typing) ─────────────────────────────────

  connectSession(
    sessionId: string,
    callbacks?: {
      onMessage?: (msg: ChatMessage) => void;
      onTyping?: (data: { isTyping: boolean; userId: string }) => void;
      onLocation?: (data: { lat: number; lng: number }) => void;
    }
  ): void {
    if (this.sessionSocket?.connected && this.currentSessionId === sessionId) return;

    this.onSessionMessage = callbacks?.onMessage ?? null;
    this.onTypingIndicator = callbacks?.onTyping ?? null;
    this.onLocationUpdate = callbacks?.onLocation ?? null;
    this.currentSessionId = sessionId;
    this.sessionStatus = 'connecting';

    const token = this.getToken();
    if (!token) {
      console.warn('[Socket] Cannot connect session — no auth token');
      return;
    }

    if (this.sessionSocket) {
      this.sessionSocket.disconnect();
    }

    this.sessionSocket = io(`${SOCKET_URL}/sessions`, this.makeSocketOptions());

    this.sessionSocket.on('connect', () => {
      console.log('[Socket] Session connected');
      this.sessionStatus = 'connected';
      this.sessionSocket?.emit('join_session', { sessionId });

      // Flush queued messages
      this.flushQueue('session');
    });

    this.sessionSocket.on('disconnect', (reason) => {
      console.log('[Socket] Session disconnected:', reason);
      this.sessionStatus = 'disconnected';
    });

    this.sessionSocket.on('connect_error', (err: Error) => {
      console.warn('[Socket] Session error:', err.message);
      this.sessionStatus = 'error';
    });

    this.sessionSocket.on('receive_message', (msg: ChatMessage) => {
      console.log('[Socket] Message received:', msg.senderId);
      this.onSessionMessage?.(msg);
    });

    this.sessionSocket.on('typing', (data: { isTyping: boolean; userId: string }) => {
      this.onTypingIndicator?.(data);
    });

    this.sessionSocket.on('companion_location_updated', (data: { lat: number; lng: number }) => {
      this.onLocationUpdate?.(data);
    });

    this.sessionSocket.on('companion_joined', (data: any) => {
      console.log('[Socket] Companion joined room:', data.companionId);
    });
  }

  disconnectSession(): void {
    this.sessionSocket?.disconnect();
    this.sessionSocket = null;
    this.currentSessionId = null;
    this.sessionStatus = 'disconnected';
    this.onSessionMessage = null;
    this.onTypingIndicator = null;
    this.onLocationUpdate = null;
  }

  sendSessionMessage(sessionId: string, text: string, attachmentUrl?: string): void {
    const payload = { sessionId, text, attachmentUrl };
    if (this.sessionSocket?.connected) {
      this.sessionSocket.emit('send_message', payload);
    } else {
      this.messageQueue.push({ namespace: 'session', event: 'send_message', payload });
    }
  }

  sendTypingIndicator(sessionId: string, isTyping: boolean): void {
    this.sessionSocket?.emit('typing', { sessionId, isTyping });
  }

  updateLocation(sessionId: string, lat: number, lng: number, heading?: number): void {
    this.sessionSocket?.emit('update_location', { sessionId, lat, lng, heading });
  }

  getSessionStatus(): ConnectionStatus {
    return this.sessionStatus;
  }

  // ─── Support Socket (Live Support Chat) ──────────────────────────────────────

  connectSupport(
    ticketId: string,
    onMessage?: (msg: ChatMessage) => void
  ): void {
    if (this.supportSocket?.connected) {
      this.supportSocket.emit('join_ticket', { ticketId });
      return;
    }

    this.onSupportMessage = onMessage ?? null;
    this.supportStatus = 'connecting';

    const token = this.getToken();
    if (!token) return;

    this.supportSocket = io(`${SOCKET_URL}/support`, this.makeSocketOptions());

    this.supportSocket.on('connect', () => {
      console.log('[Socket] Support connected');
      this.supportStatus = 'connected';
      this.supportSocket?.emit('join_ticket', { ticketId });
      this.flushQueue('support');
    });

    this.supportSocket.on('disconnect', (reason) => {
      this.supportStatus = 'disconnected';
      console.log('[Socket] Support disconnected:', reason);
    });

    this.supportSocket.on('connect_error', (err: Error) => {
      this.supportStatus = 'error';
      console.warn('[Socket] Support error:', err.message);
    });

    this.supportSocket.on('receive_support_message', (msg: ChatMessage) => {
      this.onSupportMessage?.(msg);
    });
  }

  disconnectSupport(): void {
    this.supportSocket?.disconnect();
    this.supportSocket = null;
    this.supportStatus = 'disconnected';
    this.onSupportMessage = null;
  }

  sendSupportMessage(ticketId: string, text: string, attachmentUrl?: string): void {
    const payload = { ticketId, text, attachmentUrl };
    if (this.supportSocket?.connected) {
      this.supportSocket.emit('send_support_message', payload);
    } else {
      this.messageQueue.push({ namespace: 'support', event: 'send_support_message', payload });
    }
  }

  getSupportStatus(): ConnectionStatus {
    return this.supportStatus;
  }

  // ─── Offline Message Queue ────────────────────────────────────────────────────

  private flushQueue(namespace: 'session' | 'support'): void {
    const socket = namespace === 'session' ? this.sessionSocket : this.supportSocket;
    if (!socket?.connected) return;

    const pending = this.messageQueue.filter((m) => m.namespace === namespace);
    pending.forEach((m) => {
      socket.emit(m.event, m.payload);
    });
    this.messageQueue = this.messageQueue.filter((m) => m.namespace !== namespace);

    if (pending.length > 0) {
      console.log(`[Socket] Flushed ${pending.length} queued ${namespace} messages`);
    }
  }

  // ─── Disconnect All ─────────────────────────────────────────────────────────

  disconnectAll(): void {
    this.disconnectApp();
    this.disconnectSession();
    this.disconnectSupport();
    this.messageQueue = [];
    console.log('[Socket] All sockets disconnected');
  }
}

export const socketService = new SocketService();
