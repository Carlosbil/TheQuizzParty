import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';

function RoomBattleRoyale({ prop_players, prop_room_id }) {

  const[players, setPlayers] = useState(prop_players) // {name: avatar, name2: avatar2}, ...
  const[room_id, setRoom_id] = useState(prop_room_id)
    
  useEffect(() => {
    setPlayers(prop_players);
  }, [prop_players]);
  
  return (
    <div className="room_battle_royale">
      {Object.entries(players).map(([name, avatar]) => (
        <div key={name} className="player-card">
          <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
}

export default RoomBattleRoyale;
