import React, { useState, useCallback } from 'react';
import BookOpenIcon from './icons/BookOpenIcon';
import LoadingSpinner from './icons/LoadingSpinner';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full max-w-lg h-80 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-sky-400 bg-slate-800/50' : 'border-slate-600 hover:border-sky-500 hover:bg-slate-800'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept=".epub,application/epub+zip,.txt,text/plain"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {isLoading ? (
          <>
            <LoadingSpinner className="w-12 h-12 text-sky-400" />
            <p className="mt-4 text-lg text-slate-300">Analisando seu arquivo...</p>
            <p className="text-sm text-slate-400">Isso pode levar um momento.</p>
          </>
        ) : (
          <>
            <BookOpenIcon className="w-16 h-16 mb-4 text-slate-500" />
            <h2 className="text-2xl font-bold text-slate-200">Leitor de EPUB & TXT</h2>
            <p className="mt-2 text-slate-400">
              Arraste e solte seu arquivo <span className="font-semibold text-sky-400">.epub</span> ou <span className="font-semibold text-sky-400">.txt</span> aqui, ou clique para selecionar.
            </p>
          </>
        )}
      </label>
    </div>
  );
};

export default FileUpload;