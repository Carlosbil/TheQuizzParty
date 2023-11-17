import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';
import RoyaleTimer from '../timer/royaleTimer';
import { playSoundByName } from '../../sounds';
function RoomBattleRoyale({ prop_players, prop_room_id }) {

  let time = 4
  const [players, setPlayers] = useState(prop_players) // {name: avatar, name2: avatar2}, ...
  const [room_id, setRoom_id] = useState(prop_room_id)
  const [remainingTime, setRemainingTime] = useState(time);  // 10 minutes
  const [end, setEnd] = useState(false)
  const [start, setStart] = useState(false)

  function startGame () {
    setStart(true)
  }

  useEffect(() => {
    setPlayers(prop_players);
  }, [prop_players]);


  const handleTimeChange = (time) => {
    if (time === 8) {
      playSoundByName("clock_ending");
    }
    setRemainingTime(time);
  };
  return (
    <div>
      {!start && <RoyaleTimer initialTime={time} onTimeChange={handleTimeChange} onTimeEnd={startGame} />}
      <h1>Sala {room_id}</h1>
      {!start && <div className="room_battle_royale">
        {Object.entries(players).map(([name, avatar]) => (
          <div key={name} className="player-card">
            <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
            <p>{name}</p>
          </div>
        ))}
      </div>}
      {start && <div className="room_battle_royale">
        Empezamos!
        </div>}
    </div>
  );
}

export default RoomBattleRoyale;
