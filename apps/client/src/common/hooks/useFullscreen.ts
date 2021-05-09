import { MutableRefObject, useLayoutEffect, useState } from 'react';

type Element = {
  requestFullscreen(): Promise<void>;
};

export function useFullscreen<T extends Element>(ref: MutableRefObject<T>) {
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement != null);

  const setFullscreen = async () => {
    if (ref.current) {
      try {
        await ref.current.requestFullscreen();
        setIsFullscreen(document.fullscreenElement != null);
      } catch (error) {
        setIsFullscreen(false);
      }
    }
  };

  useLayoutEffect(() => {
    document.onfullscreenchange = () => setIsFullscreen(document.fullscreenElement != null);
    return () => (document.onfullscreenchange = undefined);
  });

  return { isFullscreen, setFullscreen };
}
