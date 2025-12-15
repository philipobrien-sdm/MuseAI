export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  preview: string;
}

export enum Tab {
  POETRY = 'POETRY',
  ANALYZE = 'ANALYZE',
  CHAT = 'CHAT',
}

export interface PoemResult {
  title: string;
  content: string;
}
