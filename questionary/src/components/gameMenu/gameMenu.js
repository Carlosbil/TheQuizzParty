import React, { useState } from 'react';
import './gameMenu.css';
import QuestionDisplayer from '../questionDisplayer/questionDisplayer';

function FunButtons() {
  const [showQuestionDisplayer, setShowQuestionDisplayer] = useState(false);

  const handleButtonClick_menu = (category) => {
        setShowQuestionDisplayer(true);
        localStorage.setItem('category', category);
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
      {showQuestionDisplayer && <QuestionDisplayer />}
    </div>
  );
}

export default FunButtons;
