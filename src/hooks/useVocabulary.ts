import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/types/game';

export function useVocabulary() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        const response = await fetch('/vocabulary.json');
        if (!response.ok) {
          throw new Error('Failed to fetch vocabulary data');
        }
        const data = await response.json();
        setVocabulary(data as VocabularyItem[]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vocabulary data');
        setLoading(false);
      }
    };

    loadVocabulary();
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
