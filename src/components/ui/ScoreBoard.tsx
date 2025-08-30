interface ScoreBoardProps {
  score: number;
  totalQuestions: number;
  currentQuestion: number;
  className?: string;
}

export default function ScoreBoard({ score, totalQuestions, currentQuestion, className = '' }: ScoreBoardProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-pink-100 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-900">{score}</div>
          <div className="text-sm text-pink-600">Score</div>
        </div>
        <div className="w-px h-8 bg-pink-200"></div>
        <div className="text-center">
          <div className="text-lg font-semibold text-pink-800">
            {currentQuestion} / {totalQuestions}
          </div>
          <div className="text-sm text-pink-600">Progress</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
