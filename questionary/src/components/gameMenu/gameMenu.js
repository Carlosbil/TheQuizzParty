import { React, useState } from 'react';
import './gameMenu.css'
import axios from "axios";
function FunButtons() {
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleButtonClick_menu = (tipo) => {
    console.log(tipo) // Oculta el botón al hacer clic
    setMessage(tipo)
    //get call to http://localhost:5000/questions and receive a json?
    axios.get("http://localhost:5000/questions").then((response) => {
      setQuestions(response.data);
      setMessage(questions)
    });
  };


  return (
    <div className='container'>
      <div className="fun-buttons-container">
        <button className="fun-button"
          onClick={() => handleButtonClick_menu('history')} >Preguntas de historia</button>
        <button className="fun-button"
          onClick={() => handleButtonClick_menu('geography')} >Preguntas de Geografía</button>
        <button className="fun-button"
          onClick={() => handleButtonClick_menu('random')} >Preguntas Aleatorias</button>
      </div>
      <div>{message}</div>
    </div>
  );
};

export default FunButtons;
