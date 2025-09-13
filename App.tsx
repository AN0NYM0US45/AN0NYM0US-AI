import React, { useState, useCallback } from 'react';
import ImageEnhancer from './components/ImageEnhancer';
import EnhancementHistory from './components/EnhancementHistory';
import { EnhancementHistoryItem } from './types';
import { MemoizedAiBadgeIcon as AiBadgeIcon } from './components/icons/AiBadgeIcon';
import AdBanner from './components/AdBanner';

const App: React.FC = () => {
  const [history, setHistory] = useState<EnhancementHistoryItem[]>([]);

  const handleEnhancementComplete = useCallback((item: EnhancementHistoryItem) => {
    setHistory(prevHistory => [item, ...prevHistory]);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <header className="py-6">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <AiBadgeIcon className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">AN0NYM0US AI</h1>
          </div>
          <p className="text-lg text-gray-400">
            The Free AI Photo Enhancer for 4K Studio Shots
          </p>
        </div>
      </header>
      
      {/* AdSense Ad Unit 1 */}
      <div className="container mx-auto px-4 my-4 flex justify-center">
        <AdBanner adSlot="YOUR_AD_SLOT_ID_1" />
      </div>

      <main className="container mx-auto px-4 py-8">
        
        <ImageEnhancer onEnhancementComplete={handleEnhancementComplete} />

        <EnhancementHistory history={history} />
        
      </main>

      {/* AdSense Ad Unit 2 */}
      <div className="container mx-auto px-4 my-4 flex justify-center">
         <AdBanner adSlot="YOUR_AD_SLOT_ID_2" />
      </div>

      <footer className="py-6 text-center text-gray-500">
        <p>// created by NARENDRA</p>
      </footer>
    </div>
  );
};

export default App;