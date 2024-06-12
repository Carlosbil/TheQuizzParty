// Leaderboard.js

import React from "react";
import "./leaderboard.css";
import BackgroundBeams from "../mainPage/BackGroundBeam";

const Leaderboard = ({ players }) => {
  return (
    <div className="leaderboard relative bg-gradient-to-r from-indigo-500 via-white-500 to-blue-500 p-8 rounded-lg shadow-lg text-white">
      <BackgroundBeams />
      <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>
      <ul>
        {players.map((player, index) => (
          <li key={index} className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-4 mb-4 shadow-md">
            {index === 0 ? (
              <span className="trophy gold text-yellow-400 text-2xl">🏆</span>
            ) : index === 1 ? (
              <span className="trophy silver text-gray-300 text-2xl">🥈</span>
            ) : index === 2 ? (
              <span className="trophy bronze text-orange-500 text-2xl">🥉</span>
            ) : (
              <span className="rank text-lg font-bold bg-black bg-opacity-30 rounded-full px-3 py-1">{index + 1}</span>
            )}
            <span className="name font-medium text-lg">{player.name}</span>
            <span className="score font-bold text-lg">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default Leaderboard;
