import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function useCountdown(initialMinutes = 0) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const toggle = useCallback(() => setIsRunning((prev) => !prev), []);

  const reset = useCallback(
    (newMinutes = initialMinutes) => {
      setMinutes(newMinutes);
      setSeconds(0);
      setIsRunning(false);
    },
    [initialMinutes]
  );

  const sleepMac = async () => {
    try {
      await invoke('sleep_mac');
    } catch (error) {
      console.log('Error encountered while trying to sleep the mac', error);
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    if (minutes === 0 && seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        // stop exactly at 00:00
        if (minutes === 0 && prev === 0) {
          return 0;
        }

        if (prev > 0) return prev - 1;

        // prev is 0 → borrow a minute
        setMinutes((m) => m - 1);
        return 59;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  useEffect(() => {
    if (isRunning && minutes === 0 && seconds === 0) {
      setIsRunning(false);
      sleepMac();
      reset();
    }
  }, [minutes, seconds, isRunning]);

  return {
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    reset,
    toggle,
  };
}
