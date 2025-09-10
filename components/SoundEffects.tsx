"use client";

import { useEffect } from 'react';

export function SoundEffects() {
  useEffect(() => {
    // Clash Royale Sound Effects
    const playSound = (soundType: string) => {
      // Create audio context for sound effects
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      switch (soundType) {
        case 'button-click':
          // Button click sound
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'card-select':
          // Card selection sound
          const cardOscillator = audioContext.createOscillator();
          const cardGainNode = audioContext.createGain();
          
          cardOscillator.connect(cardGainNode);
          cardGainNode.connect(audioContext.destination);
          
          cardOscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          cardOscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
          
          cardGainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          cardGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          
          cardOscillator.start(audioContext.currentTime);
          cardOscillator.stop(audioContext.currentTime + 0.05);
          break;
          
        case 'success':
          // Success sound
          const successOscillator = audioContext.createOscillator();
          const successGainNode = audioContext.createGain();
          
          successOscillator.connect(successGainNode);
          successGainNode.connect(audioContext.destination);
          
          successOscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          successOscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
          successOscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
          
          successGainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          successGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          successOscillator.start(audioContext.currentTime);
          successOscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'error':
          // Error sound
          const errorOscillator = audioContext.createOscillator();
          const errorGainNode = audioContext.createGain();
          
          errorOscillator.connect(errorGainNode);
          errorGainNode.connect(audioContext.destination);
          
          errorOscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          errorOscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
          
          errorGainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          errorGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          errorOscillator.start(audioContext.currentTime);
          errorOscillator.stop(audioContext.currentTime + 0.2);
          break;
      }
    };

    // Add click event listeners to buttons
    const addSoundToButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          if (button.disabled) return;
          playSound('button-click');
        });
      });
    };

    // Add sound to card selections
    const addSoundToCards = () => {
      const cards = document.querySelectorAll('[data-card]');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          playSound('card-select');
        });
      });
    };

    // Initialize sounds
    addSoundToButtons();
    addSoundToCards();

    // Re-add sounds when DOM changes
    const observer = new MutationObserver(() => {
      addSoundToButtons();
      addSoundToCards();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
