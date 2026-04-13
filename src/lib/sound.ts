let pageSound: HTMLAudioElement | null = null;

export function playPageTurn(): void {
  try {
    if (!pageSound) {
      pageSound = new Audio('/sounds/page-turn.mp3');
      pageSound.volume = 0.3;
    }
    pageSound.currentTime = 0;
    pageSound.play().catch(() => {
      // Silently ignore: browser may block autoplay before user interaction
    });
  } catch {
    // Ignore if Audio is unavailable (SSR, tests)
  }
}
