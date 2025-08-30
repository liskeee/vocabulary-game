import { ReactNode } from 'react';
import ScoreBoard from '@/components/ui/ScoreBoard';
import ProgressBar from '@/components/ui/ProgressBar';

interface GameContainerProps {
  children: ReactNode;
  score: number;
  totalQuestions: number;
  currentQuestion: number;
  showScoreBoard?: boolean;
  showProgressBar?: boolean;
  className?: string;
}

export default function GameContainer({
  children,
  score,
  totalQuestions,
  currentQuestion,
  showScoreBoard = true,
  showProgressBar = true,
  className = '',
}: GameContainerProps) {
  return (
    <div className="min-h-screen bg-pink-100">
      <main className={`flex flex-1 justify-center py-8 px-4 ${className}`}>
        <div className="w-full max-w-4xl">
          {showScoreBoard && (
            <ScoreBoard
              score={score}
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestion}
              className="mb-6"
            />
          )}
          {showProgressBar && (
            <ProgressBar
              current={currentQuestion}
              total={totalQuestions}
              className="mb-8"
            />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
