import confetti from 'canvas-confetti';

export function fireConfetti(): void {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.3 },
    colors: ['#C41E3A', '#8B6914', '#2D5016', '#F5F0E8'],
    decay: 0.92,
    gravity: 0.8,
  });
}
