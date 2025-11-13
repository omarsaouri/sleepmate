import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Reset the timer
  const reset = useCallback(
    (newSeconds = initialSeconds) => {
      setSeconds(newSeconds);
      setIsRunning(false);
    },
    [initialSeconds]
  );

  const sleepMac = async () => {
    try {
      await invoke('sleep_mac');
    } catch (error) {
      console.log('Error encountered while trying to sleep the mac', error);
    }
  };

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  // Handle timer reaching zero
  useEffect(() => {
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      sleepMac();
    }
  }, [seconds, isRunning]);

  return { seconds, isRunning, start, pause, reset, toggle };
}
