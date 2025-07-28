import { useEffect, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  callback: (event: KeyboardEvent) => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreInputs?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param shortcuts Array of keyboard shortcuts to register
 * @param options Configuration options
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true, ignoreInputs = true } = options;

  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        ignoreInputs &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement ||
          (event.target as HTMLElement)?.contentEditable === 'true')
      ) {
        return;
      }

      // Find matching shortcut
      const matchingShortcut = shortcutsRef.current.find((shortcut) => {
        const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatches = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
        const altMatches = !!shortcut.alt === event.altKey;
        const shiftMatches = !!shortcut.shift === event.shiftKey;

        return keyMatches && ctrlMatches && altMatches && shiftMatches;
      });

      if (matchingShortcut) {
        if (preventDefault) {
          event.preventDefault();
        }
        matchingShortcut.callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, preventDefault, ignoreInputs]);

  return {
    shortcuts: shortcutsRef.current,
  };
};

/**
 * Hook specifically for review mode shortcuts
 */
export const useReviewModeShortcuts = (
  handlers: {
    onApprove: () => void;
    onReject: () => void;
    onEnable: () => void;
    onDisable: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onUndo: () => void;
    onExit: () => void;
  },
  enabled: boolean = true
) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'a',
      callback: handlers.onApprove,
      description: 'Approve current addon',
    },
    {
      key: 'r',
      callback: handlers.onReject,
      description: 'Reject current addon',
    },
    {
      key: 'd',
      callback: handlers.onReject,
      description: 'Reject current addon (alternative)',
    },
    {
      key: 'e',
      callback: handlers.onEnable,
      description: 'Enable current addon',
    },
    {
      key: 'x',
      callback: handlers.onDisable,
      description: 'Disable current addon',
    },
    {
      key: 'ArrowDown',
      callback: handlers.onNext,
      description: 'Move to next addon',
    },
    {
      key: 'j',
      callback: handlers.onNext,
      description: 'Move to next addon (vim-style)',
    },
    {
      key: 'ArrowUp',
      callback: handlers.onPrevious,
      description: 'Move to previous addon',
    },
    {
      key: 'k',
      callback: handlers.onPrevious,
      description: 'Move to previous addon (vim-style)',
    },
    {
      key: 'z',
      ctrl: true,
      callback: handlers.onUndo,
      description: 'Undo last action',
    },
    {
      key: 'Escape',
      callback: handlers.onExit,
      description: 'Exit review mode',
    },
  ];

  return useKeyboardShortcuts(shortcuts, { enabled });
};
