import { create } from 'zustand';
import type { ChatMessage, ChatState } from '../types/chat';
import { sendChatMessage } from '../services/chatService';
import { generateId } from '../utils/helpers';

interface ChatStore extends ChatState {
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  sendMessage: async (userMessage: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      message: userMessage,
      timestamp: new Date()
    };
    set((state) => ({ messages: [...state.messages, userMsg], isTyping: true }));

    try {
      const response = await sendChatMessage(userMessage);
      const aiMsg: ChatMessage = {
        id: generateId(),
        sender: 'ai',
        message: response.message,
        timestamp: new Date()
      };
      set((state) => ({ messages: [...state.messages, aiMsg], isTyping: false }));
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        sender: 'ai',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      set((state) => ({ messages: [...state.messages, errorMsg], isTyping: false }));
    }
  },
  clearMessages: () => set({ messages: [], isTyping: false })
}));

export const useChat = () => {
  const store = useChatStore();
  return {
    messages: store.messages,
    isTyping: store.isTyping,
    sendMessage: store.sendMessage,
    clearMessages: store.clearMessages
  };
};