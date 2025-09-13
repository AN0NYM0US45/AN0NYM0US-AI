import React, { useState, useCallback } from 'react';
import { EnhancementHistoryItem } from '../types';
import { MemoizedHistoryIcon as HistoryIcon } from './icons/HistoryIcon';
import { MemoizedCopyLinkIcon as CopyLinkIcon } from './icons/CopyLinkIcon';
import { MemoizedCheckIcon as CheckIcon } from './icons/CheckIcon';

interface EnhancementHistoryProps {
  history: EnhancementHistoryItem[];
}

const HistoryListItem: React.FC<{ item: EnhancementHistoryItem }> = React.memo(({ item }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(item.enhancedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  }, [item.enhancedUrl]);

  return (
    <li className="flex items-center gap-4 p-3 bg-gray-700 rounded-md">
      <img 
        src={item.originalUrl} 
        alt="Thumbnail of a previously enhanced image" 
        className="w-16 h-16 object-cover rounded-md bg-gray-600 flex-shrink-0"
      />
      <div className="flex-grow overflow-hidden">
        <p className="font-semibold text-white truncate">{item.prompt}</p>
        <p className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
      </div>
      <button 
        onClick={copyToClipboard} 
        className="p-2 rounded-full hover:bg-gray-600 transition-colors flex-shrink-0"
        aria-label="Copy enhanced media link to clipboard"
        title="Copy Enhanced Media Link"
      >
        {copied ? (
          <CheckIcon className="w-6 h-6 text-green-400" />
        ) : (
          <CopyLinkIcon className="w-6 h-6 text-gray-300" />
        )}
      </button>
    </li>
  );
});

const EnhancementHistory: React.FC<EnhancementHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
        <HistoryIcon className="w-8 h-8" />
        <span>AN0NYM0US AI History</span>
      </h2>
      <ul className="space-y-4">
        {history.map((item) => (
          <HistoryListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default React.memo(EnhancementHistory);