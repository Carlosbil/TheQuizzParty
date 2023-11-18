import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';
import RoyaleTimer from '../timer/royaleTimer';
import { playSoundByName } from '../../sounds';
import RoyaleDisplayer from './questionRoyale';
import { socket } from '../../enpoints';
import { getCookieValue } from '../../authSlide';
function RoomBattleRoyale({ prop_players, prop_room_id }) {

  let time = 4
  const [players, setPlayers] = useState(prop_players) // {name: avatar, name2: avatar2}, ...
  const [room_id, setRoom_id] = useState(prop_room_id)
  const [remainingTime, setRemainingTime] = useState(time);  // 10 minutes
  const [end, setEnd] = useState(false)
  const [start, setStart] = useState(false)
  const [questions, setQuestions] = useState([])
  const [theme, setTheme] = useState("")
  const [score, setScore] = useState(0);

  const leaveGame = () => {
    let data = {
      "token": getCookieValue("auth_token"),
      "room": room_id
    };
    socket.emit('leave_game', data);
    window.location.href = "/"
  }

  const endRound = (score) => {
    console.log("Round end!")
    console.log(score)
  }

  useEffect(() => {
    setPlayers(prop_players);

    socket.on('first_round', (data) => {
      console.log(data.questions)
      setQuestions(data.questions);
      setTheme(data.theme);
      setStart(true)
    });

  }, [prop_players]);


  const handleTimeChange = (time) => {
    if (time === 8) {
      playSoundByName("clock_ending");
    }
    setRemainingTime(time);
  };
  return (
    <div>
      {!start && <RoyaleTimer initialTime={time} onTimeChange={handleTimeChange} onTimeEnd={endRound} />}
      <h1>Sala {room_id}</h1>
      {!start && <div className="room_battle_royale">
        {Object.entries(players).map(([name, avatar]) => (
          <div key={name} className="player-card">
            <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
            <p>{name}</p>
          </div>
        ))}
      </div>}
      {start && <RoyaleDisplayer questions_prop={questions} on_leave={leaveGame} onEnd={endRound} />}
    </div>
  );
}

export default RoomBattleRoyale;
