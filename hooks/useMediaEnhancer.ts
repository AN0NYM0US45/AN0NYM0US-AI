import { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { enhanceImage } from '../services/geminiService';
import { EnhancementHistoryItem } from '../types';

export const useMediaEnhancer = (onEnhancementComplete: (item: EnhancementHistoryItem) => void) => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    setOriginalFile(null);
    setOriginalUrl(null);
    setEnhancedUrl(null);
    setIsLoading(false);
    setError(null);
  }, [originalUrl]);

  const handleFileSelect = useCallback((file: File) => {
    reset();
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
  }, [reset]);

  const enhanceMedia = useCallback(async () => {
    if (!originalFile || !originalUrl) return;

    setIsLoading(true);
    setError(null);
    setEnhancedUrl(null);

    try {
      if (!originalFile.type.startsWith('image/')) {
        throw new Error(`Unsupported file type: ${originalFile.type}`);
      }
      
      const base64 = await fileToBase64(originalFile);
      const enhancedBase64 = await enhanceImage(base64, originalFile.type);
      const finalEnhancedUrl = `data:${originalFile.type};base64,${enhancedBase64}`;
      
      setEnhancedUrl(finalEnhancedUrl);

      onEnhancementComplete({
        id: crypto.randomUUID(),
        type: 'image',
        originalUrl,
        enhancedUrl: finalEnhancedUrl,
        prompt: 'Studio Effect Applied',
        timestamp: Date.now(),
      });

    } catch (e: any) {
      console.error("Enhancement failed:", e);
      setError(e.message || "An unknown error occurred during enhancement.");
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, originalUrl, onEnhancementComplete]);

  return {
    originalUrl,
    enhancedUrl,
    isLoading,
    error,
    handleFileSelect,
    enhanceMedia,
    reset,
  };
};