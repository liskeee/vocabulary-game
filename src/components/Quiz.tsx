import React, { useState, useEffect } from 'react';
import { QuizState } from '../types';
import { initDatabase, getRandomQuestions } from '../database';
import QuestionCard from './QuestionCard';

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    allQuestions: [],
    currentQuestion: null,
    score: 0,
    points: 0,
    showFeedback: false,
    selectedAnswer: null,
    shuffledAnswers: [],
    recentQuestions: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        await initDatabase();
        const questions = getRandomQuestions(); // Get all questions
        if (!questions || questions.length === 0) {
          throw new Error('No vocabulary questions available');
        }

        // Clear old cache and always start fresh to ensure updated explanations
        localStorage.removeItem('vocabularyQuizState');

        // Load new questions
        const firstQuestion = questions[Math.floor(Math.random() * questions.length)];
        const shuffledAnswers = [firstQuestion.correctAnswer, ...firstQuestion.distractors].sort(() => Math.random() - 0.5);
        
        setQuizState(prev => ({
          ...prev,
          allQuestions: questions,
          currentQuestion: firstQuestion,
          shuffledAnswers,
          recentQuestions: [firstQuestion.uuid]
        }));
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (quizState.allQuestions.length > 0) {
      localStorage.setItem('vocabularyQuizState', JSON.stringify(quizState));
    }
  }, [quizState]);

  const handleAnswerSelect = (answer: string) => {
    if (quizState.showFeedback || !quizState.currentQuestion) return;

    const isCorrect = answer === quizState.currentQuestion.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      points: isCorrect ? (prev.points || 0) + 100 : Math.max(0, (prev.points || 0) - 25)
    }));
  };

  const handleNextQuestion = () => {
    if (!quizState.allQuestions || quizState.allQuestions.length === 0) return;
    
    // Ensure recentQuestions is always an array
    const recentQuestions = quizState.recentQuestions || [];
    
    // Filter out recently asked questions (avoid repetition for at least 5 questions)
    const availableQuestions = quizState.allQuestions.filter(
      q => !recentQuestions.includes(q.uuid)
    );
    
    // If all questions have been asked recently, use all questions
    const questionsToChooseFrom = availableQuestions.length > 0 ? availableQuestions : quizState.allQuestions;
    
    // Pick a random question from available questions
    const randomQuestion = questionsToChooseFrom[Math.floor(Math.random() * questionsToChooseFrom.length)];
    const shuffledAnswers = [randomQuestion.correctAnswer, ...randomQuestion.distractors].sort(() => Math.random() - 0.5);
    
    // Update recent questions list (keep only last 5)
    const updatedRecentQuestions = [...recentQuestions, randomQuestion.uuid].slice(-5);
    
    setQuizState(prev => ({
      ...prev,
      currentQuestion: randomQuestion,
      selectedAnswer: null,
      showFeedback: false,
      shuffledAnswers,
      recentQuestions: updatedRecentQuestions
    }));
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading vocabulary questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }


  if (!quizState.currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-3">
      <div className="max-w-4xl mx-auto">
        {/* Question card */}
        <div className="max-w-lg mx-auto relative">
          {/* Bookmark attached to top right edge of question card */}
          <div className="absolute top-0 right-0 z-20">
            <div className="relative bg-pink-500 text-white shadow-lg">
              {/* Bookmark content */}
              <div className="flex flex-col items-center justify-center h-full px-4 py-2">
                <div className="text-lg font-bold text-white">{quizState.points || 0}</div>
                <div className="ml-2 mt-1 text-xs font-semibold text-white uppercase">PTS</div>
              </div>
            </div>
          </div>
          <QuestionCard
            question={quizState.currentQuestion}
            selectedAnswer={quizState.selectedAnswer}
            showFeedback={quizState.showFeedback}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            shuffledOptions={quizState.shuffledAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
