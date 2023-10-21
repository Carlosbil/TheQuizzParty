import React, { useState } from 'react';
import './gameMenu.css';
import QuestionDisplayer from '../questionDisplayer/questionDisplayer';
import Tinkers from '../tinkers/tinkers';
import { stopSoundByName } from '../../sounds';

function FunButtons() {
  const [showQuestionDisplayer, setShowQuestionDisplayer] = useState(false);
  const [showTinkers, setShowTinkers] = useState(false)

  const handleButtonClick_menu = (category) => {
        stopSoundByName("background")
        setShowQuestionDisplayer(true);
        localStorage.setItem('category', category);
  };

  const handleButtonClick_tinkers = () => {
    stopSoundByName("background")
    setShowTinkers(true);
};
  return (
    <div className='Page'>
      {!showQuestionDisplayer && !showTinkers && (
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
            <button className="fun-button" onClick={() => handleButtonClick_tinkers()}>
              {/*cambiar el nombre de tinkers*/}
              tinkers!!
            </button>
        </div>
      )}
      {showQuestionDisplayer && <QuestionDisplayer />}
      {showTinkers && <Tinkers></Tinkers>}
    </div>
  );
}

export default FunButtons;
