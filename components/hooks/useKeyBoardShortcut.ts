import { useEffect } from "react";

export interface ShortcutItem {
  callback: (event: KeyboardEvent) => void;
  targetKey: string;
  isShiftKeyPressed?: boolean;
  isAltKeyPressed?: boolean;
  isCtrlKeyPressed?: boolean;
  isMetaKeyPressed?: boolean;
  preventDefault?: boolean;
}

export function useKeyBoardShortcut(shortcuts: ShortcutItem[] = []): void {
  useEffect(() => {
    if (typeof window === "undefined" || !shortcuts.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/textareas unless explicitly handled
      const target = event.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      for (const shortcut of shortcuts) {
        const keyMatch =
          shortcut.targetKey.toLowerCase() === event.key.toLowerCase() ||
          (shortcut.targetKey.toLowerCase() === "delete" &&
            (event.key === "Delete" || event.key === "Backspace"));

        const shiftMatch = shortcut.isShiftKeyPressed
          ? event.shiftKey
          : !event.shiftKey;
        const altMatch = shortcut.isAltKeyPressed ? event.altKey : !event.altKey;
        const ctrlMatch = shortcut.isCtrlKeyPressed
          ? event.ctrlKey
          : shortcut.isCtrlKeyPressed === false
          ? !event.ctrlKey
          : true;
        const metaMatch = shortcut.isMetaKeyPressed
          ? event.metaKey
          : shortcut.isMetaKeyPressed === false
          ? !event.metaKey
          : true;

        if (keyMatch && shiftMatch && altMatch && ctrlMatch && metaMatch) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          // If within input and shortcut is simple delete, let native input work unless modifier keys pressed
          if (isInput && !shortcut.isShiftKeyPressed && !shortcut.isAltKeyPressed) {
            continue;
          }
          shortcut.callback(event);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export default useKeyBoardShortcut;
