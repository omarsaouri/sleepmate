import { useState } from 'react';
import { useVideoInfo } from './hooks/useVideoInfo';
import { useCountdown } from './hooks/useCountdown';

export default function App() {
  const { videoInfo, error } = useVideoInfo();
  const [inputValue, setInputValue] = useState(10); // input value in minutes
  const { seconds, isRunning, start, pause, reset } = useCountdown(inputValue);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/^0+/, '');
    setInputValue(Number(value));
  };

  const handleStart = () => {
    reset(inputValue); // set countdown to inputValue
    start();
  };

  return (
    <div className="bg-neutral-800 text-white flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-4xl text-amber-700 font-bold">Sleepmate 😴</h1>
      <p className="text-md text-gray-300">Save your battery and what you were watching!</p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <input
            type="number"
            className="bg-gray-200 rounded-md text-black p-1.5 w-20"
            value={inputValue}
            min="0"
            readOnly={isRunning}
            onChange={handleInputChange}
          />
          <span className="font-semibold">minutes</span>
        </div>

        <button
          onClick={handleStart}
          disabled={isRunning || inputValue === 0}
          className="p-2 bg-amber-500 text-black rounded-md hover:bg-amber-700 hover:text-white transition-all shadow-md"
        >
          {isRunning ? 'Running...' : 'Start Sleeping'}
        </button>

        {isRunning && <p className="text-gray-300">Time remaining: {seconds} second(s)</p>}

        <div className="flex gap-2">
          <button
            onClick={pause}
            disabled={!isRunning}
            className="p-2 bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Pause
          </button>
          <button
            onClick={() => reset(inputValue)}
            className="p-2 bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
