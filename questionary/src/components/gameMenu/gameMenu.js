import React from 'react';
import './gameMenu.css'

function FunButtons() {
  const handleButtonClick_menu = (tipo) => {
    console.log(tipo) // Oculta el botón al hacer clic
  };
  return (
    <div className="fun-buttons-container">
      <button className="fun-button"  
        onClick={() => handleButtonClick_menu('history')} >Preguntas de historia</button>
      <button className="fun-button"
        onClick={() => handleButtonClick_menu('Geography')} >Preguntas de Geografía</button>
      <button className="fun-button"
        onClick={() => handleButtonClick_menu('random')} >Preguntas Aleatorias</button>
    </div>
  );
};

export default FunButtons;
