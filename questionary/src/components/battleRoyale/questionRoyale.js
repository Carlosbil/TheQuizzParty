import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClockTimer from "../timer/timer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { playSoundByName } from "../../sounds";
import RoyaleTimer from "../timer/royaleTimer";
import { socket } from "../../enpoints";
import { getCookieValue } from "../../authSlide";
/**
 * Displays the battle royale question and answer component.
 * 
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The RoyaleDisplayer component.
 */
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
                props.obtain_health()
            } else {
                playSoundByName("bad_sound");
                props.steal_health()
            }
            setNext(true)
        }
    };

    function handleEndGame() {
        props.onEnd(score)
        setEnd(true)
    }

    const handleTimeChange = (time) => {
        if (time === 8) {
            playSoundByName("clock_ending");
        }
        setRemainingTime(time);
    };

    //si la respuesta es correcta, se suma 1 al score
    const handleUserAnswer = (correct) => {
        if (correct) {
            let res = score + 1
            setScore(res)
        }
    }

    useEffect(() => {
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
                    <div className="question">{question}</div>
                    <div className="royale-options">
                        {Array.isArray(options) ? options.map((option, index) => (
                            <button
                                key={index}
                                className={`option ${selectedOption === option ? (option === answer ? "button-correct" : "button-incorrect") : ""}`}
                                onClick={() => handleButtonClick(option)}
                            >
                                {option}
                            </button>
                        )) : null}
                        {next && <button className="nextQuestion" onClick={() => setPosition(prevPosition => prevPosition + 1)}> Siguiente pregunta</button>}
                    </div>
                </div>}
            {end && <h1>🙈 Esperando a que finalice la ronda... 🙈</h1>}


            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default RoyaleDisplayer;
