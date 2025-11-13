import { useEffect, useState } from 'react';
import { useVideoInfo } from './hooks/useVideoInfo';
import { useCountdown } from './hooks/useCountdown';

export default function App() {
  const { videoInfo, error } = useVideoInfo();
  const [inputValue, setInputValue] = useState(10);
  const { seconds, isRunning, toggle, pause, start, reset } = useCountdown(inputValue);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/^0+/, '');
    setInputValue(Number(value));
  };

  const handleStart = () => {
    reset(inputValue);
    start();
  };

  useEffect(() => {
    console.log(videoInfo);
  }, [videoInfo]);

  return (
    <div className="bg-background text-copy flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-4xl text-primary-content font-bold">Sleepmate 😴</h1>
      <p className="text-md text-copy-lighter">Save your battery and what you were watching!</p>

      <div className="flex flex-col gap-3 bg-foreground p-10 rounded-xl">
        <div className="flex flex-col gap-3 items-center">
          {isRunning && (
            <p>
              You are watching <a href={videoInfo.url}>{videoInfo.title}</a>
            </p>
          )}
          {!isRunning && (
            <h2 className="text-copy font-semibold">What time do you expect to go to sleep?</h2>
          )}
          <div className="flex items-center gap-4">
            {isRunning ? (
              <p className="text-copy-lighter">
                Time remaining before mac goes to sleep: {seconds} second(s)
              </p>
            ) : (
              <>
                <input
                  type="number"
                  className="rounded-md text-copy p-1.5 w-20 bg-background border-border border-2"
                  value={inputValue}
                  min="0"
                  readOnly={isRunning}
                  onChange={handleInputChange}
                />
                <span className="text-copy-lighter">minutes</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-6 mt-4 justify-center">
          <button
            className={`py-2 px-4 rounded-md transition-all shadow-lg hover:shadow-none ${
              isRunning
                ? 'bg-secondary text-secondary-content hover:bg-secondary-light'
                : 'bg-primary text-primary-content hover:bg-primary-light hover:text-white'
            }`}
            onClick={toggle}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => reset(inputValue)}
            className="py-2 px-4 rounded-md transition-all shadow-lg bg-primary-dark text-primary-content hover:bg-primary-light hover:shadow-none"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
