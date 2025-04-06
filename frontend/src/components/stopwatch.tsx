/**
 * Chatgpt-ass radioactive zone
 */

import { useState, useRef, useEffect } from "react";

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null); // ✅ Correction ici

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const startPause = (): void => {
    if (isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = window.setInterval(() => { // ✅ window.setInterval pour être sûr en navigateur
        setTime(Date.now() - startTime);
      }, 250);
    }
    setIsRunning(!isRunning);
  };

  const reset = (): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="stopwatch-container">
      <div className="sw-buttons">
        <button onClick={startPause}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className="display">{formatTime(time)}</div>
    </div>
  );
};

export default Stopwatch;
