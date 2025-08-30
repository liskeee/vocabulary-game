'use client';

import { useState, useEffect } from 'react';
import { VocabularyItem, GameProps } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { playPronunciation } from '@/utils/speech';
import { getRandomVocabularyItem, addToRecentItems } from '@/utils/randomizer';
import GameContainer from './GameContainer';

export default function Quiz({ vocabulary }: GameProps) {
  const { gameState, startGame, markQuestionAnswered } = useGameState('quiz');
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentItemId, setCurrentItemId] = useLocalStorage<string>('quiz-current-item', '');

  useEffect(() => {
    if (vocabulary.length > 0 && !gameState.isComplete && gameState.totalQuestions === 0) {
      startGame(vocabulary.length);
    }
  }, [vocabulary.length, startGame, gameState.isComplete, gameState.totalQuestions]);


  useEffect(() => {
    if (vocabulary.length > 0 && !currentItem) {
      // Try to restore saved item first
      if (currentItemId) {
        const savedItem = vocabulary.find(item => item.id === currentItemId);
        if (savedItem) {
          setCurrentItem(savedItem);
          setSelectedAnswer('');
          setIsAnswered(false);
          setShowExplanation(false);
          return;
        }
      }
      
      // Get random item if no saved item or saved item not found
      const randomItem = getRandomVocabularyItem(vocabulary);
      if (randomItem) {
        setCurrentItem(randomItem);
        setCurrentItemId(randomItem.id);
        setSelectedAnswer('');
        setIsAnswered(false);
        setShowExplanation(false);
      }
    }
  }, [vocabulary, currentItem, currentItemId, setCurrentItemId]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    
    // Auto-submit answer when selected
    setIsAnswered(true);

    markQuestionAnswered(gameState.currentIndex);
    setShowExplanation(true);
  };


  const handleNextQuestion = () => {
    if (currentItem) {
      addToRecentItems(currentItem.id);
    }

    const randomItem = getRandomVocabularyItem(vocabulary);
    if (randomItem) {
      setCurrentItem(randomItem);
      setCurrentItemId(randomItem.id);
      setSelectedAnswer('');
      setIsAnswered(false);
      setShowExplanation(false);
    }
  };

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  const handlePlayPronunciation = () => {
    if (!currentItem || !isAnswered) return;
    
    // Find the correct answer from the options
    const correctAnswer = currentItem.options.find(option => 
      currentItem.correctExplanation.toLowerCase().includes(option.toLowerCase()) ||
      option === currentItem.word
    ) || currentItem.word;
    
    playPronunciation(correctAnswer, currentItem.pronunciation);
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
          <p className="text-gray-600">Loading question...</p>
        </div>
      </GameContainer>
    );
  }

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
            <h2 className="text-3xl font-bold text-gray-900">Complete the Sentence</h2>
            <p className="text-lg text-gray-600 mt-1">Choose the correct word to fill in the blank.</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-pink-200/50">

          <div className="bg-pink-50 rounded-xl p-6 mb-8 text-center">
            <p className="text-pink-800 text-lg">
              {currentItem.quizSentence.replace('_____', '______')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentItem.options.map((option, index) => (
              <label
                key={index}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                  selectedAnswer === option
                    ? 'border-pink-500 bg-pink-500 text-white font-semibold'
                    : 'border-pink-200 bg-white hover:border-pink-400 hover:bg-pink-50'
                } ${isAnswered ? 'cursor-not-allowed opacity-75' : ''} has-[:checked]:border-pink-500 has-[:checked]:bg-pink-500 has-[:checked]:text-white has-[:checked]:font-semibold`}
              >
                <input
                  type="radio"
                  name="quiz-option"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className="custom-radio h-6 w-6 appearance-none rounded-full border-2 border-pink-300 bg-transparent transition-all focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2"
                />
                <span className={`text-base ${selectedAnswer === option ? 'text-white' : 'text-pink-800'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-8 p-6 rounded-xl border-2 border-dashed border-pink-200 bg-pink-50">
              <div className="mb-4">
                {selectedAnswer === currentItem.word ? (
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-lg">Correct!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-lg">Incorrect</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-pink-800 font-medium">
                  The correct answer is: <span className="font-bold text-pink-900">&ldquo;{currentItem.word}&rdquo;</span>
                </p>
                <p className="text-pink-700 font-medium mt-1">
                  Translation: <span className="font-bold text-pink-800">{currentItem.polishTranslation}</span>
                </p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <p className="text-pink-600 font-mono text-sm">
                    Pronunciation: {currentItem.pronunciation}
                  </p>
                  <button
                    onClick={handlePlayPronunciation}
                    className="flex items-center justify-center p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 hover:text-pink-700 rounded-full transition-colors shadow-sm active:scale-95 min-w-[40px] min-h-[40px]"
                    title="Play pronunciation"
                  >
                    <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px">
                      <path d="M155.51,24.81a8,8,0,0,0-8.42.88L77.25,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V32A8,8,0,0,0,155.51,24.81ZM32,96H72v64H32ZM144,207.64,88,164.09V91.91l56-43.55Zm54-106.08a40,40,0,0,1,0,52.88,8,8,0,0,1-12-10.58,24,24,0,0,0,0-31.72,8,8,0,0,1,12-10.58ZM248,128a79.9,79.9,0,0,1-20.37,53.34,8,8,0,0,1-11.92-10.67,64,64,0,0,0,0-85.33,8,8,0,1,1,11.92-10.67A79.83,79.83,0,0,1,248,128Z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                {selectedAnswer !== currentItem.word && (
                  <p className="text-red-600 mb-3">
                    <strong>Why &ldquo;{selectedAnswer}&rdquo; is wrong:</strong> {currentItem.incorrectExplanations[selectedAnswer] || 'This word does not fit the context of the sentence.'}
                  </p>
                )}
                <p className="text-green-600 leading-relaxed">
                  <strong>Why &ldquo;{currentItem.word}&rdquo; is correct:</strong> {currentItem.correctExplanation}
                </p>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Next Question
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </GameContainer>
  );
}
