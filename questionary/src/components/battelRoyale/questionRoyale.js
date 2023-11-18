import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClockTimer from '../timer/timer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { playSoundByName } from '../../sounds';
import RoyaleTimer from '../timer/royaleTimer';
import { socket } from '../../enpoints';
import { getCookieValue } from '../../authSlide';
function RoyaleDisplayer(props) {


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



    const handleButtonClick = (option) => {
        if (selectedOption === null) {
            setSelectedOption(option);
            if (option === answer) {
                playSoundByName("good_sound");
                handleUserAnswer(true)
            } else {
                playSoundByName("bad_sound");
            }
            setNext(true)
        }
    };

    function handleEndGame() {
        
        console.log("Round end!")
        setEnd(true)
    }

    const handleTimeChange = (time) => {
        if (time === 8) {
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
        if (position < 5) {
            setQuestion(props.questions_prop[position].question)
            setOptions(props.questions_prop[position].options)
            setAnswer(props.questions_prop[position].answer)
            setSelectedOption(null)
            setNext(false)
        } else {
            handleEndGame()
        }
    }, [position, props.questions_prop]);

    return (
        <div>
            {!end &&
                <div className="question-container">
                    <RoyaleTimer initialTime={60} onTimeChange={handleTimeChange} onTimeEnd={handleEndGame} />
                    <div className="scoreboard">
                        Score: {score}
                    </div>
                    <div className="question">{question}</div>
                    <div className="options">
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
                    </div>
                </div>}
            {end && <button className='button' onClick={() => props.on_leave() }>Volver al inicio</button>}
            {end && <button className='linked' onClick={() =>{ window.location.href = "/questionary"}}>Me ayudarías respondiendo a unas preguntas? Le llevará 1 minuto</button>}


            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default RoyaleDisplayer;
