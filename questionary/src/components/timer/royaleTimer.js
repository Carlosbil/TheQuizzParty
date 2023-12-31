import React, { useState, useEffect } from "react";
import "./timer.css";
import { socket } from "../../enpoints";

function RoyaleTimer(props) {
  const [timeRemaining, setTimeRemaining] = useState(props.initialTime || 600);
  useEffect(() => {

    // Escuchar eventos del temporizador del servidor
    socket.on("timer", (data) => {
      setTimeRemaining(data.time);
      props.onTimeChange(data.time);
    });


    socket.on("timer_end", () => {
      props.onTimeEnd();
      // Realizar la acción necesaria cuando el temporizador llega a cero
    });
    return () => {
      socket.off("timer");
      socket.off("timer_end");
    };
  }, [timeRemaining, props.shouldStop, props.onTimeChange, props.onTimeEnd]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="clock-timer">
      <div className="clock-face">
        <span className="clock-time">{formatTime(timeRemaining)}</span>
      </div>
    </div>
  );
}

export default RoyaleTimer;
