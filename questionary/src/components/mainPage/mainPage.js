import React, { useState } from 'react';
import './main.css';
import FunButtons from '../gameMenu/gameMenu';
import Logo from '../homebotton/homebotton';
import { useNavigate } from 'react-router-dom';
function MainPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handleButtonClick_menu = () => {
    setShowSecondComponent(true);
    setShowButton(false);
  };

  const handleLogoClick = () => {
    setShowSecondComponent(false);
    setShowButton(true);
  };
  const navigate = useNavigate()
  const getUser = () => {
    navigate("/profile")
  }
  return (
    <a className='back'>
      <div className='page'>
        <Logo onClick={handleLogoClick} /> {/* Agregar el componente Logo aquí */}
        {showButton && <button className='fun' onClick={handleButtonClick_menu}>The quizz</button>}
        {showSecondComponent && <FunButtons />}
      </div>
    </a>
  );
}

export default MainPage;
