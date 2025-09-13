import React, { useState } from 'react';
import { MemoizedCompareIcon as CompareIcon } from './icons/CompareIcon';

interface ImageComparatorProps {
  originalUrl: string;
  enhancedUrl: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalUrl, enhancedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative w-full max-h-[60vh] aspect-video rounded-md overflow-hidden select-none group">
      <img 
        src={originalUrl} 
        alt="Original user-uploaded image before AI enhancement" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
      />
      
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={enhancedUrl} 
          alt="AI-enhanced version of the image" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
        />
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
        aria-label="Image comparison slider"
      />
      
      <div 
        className="absolute inset-y-0 w-1 bg-white bg-opacity-70 group-hover:bg-opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white bg-opacity-70 group-hover:bg-opacity-100 transition-opacity duration-200 flex items-center justify-center shadow-lg">
          <CompareIcon className="w-8 h-8 text-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImageComparator);