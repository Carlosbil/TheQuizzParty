import React, { useState } from 'react';
import './gameMenu.css';
import QuestionDisplayer from '../questionDisplayer/questionDisplayer';
import Tinkers from '../tinkers/tinkers';
import { stopSoundByName } from '../../sounds';
import { useNavigate } from 'react-router-dom';

function FunButtons() {
  const [showQuestionDisplayer, setShowQuestionDisplayer] = useState(false);
  const [showTinkers, setShowTinkers] = useState(false)
  const navigate = useNavigate()

  const handleButtonClick_menu = (category) => {
    stopSoundByName("background")
    setShowQuestionDisplayer(true);
    localStorage.setItem('category', category);
  };

  const handleButtonClick_tinkers = () => {
    stopSoundByName("background")
    setShowTinkers(true);
  };
  const handleButtonClick_battleRoyale = () => {
    stopSoundByName("background")
    navigate('/battleRoyale')
  };
  return (
    <div className='Page'>
      {!showQuestionDisplayer && !showTinkers && (
        <div className="container">
          <button className="fun_royale" key="battle_royale_button" onClick={() => handleButtonClick_battleRoyale()}>
            👑 Battle Royale 👑
          </button>
          <button className="fun_royale" key="thinkers_button" onClick={() => handleButtonClick_tinkers()}>
            {/*cambiar el nombre de tinkers*/}
            ⚠️ Tinkers ⚠️
          </button>
        </div>
      )}
      {showQuestionDisplayer && <QuestionDisplayer />}
      {showTinkers && <Tinkers></Tinkers>}
    </div>
  );
}
export default FunButtons;
