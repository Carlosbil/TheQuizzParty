// Leaderboard.js

import React from "react";
import "./leaderboard.css";

const Leaderboard = ({ players }) => {
  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <ul>
        {players.map((player, index) => (
          <li key={index} className="player">
            {index === 0 ? <span className="trophy gold">🏆</span> :
             index === 1 ? <span className="trophy silver">🥈</span> :
             index === 2 ? <span className="trophy bronze">🥉</span> :
            <span className="rank">{index + 1}</span>}
            <span className="name">{player.name}</span>
            <span className="score">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
