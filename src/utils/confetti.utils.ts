import confetti from 'canvas-confetti';

export function triggerPastelConfetti(): void {
  try {
    // Pastel palette conforming to the Modern Editorial Soft Minimalist palette
    const colors = ['#B86B70', '#58755E', '#DFB15B', '#F2DFDC', '#E8F0EA'];

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.75 },
      colors,
      disableForReducedMotion: true,
      ticks: 120,
      gravity: 0.8,
      scalar: 0.9,
    });
  } catch (error) {
    // Fail silently if canvas-confetti cannot run (e.g. in test or unsupported environment)
    console.debug('Confetti effect skipped:', error);
  }
}
