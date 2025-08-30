interface AnswerExplanationProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  isLastQuestion?: boolean;
}

export default function AnswerExplanation({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
  onNext,
  isLastQuestion = false,
}: AnswerExplanationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isCorrect ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          {!isCorrect && (
            <p className="text-gray-600 mt-2">
              You selected: <span className="font-semibold text-red-600">{selectedAnswer}</span>
              <br />
              Correct answer: <span className="font-semibold text-green-600">{correctAnswer}</span>
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Explanation:</h4>
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="flex items-center justify-center rounded-xl h-12 px-8 bg-pink-500 text-white text-lg font-bold shadow-lg hover:bg-pink-600 transition-colors"
          >
            {isLastQuestion ? 'View Results' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
