// src/api/stores/easterEggStore.ts
import { create } from 'zustand';

interface EasterEggState {
  // Trigger state
  logoClickCount: number;
  lastClickTime: number;

  // Methods
  incrementLogoClickCount: () => void;
  resetClickCount: () => void;
}

const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 6000; // 6 seconds

export const useEasterEggStore = create<EasterEggState>((set, get) => ({
  logoClickCount: 0,
  lastClickTime: 0,

  incrementLogoClickCount: () => {
    const currentTime = Date.now();
    const { lastClickTime, logoClickCount } = get();

    console.log('Incrementing click count');
    console.log('Current time:', currentTime);
    console.log('Last click time:', lastClickTime);
    console.log('Click count:', logoClickCount);

    // Reset counter if it's been too long since the last click
    if (currentTime - lastClickTime > CLICK_TIMEOUT && logoClickCount > 0) {
      set({ logoClickCount: 1, lastClickTime: currentTime });
      return;
    }

    const newCount = logoClickCount + 1;

    // Reset the counter when we reach the threshold
    // The actual easter egg discovery will be handled in the hook
    if (newCount >= CLICK_THRESHOLD) {
      set({ logoClickCount: 0, lastClickTime: currentTime });
      return;
    }

    // Update the click count
    set({ logoClickCount: newCount, lastClickTime: currentTime });
  },

  resetClickCount: () => {
    set({ logoClickCount: 0 });
  }
}));