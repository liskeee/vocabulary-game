import React, { useMemo } from 'react';
import { VocabularyQuestion } from '../types';

interface QuestionCardProps {
  question: VocabularyQuestion;
  selectedAnswer: string | null;
  showFeedback: boolean;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  shuffledOptions?: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showFeedback,
  onAnswerSelect,
  onNext,
  shuffledOptions: providedOptions
}) => {
  // Create all answer options by combining correct answer with distractors
  // Use provided shuffled options if available, otherwise shuffle once per question
  const shuffledOptions = useMemo(() => {
    if (providedOptions) {
      return providedOptions;
    }
    const allOptions = [question.correctAnswer, ...question.distractors];
    return allOptions.sort(() => Math.random() - 0.5);
  }, [question.correctAnswer, question.distractors, providedOptions]);

  const getButtonStyle = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option
        ? 'bg-pink-500 text-white shadow-lg'
        : 'bg-pink-25 text-pink-800 hover:bg-pink-50';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-500 text-white shadow-lg';
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return 'bg-red-400 text-white shadow-lg';
    }

    return 'bg-pink-100 text-pink-700';
  };

  const getLetterBadgeStyle = (option: string) => {
    if (!showFeedback) {
      return selectedAnswer === option
        ? 'bg-pink-600 text-white shadow-sm'
        : 'bg-pink-400 text-white';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-600 text-white shadow-sm';
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return 'bg-red-500 text-white shadow-sm';
    }

    return 'bg-pink-300 text-white';
  };

  // Replace the blank in the sentence with an underlined space
  const displaySentence = question.sentence.replace('_____', '______');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 max-w-2xl mx-auto pt-12">
      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-pink-800 leading-relaxed text-center px-2 mb-4">
          {displaySentence}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {shuffledOptions.map((option, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => onAnswerSelect(option)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-xl transition-all duration-200 font-semibold text-base border-0 ${getButtonStyle(option)} ${
                showFeedback ? 'cursor-default' : 'cursor-pointer active:scale-98'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-center mr-3 text-sm font-bold transition-all duration-200 ${getLetterBadgeStyle(option)}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
                
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Explanation Section */}
      {showFeedback && selectedAnswer && (
        <div className="mb-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
          {selectedAnswer === question.correctAnswer ? (
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                ✅ Correct! "{question.correctAnswer}" means:
              </h4>
              <p className="text-sm text-green-700">
                {question.explanation}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-2">
                ❌ Why "{selectedAnswer}" is incorrect:
              </h4>
              <p className="text-sm text-red-700 mb-3">
                {question.incorrectExplanations?.[selectedAnswer] || `"${selectedAnswer}" doesn't fit the context of this sentence.`}
              </p>
              <h4 className="text-sm font-semibold text-green-800 mb-2">
                The correct answer is "{question.correctAnswer}":
              </h4>
              <p className="text-sm text-green-700">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Next Button */}
      {showFeedback && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-800 transition-all duration-200 text-lg shadow-xl active:scale-98"
          >
            Next Question 💕
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
