import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/types/game';
import vocabularyData from '@/data/vocabulary.json';

export function useVocabulary() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setVocabulary(vocabularyData as unknown as VocabularyItem[]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load vocabulary data');
      setLoading(false);
    }
  }, []);

  const getVocabularyByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    return vocabulary.filter(item => item.difficulty === difficulty);
  };

  const getVocabularyByCategory = (category: string) => {
    return vocabulary.filter(item => item.category === category);
  };

  const getRandomVocabulary = (count: number) => {
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getVocabularyById = (id: string) => {
    return vocabulary.find(item => item.id === id);
  };

  return {
    vocabulary,
    loading,
    error,
    getVocabularyByDifficulty,
    getVocabularyByCategory,
    getRandomVocabulary,
    getVocabularyById,
  };
}
