import { create } from 'zustand';

interface EasterEggState {
  // Trigger state
  logoClickCount: number;
  lastClickTime: number;

  // Flag for discovery
  shouldTriggerDiscovery: boolean;

  // Methods
  incrementLogoClickCount: () => void;
  resetClickCount: () => void;
  acknowledgeTrigger: () => void;
}

const CLICK_THRESHOLD = 5;
const CLICK_TIMEOUT = 6000; // 6 seconds

export const useEasterEggStore = create<EasterEggState>((set, get) => ({
  logoClickCount: 0,
  lastClickTime: 0,
  shouldTriggerDiscovery: false,

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

    // When we reach the threshold, trigger discovery
    if (newCount >= CLICK_THRESHOLD) {
      set({
        logoClickCount: 0,
        lastClickTime: currentTime,
        shouldTriggerDiscovery: true // Set flag to trigger discovery
      });
      return;
    }

    // Update the click count
    set({ logoClickCount: newCount, lastClickTime: currentTime });
  },

  resetClickCount: () => {
    set({ logoClickCount: 0 });
  },

  acknowledgeTrigger: () => {
    set({ shouldTriggerDiscovery: false });
  }
}));