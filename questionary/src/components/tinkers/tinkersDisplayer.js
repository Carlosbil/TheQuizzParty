import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClockTimer from '../timer/timer';
import './tinkers.css'
import Leaderboard from '../leaderboard/leaderboard';
import { GET_TINKERS_SCORE_URL, TINKERS_SCORE_URL } from '../../enpoints';
import { getCookieValue } from '../../authSlide';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { playSoundByName } from '../../sounds';

function TinkersDisplayer({ questions_prop }) {


  let time = 60
  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [next, setNext] = useState(false)
  const [position, setPosition] = useState(0)
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(time);  // 10 minutes
  const [end, setEnd] = useState(false)
  const players = [
    { name: "Juan", score: 100 },
    { name: "Ana", score: 90 },
    { name: "Marta", score: 85 },
  ];
  const [leaderboard, setLeaderboard] = useState(players)

  const handleButtonClick = (option) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      if (option === answer) {
        playSoundByName("good_sound");
        handleUserAnswer(true)
      }else{
        playSoundByName("bad_sound");
      }
      setNext(true)
    }
  };

  function handleEndGame(score_end, remainingTime) {
    if (end === false) {
      console.log("Time's up!")
      console.log(score_end + " " + remainingTime)
      let token = getCookieValue("auth_token")
      let score = score_end * 115 * (remainingTime + 1)
      setScore(score)
      let formData = {
        "token": token,
        "score": score,
        "time_taken": remainingTime,
        "correct_questions": score_end
      }
      console.log(formData)
      axios
        .post(TINKERS_SCORE_URL, formData)
        .then((_) => {
          axios
            .get(GET_TINKERS_SCORE_URL)
            .then((response) => {
              const allScores = response.data;
              setLeaderboard(allScores)
            })
            .catch((error) => {
              console.error("Error al obtener todas las puntuaciones:", error);
            });
        })
        .catch((error) => {
          console.error('Error al finalizar el juego:', error);
          if (error.response === undefined || error.response.data.error === undefined) {
            toast.error('Error al finalizar el juego:' + error.message);
          } else {
            toast.error('Error al finalizar el juego:' + error.response.data.error);
          }
        });
      setEnd(true)
    }
  }

  const handleTimeChange = (time) => {
    if (time === 8){
      playSoundByName("clock_ending");
    }
    setRemainingTime(time);
  };

  const handleUserAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  useEffect(() => {
    // change to position < 10 after tests...
    if (position < 10) {
      setQuestion(questions_prop[position].question)
      setOptions(questions_prop[position].options)
      setAnswer(questions_prop[position].answer)
      setSelectedOption(null)
      setNext(false)
    } else {
      handleEndGame(score, remainingTime)
    }
  }, [position, questions_prop]);

  return (
    <div>
      {!end &&
        <div className="question-container">
          <div className="question">{question}</div>
          <div className="options">
            <ClockTimer
              initialTime={time}
              onTimeEnd={() => handleEndGame(score, remainingTime)}
              onTimeChange={(remainingTime) => handleTimeChange(remainingTime)}
              shouldStop={end}
            />

            {Array.isArray(options) ? options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedOption === option ? (option === answer ? 'button-correct' : 'button-incorrect') : ''}`}
                onClick={() => handleButtonClick(option)}
              >
                {option}
              </button>
            )) : null}
            {next && <button className='nextQuestion' onClick={() => setPosition(prevPosition => prevPosition + 1)}> Siguiente pregunta</button>}
            <div className="scoreboard">
              Score: {score}
            </div>

          </div>
        </div>}
      {end && <Leaderboard players={leaderboard} />}
      {end && <button className='button' onClick={() => window.location.href = "/"}>Volver al inicio</button>}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TinkersDisplayer;
