export interface VocabularyQuestion {
  uuid: string;
  sentence: string;
  correctAnswer: string;
  distractors: string[];
  explanation: string;
  incorrectExplanations: { [key: string]: string };
}

export interface QuizState {
  allQuestions: VocabularyQuestion[];
  currentQuestion: VocabularyQuestion | null;
  score: number;
  points: number;
  showFeedback: boolean;
  selectedAnswer: string | null;
  shuffledAnswers: string[];
  recentQuestions: string[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  mistakes: VocabularyQuestion[];
}
