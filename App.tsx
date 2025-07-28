
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BookMetadata } from './types';
import FileUpload from './components/FileUpload';
import ChatView from './components/ChatView';

declare global {
  interface Window {
    ePub: (url: string | ArrayBuffer, options?: any) => any;
  }
}

function App() {
  const [metadata, setMetadata] = useState<BookMetadata | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [displayedParagraphs, setDisplayedParagraphs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isAutoNarrationEnabled, setIsAutoNarrationEnabled] = useState(false);
  
  const nextParaRef = useRef<(() => void) | null>(null);
  const autoNarrationRef = useRef<boolean | null>(null);

  useEffect(() => {
    autoNarrationRef.current = isAutoNarrationEnabled;
  });

  const resetState = () => {
    setMetadata(null);
    setParagraphs([]);
    setDisplayedParagraphs([]);
    setCurrentIndex(0);
    setIsLoading(false);
    setError(null);
    setIsVoiceEnabled(false);
    setIsAutoNarrationEnabled(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.epub')) {
      const waitForEpubJs = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 50; 
          const check = () => {
            if (typeof window.ePub !== 'undefined') {
              resolve();
            } else {
              attempts++;
              if (attempts < maxAttempts) {
                setTimeout(check, 100);
              } else {
                reject(new Error("A biblioteca epub.js não foi carregada. Verifique sua conexão."));
              }
            }
          };
          check();
        });
      };
      
      const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
             if (e.target?.result instanceof ArrayBuffer) {
                resolve(e.target.result);
             } else {
                reject(new Error("Falha ao ler o arquivo."));
             }
          };
          reader.onerror = () => reject(new Error("Não foi possível ler o arquivo EPUB."));
          reader.readAsArrayBuffer(file);
        });
      };

      try {
        await waitForEpubJs();
        const fileBuffer = await readFileAsArrayBuffer(file);
        
        resetState();
        setIsLoading(true);

        const book = window.ePub(fileBuffer);
        await book.ready;

        const meta = book.packaging.metadata;
        const newMetadata = {
          title: meta.title || 'Título Desconhecido',
          creator: meta.creator || 'Autor Desconhecido',
        };
        
        const allParagraphs: string[] = (
          await Promise.all(
            book.spine.items.map(async (item: any) => {
              const doc = await item.load(book.load.bind(book));
              const pElements = doc.body.querySelectorAll('p');
              const texts = Array.from(pElements)
                .map((p: any) => p.textContent?.trim())
                .filter(Boolean);
              item.unload();
              return texts as string[];
            })
          )
        ).flat();

        if (allParagraphs.length === 0) {
            throw new Error("Nenhum parágrafo encontrado neste EPUB. O formato pode não ser padrão.");
        }
        
        setMetadata(newMetadata);
        setParagraphs(allParagraphs);
        setDisplayedParagraphs([allParagraphs[0]]);
        setCurrentIndex(1);

      } catch (err) {
        console.error("Erro ao processar o EPUB:", err);
        setError("Não foi possível processar o arquivo EPUB. Como alternativa, você pode tentar converter o arquivo para o formato .txt e fazer o upload novamente.");
      } finally {
        setIsLoading(false);
      }

    } else if (fileName.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          resetState();
          setIsLoading(true);

          if (typeof e.target?.result !== 'string') {
            throw new Error("Falha ao ler o arquivo de texto.");
          }
          const textContent = e.target.result;
          const allParagraphs = textContent
            .split(/[\r\n]+/)
            .map(p => p.trim())
            .filter(p => p.length > 0);

          if (allParagraphs.length === 0) {
            throw new Error("O arquivo de texto está vazio ou não contém parágrafos.");
          }
          
          setMetadata({ title: file.name, creator: 'Arquivo de Texto' });
          setParagraphs(allParagraphs);
          setDisplayedParagraphs([allParagraphs[0]]);
          setCurrentIndex(1);

        } catch (err) {
          console.error("Erro ao processar o TXT:", err);
          const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
          setError(`Erro no TXT: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError("Não foi possível ler o arquivo de texto.");
        setIsLoading(false);
      };
      reader.readAsText(file);
    } else {
      setError("Tipo de arquivo não suportado. Por favor, use .epub ou .txt.");
      setIsLoading(false);
    }
  }, []);
  
  const handleNextParagraph = useCallback(() => {
    setCurrentIndex(prevIndex => {
        if (prevIndex < paragraphs.length) {
            setDisplayedParagraphs(prevDisplayed => [...prevDisplayed, paragraphs[prevIndex]]);
            return prevIndex + 1;
        }
        return prevIndex;
    });
  }, [paragraphs]);

  useEffect(() => {
    nextParaRef.current = handleNextParagraph;
  }, [handleNextParagraph]);

  useEffect(() => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) {
      window.speechSynthesis?.cancel();
      return;
    }

    const lastParagraph = displayedParagraphs[displayedParagraphs.length - 1];
    if (!lastParagraph) return;

    const utterance = new SpeechSynthesisUtterance(lastParagraph);
    utterance.lang = 'pt-BR';
    
    utterance.onend = () => {
      if (autoNarrationRef.current) {
        nextParaRef.current?.();
      }
    };
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      utterance.onend = null;
    }

  }, [displayedParagraphs, isVoiceEnabled]);

  const handleGoToParagraph = useCallback((targetParagraphNumber: number) => {
    if (targetParagraphNumber > 0 && targetParagraphNumber <= paragraphs.length) {
      const newDisplayed = paragraphs.slice(0, targetParagraphNumber);
      setDisplayedParagraphs(newDisplayed);
      setCurrentIndex(targetParagraphNumber);
    }
  }, [paragraphs]);

  const handleToggleVoice = () => setIsVoiceEnabled(prev => !prev);
  
  const handleToggleAutoNarration = () => {
    const willBeEnabled = !isAutoNarrationEnabled;
    setIsAutoNarrationEnabled(willBeEnabled);

    if (willBeEnabled && 'speechSynthesis' in window && !window.speechSynthesis.speaking && currentIndex < paragraphs.length) {
      handleNextParagraph();
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-red-300">Erro!</h2>
                <p className="mt-2 text-red-200">{error}</p>
                <button 
                    onClick={resetState}
                    className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold transition-colors"
                >
                    Tentar Novamente
                </button>
            </div>
        </div>
      );
    }
    
    if (metadata && displayedParagraphs.length > 0) {
      return (
        <ChatView 
          metadata={metadata}
          messages={displayedParagraphs}
          onNext={handleNextParagraph}
          onReset={resetState}
          onGoToParagraph={handleGoToParagraph}
          isComplete={currentIndex >= paragraphs.length}
          currentParagraph={currentIndex}
          totalParagraphs={paragraphs.length}
          isVoiceEnabled={isVoiceEnabled}
          isAutoNarrationEnabled={isAutoNarrationEnabled}
          onToggleVoice={handleToggleVoice}
          onToggleAutoNarration={handleToggleAutoNarration}
        />
      );
    }

    return <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />;
  }

  return (
    <div className="h-screen w-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-4xl max-h-[90vh] mx-auto">
            {renderContent()}
        </div>
    </div>
  );
}

export default App;
