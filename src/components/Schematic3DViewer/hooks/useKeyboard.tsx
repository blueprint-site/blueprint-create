import { useCallback, useEffect, useState } from "react";

const keyActionMap = new Map([
  ["KeyW", "moveForward"],
  ["KeyS", "moveBackward"],
  ["KeyA", "moveLeft"],
  ["KeyD", "moveRight"],
  ["Space", "jump"],
  ["ShiftLeft", "shift"],
]);

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    shift: false,
  });

  const [actionStr, setActionStr] = useState("");

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const action = keyActionMap.get(e.code);
    if (action) {
      setActions((prev) => ({
        ...prev,
        [action]: true,
      }));
      setActionStr(action);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const action = keyActionMap.get(e.code);
    if (action) {
      setActions((prev) => ({
        ...prev,
        [action]: false,
      }));
      setActionStr(action);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { actions, actionStr };
};
