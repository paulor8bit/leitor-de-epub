
import React, { useEffect, useRef, useState } from 'react';
import { BookMetadata } from '../types';
import SpeakerOnIcon from './icons/SpeakerOnIcon';
import SpeakerOffIcon from './icons/SpeakerOffIcon';
import AutoPlayIcon from './icons/AutoPlayIcon';

interface ChatViewProps {
  metadata: BookMetadata;
  messages: string[];
  onNext: () => void;
  onReset: () => void;
  onGoToParagraph: (paragraphNumber: number) => void;
  isComplete: boolean;
  currentParagraph: number;
  totalParagraphs: number;
  isVoiceEnabled: boolean;
  isAutoNarrationEnabled: boolean;
  onToggleVoice: () => void;
  onToggleAutoNarration: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  metadata, 
  messages, 
  onNext, 
  onReset, 
  onGoToParagraph, 
  isComplete, 
  currentParagraph, 
  totalParagraphs,
  isVoiceEnabled,
  isAutoNarrationEnabled,
  onToggleVoice,
  onToggleAutoNarration
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showJumpInput, setShowJumpInput] = useState(false);
  const [jumpValue, setJumpValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showJumpInput) {
      inputRef.current?.focus();
    }
  }, [showJumpInput]);
  
  const displayParagraph = currentParagraph > totalParagraphs ? totalParagraphs : currentParagraph;
  const progressPercentage = totalParagraphs > 0 ? Math.round((displayParagraph / totalParagraphs) * 100) : 0;

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpValue, 10);
    if (!isNaN(target) && target >= 1 && target <= totalParagraphs) {
        onGoToParagraph(target);
        setShowJumpInput(false);
        setJumpValue('');
    } else {
        alert(`Por favor, insira um número entre 1 e ${totalParagraphs}.`);
        setJumpValue('');
    }
  };

  const isNextButtonDisabled = isComplete || (isAutoNarrationEnabled && isVoiceEnabled);

  return (
    <div className="flex flex-col h-full max-h-full bg-slate-800/50 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-900/70 p-4 border-b border-slate-700 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-white truncate">{metadata.title || 'Título Desconhecido'}</h1>
                <p className="text-sm text-slate-400 truncate">{metadata.creator || 'Autor Desconhecido'}</p>
                 {totalParagraphs > 0 && (
                  <div className="mt-2 text-xs text-sky-300 font-mono flex items-center gap-2 h-6">
                    <span>{displayParagraph}/{totalParagraphs} ({progressPercentage}%)</span>
                    {!showJumpInput ? (
                      <button 
                        onClick={() => setShowJumpInput(true)} 
                        className="px-2 py-0.5 bg-slate-700/50 text-sky-300 rounded hover:bg-slate-600 transition-colors"
                        aria-label="Ir para um parágrafo específico"
                      >
                        Ir para...
                      </button>
                    ) : (
                      <form onSubmit={handleJumpSubmit} className="flex items-center gap-1 animate-fade-in-fast">
                        <input 
                          ref={inputRef}
                          type="number"
                          value={jumpValue}
                          onChange={(e) => setJumpValue(e.target.value)}
                          onBlur={() => { if(!jumpValue) setShowJumpInput(false); }}
                          className="w-20 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                          placeholder={`1-${totalParagraphs}`}
                          min="1"
                          max={totalParagraphs}
                        />
                        <button type="submit" className="px-2 py-0.5 bg-sky-600 text-white rounded hover:bg-sky-500 text-xs font-semibold">Ir</button>
                        <button type="button" onClick={() => setShowJumpInput(false)} className="px-2 py-0.5 bg-slate-600 text-white rounded hover:bg-slate-500 text-xs">X</button>
                      </form>
                    )}
                  </div>
                )}
            </div>
            <button
                onClick={onReset}
                className="flex-shrink-0 px-3 py-1.5 text-sm font-semibold text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
            >
                Carregar Outro
            </button>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="flex animate-fade-in-up">
            <div className="bg-sky-900/50 text-slate-200 rounded-lg rounded-tl-none p-3 max-w-xl shadow">
              <p className="text-base leading-relaxed">{msg}</p>
            </div>
          </div>
        ))}
         {isComplete && (
          <div className="text-center py-4">
            <span className="text-slate-400 font-semibold">Fim do livro.</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Footer / Input */}
      <footer className="flex-shrink-0 p-4 bg-slate-900/70 border-t border-slate-700 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full gap-4">
            {/* Left side: Voice Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={onToggleVoice}
                title={isVoiceEnabled ? "Desabilitar Voz" : "Habilitar Voz"}
                className={`p-2 rounded-full transition-colors ${isVoiceEnabled ? 'bg-sky-600 text-white hover:bg-sky-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {isVoiceEnabled ? <SpeakerOnIcon className="w-5 h-5"/> : <SpeakerOffIcon className="w-5 h-5"/>}
              </button>
              <button 
                onClick={onToggleAutoNarration}
                title="Narração Automática"
                disabled={!isVoiceEnabled}
                className={`p-2 rounded-full transition-colors ${isAutoNarrationEnabled && isVoiceEnabled ? 'bg-sky-600 text-white hover:bg-sky-500 animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <AutoPlayIcon className="w-5 h-5"/>
              </button>
            </div>

            {/* Right side: Main Action Button */}
            <button
              onClick={onNext}
              disabled={isNextButtonDisabled}
              className="flex-grow max-w-xs px-6 py-3 text-lg font-bold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transform transition-all hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
            >
              {isComplete ? 'Concluído' : isNextButtonDisabled ? 'Narrando...' : 'Próximo Parágrafo'}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatView;
