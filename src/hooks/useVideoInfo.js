import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

export function useVideoInfo() {
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const setupListener = async () => {
      try {
        const unlisten = await listen('video-update', (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.payload);
            setVideoInfo(data);
          } catch (e) {
            setError(e);
          }
        });

        return () => {
          isMounted = false;
          unlisten();
        };
      } catch (e) {
        setError(e);
      }
    };

    const cleanupPromise = setupListener();

    return () => {
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, []);

  return { videoInfo, error };
}
