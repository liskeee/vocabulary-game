import { useState, useCallback } from 'react';
import { GameState, QuizAnswer, FlashcardProgress, UserStats, GameSession } from '@/types/game';
import { useLocalStorage } from './useLocalStorage';

export function useGameState(gameType: 'quiz' | 'flashcard') {
  const [gameState, setGameState] = useLocalStorage<GameState>(`${gameType}-state`, {
    currentIndex: 0,
    score: 0,
    totalQuestions: 0,
    answeredQuestions: [],
    startTime: Date.now(),
    isComplete: false,
  });

  const [userStats, setUserStats] = useLocalStorage<UserStats>('user-stats', {
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    quizStats: {
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageTimePerQuestion: 0,
    },
    flashcardStats: {
      totalCards: 0,
      knownCards: 0,
      masteryPercentage: 0,
    },
    streakDays: 0,
    lastPlayedDate: new Date().toISOString().split('T')[0],
  });

  const [gameSessions, setGameSessions] = useLocalStorage<GameSession[]>('game-sessions', []);

  const startGame = useCallback((totalQuestions: number) => {
    setGameState({
      currentIndex: 0,
      score: 0,
      totalQuestions,
      answeredQuestions: [],
      startTime: Date.now(),
      isComplete: false,
    });
  }, [setGameState]);

  const nextQuestion = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  }, [setGameState]);

  const addScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, [setGameState]);

  const markQuestionAnswered = useCallback((questionIndex: number) => {
    setGameState(prev => ({
      ...prev,
      answeredQuestions: [...prev.answeredQuestions, questionIndex],
    }));
  }, [setGameState]);

  const completeGame = useCallback(() => {
    const endTime = Date.now();
    const session: GameSession = {
      gameType,
      startTime: gameState.startTime,
      endTime,
      score: gameState.score,
      totalQuestions: gameState.totalQuestions,
      correctAnswers: gameState.answeredQuestions.length,
      difficulty: 'medium', // This could be dynamic based on selected difficulty
    };

    setGameSessions(prev => [...prev, session]);
    
    setGameState(prev => ({
      ...prev,
      isComplete: true,
    }));

    // Update user stats
    setUserStats(prev => {
      const newTotalGames = prev.totalGamesPlayed + 1;
      const newTotalScore = prev.totalScore + gameState.score;
      const newAverageScore = newTotalScore / newTotalGames;

      const updatedStats = {
        ...prev,
        totalGamesPlayed: newTotalGames,
        totalScore: newTotalScore,
        averageScore: newAverageScore,
        lastPlayedDate: new Date().toISOString().split('T')[0],
      };

      if (gameType === 'quiz') {
        const newTotalQuestions = prev.quizStats.totalQuestions + gameState.totalQuestions;
        const newCorrectAnswers = prev.quizStats.correctAnswers + gameState.answeredQuestions.length;
        const gameTime = (endTime - gameState.startTime) / 1000;
        const avgTimePerQuestion = gameTime / gameState.totalQuestions;

        updatedStats.quizStats = {
          totalQuestions: newTotalQuestions,
          correctAnswers: newCorrectAnswers,
          accuracy: (newCorrectAnswers / newTotalQuestions) * 100,
          averageTimePerQuestion: (prev.quizStats.averageTimePerQuestion + avgTimePerQuestion) / 2,
        };
      }

      return updatedStats;
    });
  }, [gameType, gameState, setGameState, setGameSessions, setUserStats]);

  const resetGame = useCallback(() => {
    setGameState({
      currentIndex: 0,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: [],
      startTime: Date.now(),
      isComplete: false,
    });
  }, [setGameState]);

  return {
    gameState,
    userStats,
    gameSessions,
    startGame,
    nextQuestion,
    addScore,
    markQuestionAnswered,
    completeGame,
    resetGame,
  };
}
