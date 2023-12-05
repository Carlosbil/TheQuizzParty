import React, { useEffect, useState } from 'react';
import getAvatar from '../../avatars';
import RoyaleTimer from '../timer/royaleTimer';
import { playSoundByName } from '../../sounds';
import RoyaleDisplayer from './questionRoyale';
import { socket } from '../../enpoints';
import { getCookieValue } from '../../authSlide';
import BonusDisplayer from './bonusRound';
import { toast } from 'react-toastify';

/**
 * Represents a RoomBattleRoyale component.
 * 
 * @component
 * @param {Object} prop_players - The players in the room.
 * @param {string} prop_room_id - The ID of the room.
 * @param {number} prop_health - The health of the player.
 * @returns {JSX.Element} The RoomBattleRoyale component.
 */
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
  const [players_health, setPlayers_health] = useState({}) // {name: health, name2: health2}, ...
  const [bonusOptions, setBonusOptions] = useState([])
  const [bonusAnswer, setBonusAnswer] = useState("")
  const [isBonus, setIsBonus] = useState(false)
  const [health, setHealth] = useState(prop_health)
  let token = getCookieValue("auth_token")

  // Function to handle the bonus round
  const handleBonus = () => {
    setIsBonus(isBonus => !isBonus)
  }

  // Function to save the score
  const saveScore = (score) => {
    if (score != undefined) {
      console.log("Saving health: ", health)
      setScore(score)
      let data = {
        "token": token,
        "room": room_id,
        "score": score,
        "theme": theme,
        "health": health
      };
      socket.emit('save_score', data);
    }
  }

  // Function to leave the game
  const leaveGame = () => {
    let data = {
      "token": token,
      "room": room_id
    };
    socket.emit('leave_game', data);
    window.location.href = "/"
  }

  // Function to steal health
  const steal_health = () => {
    setHealth(health => health - 6)
  }

  // Function to obtain health
  const obtain_health = () => {
    setHealth(health => health + 1)
  }

  // Function to end the round
  const endRound = (score) => {
    saveScore(score)
    if (health <= 0) {
      leaveGame()
    }
  }

  // Function to end the bonus round
  const endBonusRound = (bonus) => {
    if (bonus === null) {
      //select random option
      bonus = bonusOptions[Math.floor(Math.random() * bonusOptions.length)]
    }
    let data = {
      "token": token,
      "room": room_id,
      "bonus": bonus
    };
    console.log("el bonus es", bonus)
    socket.emit('bonus_answer', data);
    handleBonus()
  }

  useEffect(() => {
    setPlayers(prop_players);

    const firstRoundResponse = (response) => {
      setQuestions(response.questions);
      setTheme(response.theme);
      setStart(true)
    }
    socket.on('first_round', firstRoundResponse);
    socket.on('bonus', (bonus) => {
      setBonusOptions(bonus.bonus)
      handleBonus()
    })
    socket.on('players_health', (response) => {
      console.log("Players health: ", response)
      setPlayers_health(response.health)
      if(response.health[getCookieValue("username")] <= 0){
        console.log("username",response.health[getCookieValue("username")])
        setHealth(response.health[getCookieValue("username")])
        leaveGame()
      }else{
        if(response.health[getCookieValue("username")] < health){
          toast.error("Someone Stole your health!")
        }
        console.log("username",response.health[getCookieValue("username")])
        setHealth(response.health[getCookieValue("username")])
      }
    })
    return () => {
      socket.off('first_round', firstRoundResponse);
      socket.off('bonus');
      socket.off('players_health');
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
        Health: {health} <br />
      </div>
      {start && !isBonus && <RoyaleDisplayer score={setScore} steal_health={steal_health} obtain_health={obtain_health}
        questions_prop={questions} on_leave={leaveGame} onEnd={endRound} />}
      {start && isBonus && <BonusDisplayer options={bonusOptions} on_leave={leaveGame} onEnd={endBonusRound} />}
      {start && <div className='royale_scoreboard'>
        <div className="playing_battle_royale">
          {Object.entries(players).map(([name, avatar]) => (
            <div key={name} className="royale-player-card">
              <img src={getAvatar(avatar)} alt={`${name}'s avatar`} />
              <p>Life: {players_health[name]}</p>
              <p>{name}</p>
            </div>

          ))}
        </div>
      </div>}
    </div>
  );
}

export default RoomBattleRoyale;
