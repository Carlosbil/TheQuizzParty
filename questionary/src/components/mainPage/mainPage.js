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
        <FootPage />
      </div>
    </div>
  );
}

function FootPage() {
  const handleEmailClick = () => {
    window.location.href = "mailto:carlosbilbao2@gmail.com";
  };

  return (
    <div className='foot'>
      <p>La aplicación está en desarrollo y puede tener fallos. Si detecta uno contácteme al correo <a href="mailto:carlosbilbao2@gmail.com" onClick={handleEmailClick}>carlosbilbao2@gmail.com</a></p>
      <p>Desarrollado por Carlos Bilbao Lara github: <a href="https://github.com/Carlosbil" target="_blank" rel="noopener noreferrer">GitHub</a> </p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/carlos-bilbao-lara/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
    </div>
  );
}

export default MainPage;
