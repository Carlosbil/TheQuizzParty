import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';
import ClockTimer from '../timer/timer';
import { toast } from 'react-toastify';
import { playSoundByName } from '../../sounds';
import RoyaleTimer from '../timer/royaleTimer';
import DropdownMenu from '../homebotton/homebotton';
import { socket } from '../../enpoints';
import { getCookieValue } from '../../authSlide';

/**
 * Component that displays the Battle Royale room.
 * 
 * @param {Object} props Component props.
 * @param {Object} props.prop_players Players in the room.
 * @param {string} props.prop_room_id Room id.
 * @returns {JSX.Element} JSX element containing the Battle Royale room.
 */

function RoomBattleRoyale({ prop_players, prop_room_id }) {
  let time = 60
  const avatar = getCookieValue("avatar")
  const [players, setPlayers] = useState(prop_players) // {name: avatar, name2: avatar2}, ...
  const [room_id, setRoom_id] = useState(prop_room_id)
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(time)
  const [end, setEnd] = useState(false) 

  const handleLogoClick = () => {
    socket.emit('leave_game', { token: getCookieValue("auth_token") });
  };

  function handleEndClock() {
    toast.info("Comenzando la partida de la partida");
  }

  const handleTimeChange = (time) => {
    if (time === 8) {
      playSoundByName("clock_ending");
    }
    setRemainingTime(time);
  };
  useEffect(() => {
    setPlayers(prop_players);
  }, [prop_players]);

  return (
    <div>
      <DropdownMenu onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
      <h1>Esperando a más jugadores</h1>
      <h2>Sala {room_id}</h2>
      <RoyaleTimer
            initialTime={time}
            onTimeEnd={() => handleEndClock()}
            onTimeChange={(remainingTime) => handleTimeChange(remainingTime)}
            shouldStop={end}
          />
      <div className="room_battle_royale">
        {Object.entries(players).map(([name, avatar]) => (
          <div key={name} className="player-card">
            <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomBattleRoyale;
