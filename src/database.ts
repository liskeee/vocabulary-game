import { VocabularyQuestion } from './types';

let vocabularyData: Omit<VocabularyQuestion, 'id'>[] = [];

// Shuffle array utility function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const initDatabase = async (): Promise<void> => {
  try {
    const response = await fetch('/vocabulary.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch vocabulary data: ${response.status}`);
    }
    vocabularyData = await response.json();
  } catch (error) {
    console.error('Error loading vocabulary data:', error);
    throw error;
  }
};

export const getRandomQuestions = (count?: number): VocabularyQuestion[] => {
  const shuffled = shuffleArray(vocabularyData);
  // If no count specified, return all questions
  const selected = count ? shuffled.slice(0, Math.min(count, vocabularyData.length)) : shuffled;
  
  return selected.map((item, index) => ({
    id: index + 1,
    ...item
  }));
};

export const getAllQuestions = (): VocabularyQuestion[] => {
  const shuffled = shuffleArray(vocabularyData);
  return shuffled.map((item, index) => ({
    id: index + 1,
    ...item
  }));
};
