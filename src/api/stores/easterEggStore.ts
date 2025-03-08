// src/api/stores/easterEggStore.ts
import { create } from 'zustand';

interface EasterEggState {
  // Trigger state
  logoClickCount: number;
  lastClickTime: number;

  // New flag to explicitly track discovery state
  eggTriggered: boolean;

  // Methods
  incrementLogoClickCount: () => void;
  resetClickCount: () => void;
  resetEggTriggered: () => void;
}

const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 6000; // 6 seconds

export const useEasterEggStore = create<EasterEggState>((set, get) => ({
  logoClickCount: 0,
  lastClickTime: 0,
  eggTriggered: false,

  incrementLogoClickCount: () => {
    const currentTime = Date.now();
    const { lastClickTime, logoClickCount } = get();

    console.log('Click count:', logoClickCount);

    // Reset counter if it's been too long since the last click
    if (currentTime - lastClickTime > CLICK_TIMEOUT && logoClickCount > 0) {
      set({ logoClickCount: 1, lastClickTime: currentTime });
      return;
    }

    const newCount = logoClickCount + 1;

    // When we reach the threshold, set the trigger flag instead of just resetting
    if (newCount >= CLICK_THRESHOLD) {
      set({
        logoClickCount: 0,
        lastClickTime: currentTime,
        eggTriggered: true, // Set the egg as triggered, so hook can detect it
      });
      console.log('Easter egg triggered!'); // Log to confirm the trigger
      return;
    }

    // Update the click count
    set({ logoClickCount: newCount, lastClickTime: currentTime });
  },

  resetClickCount: () => {
    set({ logoClickCount: 0 });
  },

  resetEggTriggered: () => {
    set({ eggTriggered: false });
  },
}));
