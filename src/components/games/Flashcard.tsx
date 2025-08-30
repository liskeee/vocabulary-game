'use client';

import { useState, useEffect } from 'react';
import { VocabularyItem, GameProps } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { playPronunciation } from '@/utils/speech';
import GameContainer from './GameContainer';

interface FlashcardProgress {
  [cardId: string]: {
    isKnown: boolean;
    reviewCount: number;
    lastReviewed: number;
  };
}

export default function Flashcard({ vocabulary }: GameProps) {
  const { gameState, startGame } = useGameState('flashcard');
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcardProgress, setFlashcardProgress] = useLocalStorage<FlashcardProgress>('flashcard-progress', {});

  useEffect(() => {
    if (vocabulary.length > 0 && !gameState.isComplete && gameState.totalQuestions === 0) {
      startGame(vocabulary.length);
    }
  }, [vocabulary.length, startGame, gameState.isComplete, gameState.totalQuestions]);

  useEffect(() => {
    if (vocabulary.length > 0) {
      const getRandomItem = () => {
        if (vocabulary.length === 0) return null;
        
        // If we have fewer than 5 items total, just pick randomly
        if (vocabulary.length <= 5) {
          return vocabulary[Math.floor(Math.random() * vocabulary.length)];
        }
        
        // Filter out recently used items
        const availableItems = vocabulary.filter(item => !recentItems.includes(item.id));
        
        // If all items have been used recently, reset the recent list
        if (availableItems.length === 0) {
          setRecentItems([]);
          return vocabulary[Math.floor(Math.random() * vocabulary.length)];
        }
        
        return availableItems[Math.floor(Math.random() * availableItems.length)];
      };

      const randomItem = getRandomItem();
      setCurrentItem(randomItem);
      setIsFlipped(false);
    }
  }, [vocabulary, currentIndex, recentItems]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkKnown = (known: boolean) => {
    if (!currentItem) return;

    // Update flashcard progress
    setFlashcardProgress(prev => ({
      ...prev,
      [currentItem.id]: {
        isKnown: known,
        reviewCount: (prev[currentItem.id]?.reviewCount || 0) + 1,
        lastReviewed: Date.now(),
      }
    }));

    handleNext();
  };

  const handleNext = () => {
    // Add current item to recent items list
    if (currentItem) {
      setRecentItems(prev => {
        const newRecent = [currentItem.id, ...prev];
        // Keep only the last 5 items
        return newRecent.slice(0, 5);
      });
    }
    
    // Move to next random flashcard
    setCurrentIndex(prev => prev + 1);
  };

  const handlePlayPronunciation = () => {
    if (!currentItem) return;
    playPronunciation(currentItem.word);
  };

  if (!currentItem) {
    return (
      <GameContainer
        score={0}
        totalQuestions={0}
        currentQuestion={0}
        showScoreBoard={false}
        showProgressBar={false}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcard...</p>
        </div>
      </GameContainer>
    );
  }

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <GameContainer
      score={0}
      totalQuestions={gameState.totalQuestions}
      currentQuestion={gameState.currentIndex + 1}
      showScoreBoard={false}
      showProgressBar={false}
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleReturnHome}
            className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Flashcard Challenge</h2>
            <p className="text-lg text-gray-600 mt-1">Flip the card to learn a new word!</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="group [perspective:1000px] mb-8">
          <div 
            className={`relative h-96 w-full rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] border-2 border-pink-100">
              <h2 className="text-6xl font-bold text-gray-900">{currentItem.word}</h2>
              <p className="text-lg text-gray-500 mt-4">Click to reveal meaning</p>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 bg-white rounded-2xl p-8 [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 border-pink-100">
              <div className="flex flex-col h-full text-center">
                <div className="flex-grow flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Meaning:</h3>
                  <p className="text-gray-700 text-xl mb-4">{currentItem.definition}</p>
                  
                  {currentItem.example && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">Example:</h4>
                      <p className="text-gray-600 italic">&ldquo;{currentItem.example}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPronunciation();
                    }}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px">
                      <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" />
                    </svg>
                    <span className="font-medium">Play Pronunciation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleMarkKnown(false)}
            className="rounded-full h-16 w-16 flex items-center justify-center bg-white border-2 border-red-200 text-red-500 hover:bg-red-50 transition-all focus:outline-none focus:ring-4 focus:ring-red-200"
            title="Need more practice"
          >
            <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="32">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>

          <button
            onClick={handleFlip}
            className="flex-1 max-w-xs flex items-center justify-center rounded-full h-16 px-8 bg-pink-500 text-white text-xl font-bold shadow-lg hover:bg-pink-600 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-pink-300"
          >
            {isFlipped ? 'Flip Back' : 'Reveal'}
          </button>

          <button
            onClick={() => handleMarkKnown(true)}
            className="rounded-full h-16 w-16 flex items-center justify-center bg-white border-2 border-green-200 text-green-500 hover:bg-green-50 transition-all focus:outline-none focus:ring-4 focus:ring-green-200"
            title="I know this word"
          >
            <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="32">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
        </div>
      </div>
    </GameContainer>
  );
}
