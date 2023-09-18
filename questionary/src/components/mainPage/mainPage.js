import React, { useState } from 'react';
import './main.css'
import ImageApp from '../images/image.js';
import FunButtons from '../gameMenu/gameMenu';
function MainPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handleButtonClick_menu = () => {
    setShowSecondComponent(true);
    setShowButton(false); // Oculta el botón al hacer clic
  };
  

  return (
    <div className='page'>
      {showButton && <button className='fun' onClick={handleButtonClick_menu}>The quizz</button>}
      {showSecondComponent && <FunButtons />}
    </div>
  );
}

export default MainPage;
