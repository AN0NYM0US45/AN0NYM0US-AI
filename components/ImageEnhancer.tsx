import React, { Suspense, lazy } from 'react';
import { useMediaEnhancer } from '../hooks/useMediaEnhancer';
import { UploadPlaceholder } from './UploadPlaceholder';
import { MemoizedUploadIcon as UploadIcon } from './icons/UploadIcon';
import { EnhancementHistoryItem } from '../types';
import Loader from './Loader';

// Lazily load MediaDisplay for better code splitting and initial load time
const MediaDisplay = lazy(() => import('./MediaDisplay'));

interface ImageEnhancerProps {
  onEnhancementComplete: (item: EnhancementHistoryItem) => void;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ onEnhancementComplete }) => {
  const {
    originalUrl,
    enhancedUrl,
    isLoading,
    error,
    handleFileSelect,
    enhanceMedia,
    reset,
  } = useMediaEnhancer(onEnhancementComplete);

  return (
    <div className="flex flex-col items-center gap-8">
      {!originalUrl ? (
        <UploadPlaceholder
          icon={<UploadIcon className="w-16 h-16 text-gray-500 mb-4" />}
          title="Upload Your Photo"
          description="Drag and drop any photo to our AI photo enhancer. Instantly improve image quality, enhance detail, and apply a professional, studio-like finish."
          acceptedFileTypes="image/jpeg, image/png, image/webp"
          onFileSelected={handleFileSelect}
        />
      ) : (
        <Suspense fallback={
          <div className="w-full max-w-4xl h-96 flex items-center justify-center bg-gray-800 rounded-lg shadow-2xl">
            <Loader />
          </div>
        }>
          <MediaDisplay
            originalUrl={originalUrl}
            enhancedUrl={enhancedUrl}
            isLoading={isLoading}
            error={error}
            onEnhance={enhanceMedia}
            onReset={reset}
          />
        </Suspense>
      )}
    </div>
  );
};

export default React.memo(ImageEnhancer);