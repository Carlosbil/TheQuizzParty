import React, { useState } from 'react';
import './main.css';
import FunButtons from '../gameMenu/gameMenu';
import { playSoundInLoopByName } from '../../sounds';
import DropdownMenu from '../homebotton/homebotton';
import getAvatar, { avatar1 } from '../../avatars';
import { getCookieValue } from '../../authSlide';

function MainPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const avatar = getCookieValue("avatar")

  const handleButtonClick_menu = () => {
    playSoundInLoopByName("background")
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
        <DropdownMenu onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
        {showButton && <button className='fun' onClick={handleButtonClick_menu}>The quizz</button>}
        {showSecondComponent && <FunButtons />}
      </div>
    </div>
  );
}

export default MainPage;
