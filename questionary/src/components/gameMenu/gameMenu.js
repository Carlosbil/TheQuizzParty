import React, { useState } from 'react';
import './gameMenu.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuestionDisplayer from '../questionDisplayer/questionDisplayer';

function FunButtons() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState('');
  const [showQuestionDisplayer, setShowQuestionDisplayer] = useState(false);

  const handleButtonClick_menu = (category) => {
    axios
      .get('/api/questions', { params: { data: category } })
      .then((response) => {
        setShowQuestionDisplayer(true);
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
  };

  return (
    <div>
      {!showQuestionDisplayer && (
        <div className="container">
            <button className="fun-button" onClick={() => handleButtonClick_menu('history')}>
              Preguntas de historia
            </button>
            <button className="fun-button" onClick={() => handleButtonClick_menu('geography')}>
              Preguntas de Geografía
            </button>
            <button className="fun-button" onClick={() => handleButtonClick_menu('random')}>
              Preguntas Aleatorias
            </button>
        </div>
      )}
      {showQuestionDisplayer && <QuestionDisplayer question={question} options={options} />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default FunButtons;
