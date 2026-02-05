import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

let intervalId: ReturnType<typeof setInterval> | null = null;

interface TimerProps {
  reiniciar: boolean;
  onStartGame: () => void;
  highlightPlay: boolean;
  onTimeChange: (segundos: number) => void;
  stop: boolean;
}

const Timer: React.FC<TimerProps> = ({
  reiniciar,
  onStartGame,
  highlightPlay,
  onTimeChange,
  stop,
}) => {
  const [actualTime, setActualTime] = useState(0);
  const [btnPlayPause, setBtnPlayPause] = useState("Play");
  const [isPaused, setIsPaused] = useState(false);

  const initTimer = () => {
    if (intervalId) {
      pauseTimer();
      setBtnPlayPause("Play");
      return;
    }
    if (isPaused) {
      setIsPaused(false);
    }
    if (!intervalId) {
      if (actualTime === 0) {
        onTimeChange(0);
      }
      onStartGame();
      intervalId = setInterval(() => {
        setActualTime((prevTime) => {
          const nextTime = prevTime + 1;
          onTimeChange(nextTime);
          return nextTime;
        });
      }, 1000);
      setBtnPlayPause("Pause");
    }
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      setIsPaused(true);
    }
  };

  const clearTimer = () => {
    setActualTime(0);
    onTimeChange(0);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    setBtnPlayPause("Play");
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    if (reiniciar) {
      clearTimer();
    }
  }, [reiniciar]);

  useEffect(() => {
    if (stop && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      setBtnPlayPause("Play");
      setIsPaused(false);
    }
  }, [stop]);

  const formatTime = () => {
    const getSeconds = `0${actualTime % 60}`.slice(-2);
    // Convert minutes to a number before performing the modulo operation
    const minutes = Math.floor(actualTime / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(actualTime / 3600)}`.slice(-2);
  
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };
  

  return (
    <div className="timer">
      <Typography variant="h4" className="timer-display">
        {formatTime()}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={initTimer}
        className={highlightPlay ? "play-button highlight" : "play-button"}
        fullWidth
      >
        {btnPlayPause}
      </Button>
    </div>
  );
};

export default Timer;
