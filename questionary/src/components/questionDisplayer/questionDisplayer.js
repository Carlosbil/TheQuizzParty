import React, { useEffect, useState } from 'react';
import './questionDisplayer.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QUESTIONS_URL } from '../../enpoints'


function QuestionDisplayer({ question_prop, options_prop, answer_prop }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [question, setQuestion] = useState(question_prop);
  const [options, setOptions] = useState(options_prop);
  const [answer, setAnswer] = useState(answer_prop);
  const [next, setNext] = useState(false)

  const handleButtonClick = (option) => {
    setSelectedOption(option);
    setNext(true)
  };

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    setNext(false)
    axios
      .get(QUESTIONS_URL, { params: { data: localStorage.getItem("category") } })
      .then((response) => {
        setQuestion(decodeURIComponent(response.data.question));
        setAnswer(decodeURIComponent(response.data.answer));
        setOptions(decodeURIComponent(response.data.options).split(","));
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
        if (error.response === undefined || error.response.data.error === undefined) {
          toast.error('Error al realizar la solicitud:' + error.message);
        } else {
          toast.error('Error al realizar la solicitud:' + error.response.data.error);
        }
      });
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

export default QuestionDisplayer;
