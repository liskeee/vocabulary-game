export interface VocabularyItem {
  id: string;
  word: string;
  polishTranslation: string;
  definition: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  example?: string;
  // Quiz-specific data
  quizSentence: string;
  options: string[];
  correctExplanation: string;
  incorrectExplanations: Record<string, string>;
}

export interface GameProps {
  vocabulary: VocabularyItem[];
  onComplete?: () => void;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<GameProps>;
}

export interface GameState {
  currentIndex: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: number[];
  startTime: number;
  isComplete: boolean;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface FlashcardProgress {
  cardId: string;
  isKnown: boolean;
  reviewCount: number;
  lastReviewed: number;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  quizStats: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTimePerQuestion: number;
  };
  flashcardStats: {
    totalCards: number;
    knownCards: number;
    masteryPercentage: number;
  };
  streakDays: number;
  lastPlayedDate: string;
}

export interface GameSession {
  gameType: 'quiz' | 'flashcard';
  startTime: number;
  endTime?: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
