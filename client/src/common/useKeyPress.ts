import { useEffect, useState } from 'react';

export function useKeyPress(targetKey: string, start: boolean) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: any) => {
      if (key === targetKey.toLowerCase()) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: any) => {
      if (key === targetKey.toLowerCase()) {
        setKeyPressed(false);
      }
    };

    if (start) {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
    }

    if (!start) {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [start, targetKey]);

  return keyPressed;
}
