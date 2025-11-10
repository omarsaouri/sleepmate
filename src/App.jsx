import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function App() {
  const [seconds, setSeconds] = useState('0');
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPostion] = useState(0);

  const startTimer = () => {
    if (seconds > 0) setIsRunning(true);
  };

  const fetchCurrentVideo = async () => {
    const browser = await invoke('get_used_browser');
    console.log(browser);
    const tabs = await invoke('get_browser_tabs', { browser });
    console.log(tabs);
  };

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000); // 1 second interval
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      invoke('sleep_mac');
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  return (
    <div className="bg-neutral-800 text-white flex flex-col items-center justify-center gap-2 h-screen">
      <h1 className="text-4xl text-amber-700 font-bold">Sleepmate 😴</h1>
      <p className="text-md text-gray-300">Save your battery and what you were watching!</p>
      <div className="flex flex-col gap-3 ">
        <div className="flex gap-3 items-center">
          <input
            className="bg-gray-200 rounded-md text-black p-1.5 w-20"
            type="number"
            name="time"
            value={seconds}
            min="0"
            readOnly={isRunning}
            onChange={(e) => {
              let value = e.target.value;
              if (value.length > 1) {
                value = value.replace(/^0+/, '');
              }
              setSeconds(value);
            }}
          />
          <p className="font-semibold">minutes</p>
        </div>
        <button
          onClick={startTimer}
          disabled={isRunning || seconds === 0}
          className="p-1.5 bg-amber-500 text-black rounded-md hover:bg-amber-700 hover:text-white transition-all shadow-md"
        >
          Start Sleeping
        </button>
      </div>
      {isRunning && <p>Time remaining: {seconds} second(s)</p>}
      <button onClick={fetchCurrentVideo}>detect</button>
    </div>
  );
}
