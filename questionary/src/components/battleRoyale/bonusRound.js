import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { playSoundByName } from "../../sounds";
import RoyaleTimer from "../timer/royaleTimer";

/**
 * Displays the bonus round component.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.options - The options for the bonus round.
 * @param {Function} props.onEnd - The function to call when the bonus round ends.
 * @returns {JSX.Element} The bonus round component.
 */
function BonusDisplayer(props) {

    let time = 60
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState(props.options);
    const [remainingTime, setRemainingTime] = useState(time);  // 10 minutes

    const handleButtonClick = (option) => {
        setSelectedOption(option);
    };

    function handleEndGame() {
        props.onEnd(selectedOption)
    }

    const handleTimeChange = (time) => {
        if (time === 8) {
            playSoundByName("clock_ending");
        }
        setRemainingTime(time);
    };

    return (
        <div>
            <div className="question-container">
                <RoyaleTimer initialTime={60} onTimeChange={handleTimeChange} onTimeEnd={handleEndGame} />
                <div className="question">
                    Seleccione el bonus a jugar
                </div>
                <div className="royale-options">
                    {Array.isArray(options) ? options.map((option, index) => (
                        <button 
                        className={`option ${selectedOption === option ? "button-correct" : ""}`}
                        key={index} 
                         onClick={() => handleButtonClick(option)}>{option}</button>
                    )) : null}
                </div>
            </div>
        </div>
    );
}

export default BonusDisplayer;
