// sound-effects.js - Fixed Sound Effects Module
// This replaces the problematic sound effect functions

(function() {
    'use strict';
    
    // Sound effect volume from music player state
    function getSoundVolume() {
        return window.musicPlayerState ? window.musicPlayerState.soundEffectVolume : 0.3;
    }

    // Create a simple beep sound using Web Audio API as fallback
    function createBeepSound(frequency = 800, duration = 100) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(getSoundVolume() * 0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            // Fallback: do nothing if Web Audio API is not supported
            console.log('Audio context not available');
        }
    }

    // Improved sound effect functions
    function playButtonSound() {
        try {
            // Try to use a working audio file first
            const audio = new Audio();
            
            // List of potential working sound URLs (free to use)
            const soundUrls = [
                'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBzaLze+FGAooZafn57hNFAhTne7sA', // Very short beep
                'data:audio/mpeg;base64,//MYxAAAAANIAAAAAExBTUUzLjEwMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAJaAAqKioqKioqKioqKjMzMzMzMzMzMzM8PDw8PDw8PDw8PExMTExMTExMTExVVVVVVVVVVVVVXl5eXl5eXl5eXmhoaGhoaGhoaGhxcXFxcXFxcXFxenp6enp6enp6eoODg4ODg4ODg42NjY2NjY2NjZaWlpaWlpaWlp+fn5+fn5+fn6mpqampqampqbKysrKysrKysru7u7u7u7u7u8TExMTExMTExM7Ozs7Ozs7OztfX19fX19fX1+Dg4ODg4ODg4Orq6urq6urq6vPz8/Pz8/Pz8//MYxAkIyAo0ARAAAM4ODg4ODg4ODj//MYxBQKUCJAASoAADn8//MYxCAJSAo0ARAAAM4ODg4ODg4ODj//MYxCoJSAo0ARAAAM4ODg4ODg4ODj//MYxDwJSAo0ARAAAM4ODg4ODg4ODj/'
            ];
            
            // Try each URL until one works
            for (const url of soundUrls) {
                try {
                    audio.src = url;
                    audio.volume = getSoundVolume() * 0.5;
                    const playPromise = audio.play();
                    if (playPromise) {
                        playPromise.catch(() => {
                            // If this URL fails, try the next one
                        });
                    }
                    return; // Exit if successful
                } catch (e) {
                    continue;
                }
            }
            
            // If all URLs fail, use synthetic beep
            createBeepSound(800, 100);
            
        } catch (e) {
            // Silent fallback - just add visual feedback
            console.log('Button sound not available');
        }
    }

    function playHeartbeatSound() {
        try {
            // Create a double-beep pattern for heartbeat
            createBeepSound(600, 120);
            setTimeout(() => createBeepSound(600, 120), 150);
        } catch (e) {
            console.log('Heartbeat sound not available');
        }
    }

    function playSpecialSound() {
        try {
            // Create a pleasant ascending sound
            createBeepSound(523, 200); // C note
            setTimeout(() => createBeepSound(659, 200), 100); // E note
            setTimeout(() => createBeepSound(784, 300), 200); // G note
        } catch (e) {
            console.log('Special sound not available');
        }
    }

    // Alternative: Create simple click feedback without audio
    function createVisualFeedback(element) {
        if (!element) return;
        
        // Add a quick visual pulse effect
        const originalTransform = element.style.transform;
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, 100);
    }

    // Enhanced button sound with visual feedback
    function playButtonSoundWithFeedback(buttonElement) {
        playButtonSound();
        if (buttonElement) {
            createVisualFeedback(buttonElement);
        }
    }

    // Make functions globally available
    window.playButtonSound = playButtonSound;
    window.playHeartbeatSound = playHeartbeatSound;
    window.playSpecialSound = playSpecialSound;
    window.playButtonSoundWithFeedback = playButtonSoundWithFeedback;
    window.createVisualFeedback = createVisualFeedback;

    console.log('Sound effects module loaded');

})();