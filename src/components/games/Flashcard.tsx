"use client";

import { useState, useEffect } from "react";
import { VocabularyItem, GameProps } from "@/types/game";
import { useGameState } from "@/hooks/useGameState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { playPronunciation } from "@/utils/speech";
import { getRandomVocabularyItem, addToRecentItems } from "@/utils/randomizer";
import GameContainer from "./GameContainer";

export default function Flashcard({ vocabulary }: GameProps) {
  const { gameState, startGame } = useGameState("flashcard");
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [backItem, setBackItem] = useState<VocabularyItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentItemId, setCurrentItemId] = useLocalStorage<string>(
    "flashcard-current-item",
    ""
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (
      vocabulary.length > 0 &&
      !gameState.isComplete &&
      gameState.totalQuestions === 0
    ) {
      startGame(vocabulary.length);
    }
  }, [
    vocabulary.length,
    startGame,
    gameState.isComplete,
    gameState.totalQuestions,
  ]);


  useEffect(() => {
    if (vocabulary.length > 0 && !currentItem) {
      // Try to restore saved item first
      if (currentItemId) {
        const savedItem = vocabulary.find(item => item.id === currentItemId);
        if (savedItem) {
          setCurrentItem(savedItem);
          setBackItem(savedItem);
          setIsFlipped(false);
          return;
        }
      }
      
      // Get random item if no saved item or saved item not found
      const randomItem = getRandomVocabularyItem(vocabulary);
      if (randomItem) {
        setCurrentItem(randomItem);
        setBackItem(randomItem);
        setCurrentItemId(randomItem.id);
        setIsFlipped(false);
      }
    }
  }, [vocabulary, currentItem, currentItemId, setCurrentItemId]);

  useEffect(() => {
    if (currentItem) {
      setTimeout(() => {
        setBackItem(currentItem);
      }, 300);
    }
  }, [currentItem]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (isTransitioning) return;

    if (currentItem) {
      addToRecentItems(currentItem.id);
    }

    setIsTransitioning(true);

    const randomItem = getRandomVocabularyItem(vocabulary);
    if (randomItem) {
      setCurrentItem(randomItem);
      setCurrentItemId(randomItem.id);
    }
    if (isFlipped) {
      setIsFlipped(false);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsTransitioning(false);
    }
  };

  const handlePlayPronunciation = () => {
    if (!backItem) return;
    playPronunciation(backItem.word, backItem.pronunciation);
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
    window.location.href = "/";
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Home
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Flashcard Challenge
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              Flip the card to learn a new word!
            </p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="group [perspective:1000px] mb-8">
          <div
            className={`relative h-96 w-full rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] cursor-pointer ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] border-2 border-pink-100">
              <h2 className="text-6xl font-bold text-gray-900">
                {currentItem.word}
              </h2>
              <p className="text-lg text-gray-500 mt-4">
                Click to reveal meaning
              </p>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 bg-white rounded-2xl p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] border-2 border-pink-100 overflow-y-auto">
              <div className="flex flex-col h-full text-center justify-center">
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {backItem?.word}
                  </h2>

                  <div>
                    <p className="text-pink-600 text-xl font-semibold mb-3">
                      {backItem?.polishTranslation}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Pronunciation:
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-pink-600 text-base font-mono">
                        {backItem?.pronunciation}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPronunciation();
                        }}
                        className="flex items-center justify-center p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 hover:text-pink-700 rounded-full transition-colors shadow-sm active:scale-95 min-w-[36px] min-h-[36px]"
                        title="Play pronunciation"
                      >
                        <svg
                          fill="currentColor"
                          height="18px"
                          viewBox="0 0 256 256"
                          width="18px"
                        >
                          <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Meaning:
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {backItem?.definition}
                    </p>
                  </div>

                  {backItem?.example && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-800 mb-1">
                        Example:
                      </h4>
                      <p className="text-gray-600 italic text-sm leading-relaxed">
                        &ldquo;{backItem.example}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleFlip}
            className="flex-1 max-w-xs flex items-center justify-center rounded-full h-16 px-8 bg-pink-500 text-white text-xl font-bold shadow-lg hover:bg-pink-600 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-pink-300"
          >
            {isFlipped ? "Flip Back" : "Reveal"}
          </button>

          {isFlipped && (
            <button
              onClick={handleNext}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 rounded-full h-16 px-8 bg-pink-500 text-white text-xl font-bold shadow-lg hover:bg-pink-600 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-pink-300"
            >
              Next Card
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </GameContainer>
  );
}
