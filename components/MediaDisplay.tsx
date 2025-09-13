import React from 'react';
import Loader from './Loader';
import ImageComparator from './ImageComparator';
import { MemoizedMagicWandIcon as MagicWandIcon } from './icons/MagicWandIcon';
import { MemoizedUndoIcon as UndoIcon } from './icons/UndoIcon';
import { MemoizedDownloadIcon as DownloadIcon } from './icons/DownloadIcon';

interface MediaDisplayProps {
  originalUrl: string;
  enhancedUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onEnhance: () => void;
  onReset: () => void;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  originalUrl,
  enhancedUrl,
  isLoading,
  error,
  onEnhance,
  onReset,
}) => {
  const isEnhancedImage = enhancedUrl?.startsWith('data:image');

  const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode; primary?: boolean, "aria-label": string }> = ({ onClick, children, primary = false, ...props }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        primary
          ? 'bg-amber-400 text-gray-900 hover:bg-amber-300 focus:ring-amber-400'
          : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
      }`}
      {...props}
    >
      {children}
    </button>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl h-96 flex flex-col items-center justify-center bg-gray-700 rounded-lg shadow-2xl p-4 text-center">
        <Loader />
        <p className="mt-4 text-lg font-semibold text-white">AI is working its magic... Please wait.</p>
        <p className="text-gray-400">This process can take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl h-96 flex flex-col items-center justify-center bg-red-900/20 border border-red-500 rounded-lg shadow-2xl p-4 text-center">
        <h3 className="text-xl font-bold text-red-400 mb-2">Enhancement Failed</h3>
        <p className="text-gray-300 mb-6 max-w-md">{error}</p>
        <ActionButton onClick={onReset} aria-label="Start Over">
          <UndoIcon className="w-6 h-6" />
          <span>Start Over</span>
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-6">
      <div className="relative w-full rounded-lg shadow-2xl bg-gray-700">
        {isEnhancedImage && <ImageComparator originalUrl={originalUrl} enhancedUrl={enhancedUrl} />}
        {!enhancedUrl && <img src={originalUrl} alt="Original user-uploaded image before AI enhancement" className="w-full max-h-[60vh] object-contain rounded-md" />}
      </div>
      
      <div className="flex items-center gap-4">
        {enhancedUrl ? (
          <>
            <a href={enhancedUrl} download={`enhanced-image-${Date.now()}.png`} style={{textDecoration: 'none'}} aria-label="Download enhanced image">
              <ActionButton primary aria-label="Download enhanced image">
                <DownloadIcon className="w-6 h-6" />
                <span>Download</span>
              </ActionButton>
            </a>
            <ActionButton onClick={onReset} aria-label="Enhance another image">
              <UndoIcon className="w-6 h-6" />
              <span>Enhance Another</span>
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={onEnhance} primary aria-label="Enhance this image">
              <MagicWandIcon className="w-6 h-6" />
              <span>Enhance Photo</span>
            </ActionButton>
            <ActionButton onClick={onReset} aria-label="Cancel and upload a different image">
              <UndoIcon className="w-6 h-6" />
              <span>Cancel</span>
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaDisplay;