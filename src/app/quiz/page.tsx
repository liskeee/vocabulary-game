'use client';

import { useVocabulary } from '@/hooks/useVocabulary';
import Quiz from '@/components/games/Quiz';

export default function QuizPage() {
  const { vocabulary, loading, error } = useVocabulary();
  

  const handleComplete = () => {
    // Quiz completed - could redirect or show results
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading vocabulary</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }


  return (
    <Quiz
      vocabulary={vocabulary}
      onComplete={handleComplete}
    />
  );
}
