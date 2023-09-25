import React, { useState } from 'react';
import './gameMenu.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FunButtons() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState('');

  const handleButtonClick_menu = (category) => {
    axios
      .get('http://localhost:5000/questions', { params: { data: category } })
      .then((response) => {
        setQuestion(decodeURIComponent(escape(response.data.question)));
        setAnswer(decodeURIComponent(escape(response.data.answer)));
        setOptions(decodeURIComponent(escape(response.data.options)));
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud:', error);
        if (error.response === undefined){
          toast.error('Error al realizar la solicitud:'+ error.message);
        }else{
          toast.error('Error al realizar la solicitud:'+ error.response.data.error);
        }
      });
  };

  return (
    <div className="container">
      <div className="fun-buttons-container">
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
      <div>{question}</div>
      <div>{answer}</div>
      <div>{options}</div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default FunButtons;
