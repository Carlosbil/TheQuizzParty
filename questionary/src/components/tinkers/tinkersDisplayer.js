import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TinkersDisplayer({ questions_prop}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [next, setNext] = useState(false)
  const [position, setPosition] = useState(0)

  const handleButtonClick = (option) => {
    setSelectedOption(option);
    setNext(true)
  };

  useEffect(() => {
    console.log(position)
    console.log(questions_prop)
    if(position < 20){
        setQuestion(questions_prop[position].question)
        setOptions(questions_prop[position].options)
        setAnswer(questions_prop[position].answer)
        setNext(false)
    }
  }, [position, questions_prop]);

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
          {next && <button className='nextQuestion' onClick={() => setPosition(prevPosition => prevPosition + 1)}> Siguiente pregunta</button>}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default TinkersDisplayer;
