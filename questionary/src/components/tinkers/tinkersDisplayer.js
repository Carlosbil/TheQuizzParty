import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClockTimer from '../timer/timer';
import './tinkers.css'
import Leaderboard from '../leaderboard/leaderboard';
function TinkersDisplayer({ questions_prop }) {

  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [next, setNext] = useState(false)
  const [position, setPosition] = useState(0)
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(600);  // 10 minutes
  const [end, setEnd] = useState(false)
  const [formData, setFormData] = useState({
    user_id: '',
    score_id: '',
    score: 0,
    time_taken: 0,
    correct_questions: 0
  });
  const players = [
    { name: "Juan", score: 100 },
    { name: "Ana", score: 90 },
    { name: "Marta", score: 85 },
    // ...otros jugadores
  ];
  const handleButtonClick = (option) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      if (option === answer) {
        handleUserAnswer(true)
      }
      setNext(true)
    }
  };

  function handleEndGame(score, remainingTime) {
    if (end === false) {
      console.log("Time's up!")
      setEnd(true)
      setScore(score * 115 * (remainingTime + 1) / (remainingTime / 2))
    }
  }

  const handleTimeChange = (time) => {
    setRemainingTime(time);
  };

  const handleUserAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  useEffect(() => {
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
            initialTime={180}
            onTimeEnd={() => handleEndGame(score, remainingTime)}
            onTimeChange={(time) => handleTimeChange(time)}
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
      </div> }
      {end && <Leaderboard players={players} />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TinkersDisplayer;
