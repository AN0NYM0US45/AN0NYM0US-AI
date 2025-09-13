export interface EnhancementHistoryItem {
  id: string;
  type: 'image';
  originalUrl: string;
  enhancedUrl: string;
  prompt: string;
  timestamp: number;
}