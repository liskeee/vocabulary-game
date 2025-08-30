/**
 * Utility functions for text-to-speech functionality
 */

export const playPronunciation = (text: string, pronunciation?: string): void => {
  if (!text) return;
  
  // Use Web Speech API for pronunciation
  if ('speechSynthesis' in window) {
    // Use pronunciation guide if available, otherwise use the word itself
    const textToSpeak = pronunciation ? text : text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.lang = 'en-US'; // Force English language
    
    // If we have pronunciation guide, we could potentially use it for better accuracy
    // For now, we'll still use the word itself as speech synthesis works better with actual words
    speechSynthesis.speak(utterance);
  }
};
