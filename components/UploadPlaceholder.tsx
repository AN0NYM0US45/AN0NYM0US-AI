import React, { useState, useCallback } from 'react';

interface UploadPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  acceptedFileTypes: string;
  onFileSelected: (file: File) => void;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  icon,
  title,
  description,
  acceptedFileTypes,
  onFileSelected,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  }, [onFileSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  }, [onFileSelected]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg text-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
        isDraggingOver ? 'border-solid border-amber-400 bg-gray-700' : 'border-gray-600'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Upload your photo"
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4 max-w-md">{description}</p>
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="sr-only"
        tabIndex={-1}
      />
    </div>
  );
};

export default React.memo(UploadPlaceholder);