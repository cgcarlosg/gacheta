export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}