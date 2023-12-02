import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';
import RoyaleTimer from '../timer/royaleTimer';
import { playSoundByName } from '../../sounds';
import RoyaleDisplayer from './questionRoyale';
import { socket } from '../../enpoints';
import { getCookieValue } from '../../authSlide';
import BonusDisplayer from './bonusRound';
function RoomBattleRoyale({ prop_players, prop_room_id, prop_health }) {

  let time = 4
  const [players, setPlayers] = useState(prop_players) // {name: avatar, name2: avatar2}, ...
  const [room_id, setRoom_id] = useState(prop_room_id)
  const [remainingTime, setRemainingTime] = useState(time);  // 10 minutes
  const [end, setEnd] = useState(false)
  const [start, setStart] = useState(false)
  const [questions, setQuestions] = useState([])
  const [theme, setTheme] = useState("")
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [bonusOptions, setBonusOptions] = useState([])
  const [bonusAnswer, setBonusAnswer] = useState("")
  const [isBonus, setIsBonus] = useState(false)
  const [health, setHealth] = useState(prop_health)

  const handleBonus = () => {
    setIsBonus(isBonus => !isBonus)
  }
  const saveScore = (score) => {
    if (score != undefined){
      setScore(score)
      console.log("el score es", score)
      let data = {
        "token": getCookieValue("auth_token"),
        "room": room_id,
        "score": score,
        "theme": theme
      };
      socket.emit('save_score', data);
    }
  }

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
    saveScore(score)
  }

  const endBonusRound = (bonus) => {
    console.log("Bonus Round end!")
    if (bonus === null){
      //select random option
      bonus = bonusOptions[Math.floor(Math.random() * bonusOptions.length)]
    }
    console.log("el bonus es", bonus)
    handleBonus()
    setBonusAnswer(bonus)
  }

  useEffect(() => {
    setPlayers(prop_players);

    const firstRoundResponse = (response) => {
      console.log("la preguntas son" ,response);
      setQuestions(response.questions);
      setTheme(response.theme);
      setStart(true)
    }
    socket.on('first_round', firstRoundResponse);
    socket.on('bonus', (bonus)=>{
      console.log("Posibles bonus: ", bonus)
      setBonusOptions(bonus.bonus)
      handleBonus()
    })
    return () => {
      socket.off('first_round', firstRoundResponse);
      socket.off('bonus');
    };
  }, [prop_players, bonusOptions]);


  const handleTimeChange = (time) => {
    if (time === 5) {
      playSoundByName("clock_ending");
    }
    setRemainingTime(time);
  };
  return (
    <div>
      {<RoyaleTimer initialTime={time} onTimeChange={handleTimeChange} onTimeEnd={endRound} />}
      {!start && <h1>Sala {room_id}</h1>}
      {!start && <div className="room_battle_royale">
        {Object.entries(players).map(([name, avatar]) => (
          <div key={name} className="player-card">
            <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
            <p>{name}</p>
          </div>
        ))}
      </div>}
      <div className="scoreboard">
        health: {health} <br />
      </div>
      {start && !isBonus && <RoyaleDisplayer score={setScore} health={setHealth} questions_prop={questions} on_leave={leaveGame} onEnd={endRound} />}
      {start && isBonus && <BonusDisplayer options={bonusOptions} on_leave={leaveGame} onEnd={endBonusRound} />}

    </div>
  );
}

export default RoomBattleRoyale;
