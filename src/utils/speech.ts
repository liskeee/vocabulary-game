/**
 * Utility functions for text-to-speech functionality
 */

export const playPronunciation = (text: string): void => {
  if (!text) return;
  
  // Use Web Speech API for pronunciation
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.lang = 'en-US'; // Force English language
    speechSynthesis.speak(utterance);
  }
};
