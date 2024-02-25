import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

let intervalId: NodeJS.Timeout | null = null;

interface TimerProps {
  reiniciar: boolean;
  onReiniciarJuego: () => void;
}

const Timer: React.FC<TimerProps> = ({ reiniciar, onReiniciarJuego }) => {
  const [actualTime, setActualTime] = useState(0);
  const [btnPlayPause, setBtnPlayPause] = useState("Play");
  const [isPaused, setIsPaused] = useState(false);

  const initTimer = () => {
    if (intervalId || isPaused) {
      setBtnPlayPause("Play");
      pauseTimer();
      setIsPaused(false);
      window.location.reload()
    } else {
      intervalId = setInterval(() => {
        setActualTime((prevTime) => prevTime + 1);
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
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    setBtnPlayPause("Play");
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

  const formatTime = () => {
    const getSeconds = `0${actualTime % 60}`.slice(-2);
    // Convert minutes to a number before performing the modulo operation
    const minutes = Math.floor(actualTime / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(actualTime / 3600)}`.slice(-2);
  
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };
  

  return (
    <div>
      <div>
        <Typography variant="h3">{formatTime()}</Typography>
      </div>

      <Button variant="contained" color="primary" onClick={initTimer}>
        {btnPlayPause}
      </Button>
    </div>
  );
};

export default Timer;
