import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TinkersDisplayer({ question_prop, options_prop, answer_prop }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState(question_prop);
  const [options, setOptions] = useState(options_prop);
  const [answer, setAnswer] = useState(answer_prop);
  const [next, setNext] = useState(false)

  const handleButtonClick = (option) => {
    console.log(option);
    setSelectedOption(option);
    setNext(true)
  };

  const nextQuestion = () => {
    setNext(false)
  }
  return (
    <div>
      <div className="question-container">
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
          {next && <button className='nextQuestion' onClick={() => nextQuestion()}> Siguiente pregunta</button>}

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TinkersDisplayer;
