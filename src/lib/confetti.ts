import confetti from 'canvas-confetti';

export function fireTaskCompletionConfetti() {
  if (typeof window === 'undefined') return;
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#529871', '#8B9E87', '#B59445', '#4F8F99', '#CB7B5A'],
      disableForReducedMotion: true,
    });
  } catch (e) {
    console.warn('Confetti error:', e);
  }
}
