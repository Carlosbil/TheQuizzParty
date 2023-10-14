import React, { useState, useEffect } from 'react';
import './timer.css';

function ClockTimer(props) {
  const [timeRemaining, setTimeRemaining] = useState(props.initialTime || 600);
  useEffect(() => {
    let timer;
    if (!props.shouldStop && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
        props.onTimeChange(timeRemaining - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
      if (props.onTimeEnd) props.onTimeEnd();
    }
    return () => clearTimeout(timer);  // Cleanup on unmount
  }, [timeRemaining, props.shouldStop]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="clock-timer">
      <div className="clock-face">
        <span className="clock-time">{formatTime(timeRemaining)}</span>
      </div>
    </div>
  );
}

export default ClockTimer;
