import React, { useState } from 'react';
import './main.css';
import FunButtons from '../gameMenu/gameMenu';
import Logo from '../homebotton/homebotton';
import { Howl } from 'howler';
import correct_sound from '../../assets/sounds/correct_answer.wav'

function MainPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const sound = new Howl({
    src: [correct_sound] // NOTA: Es solo para demostración. Asegúrate de reemplazarlo con tu propio sonido o uno con licencia adecuada.
  });

  function playSound() {
    sound.play();
  }

  const handleButtonClick_menu = () => {
    playSound();
    setShowSecondComponent(true);
    setShowButton(false);
  };

  const handleLogoClick = () => {
    setShowSecondComponent(false);
    setShowButton(true);
  };

  return (
    <div className='back'>
      <div className='page'>
        <Logo onClick={handleLogoClick} /> {/* Agregar el componente Logo aquí */}
        {showButton && <button className='fun' onClick={handleButtonClick_menu}>The quizz</button>}
        {showSecondComponent && <FunButtons />}
      </div>
    </div>
  );
}

export default MainPage;
