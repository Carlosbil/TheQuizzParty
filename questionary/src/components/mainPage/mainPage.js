import React, { useState } from "react";
import "./main.css";
import FunButtons from "../gameMenu/gameMenu";
import { playSoundInLoopByName } from "../../sounds";
import DropdownMenu from "../homebotton/homebotton";
import getAvatar, { avatar1 } from "../../avatars";
import { getCookieValue } from "../../authSlide";
import BackgroundBeams from "./BackGroundBeam";
import FlipWords from "./flipWords";



function MainPage() {
  const [showSecondComponent, setShowSecondComponent] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const avatar = getCookieValue("avatar")
  const words = ["jugar", "competir", "aprender", "divertirse"];

  const handleButtonClick_menu = () => {
    //playSoundInLoopByName("background")
    setShowSecondComponent(true);
    setShowButton(false);
  };

  const handleLogoClick = () => {
    setShowSecondComponent(false);
    setShowButton(true);
  };

  return (
    <div className="back2">
      <BackgroundBeams></BackgroundBeams>
      <div className="page">
        {showButton && <h1 className="relative z-10 text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          The Quizz BDP
        </h1>}
        {showButton &&
          <p className="text-neutral-500 max-w-lg mx-8 my-2 text-sm text-center relative z-10 text-justify">
            Bienvenidos a The Quizz BDP un lugar para
            <FlipWords words={words} /> <br />
            junto a tus amigos y tus compañeros
          </p>}
        <DropdownMenu onClick={handleLogoClick} prop_avatar={getAvatar(avatar)} /> {/* Agregar el componente Logo aquí */}
        {showButton &&
          <button
            onClick={() => handleButtonClick_menu()}
            className="bg-black rounded-lg mx-auto hover:text-black px-4 py-2 text-center transform transition-all duration-300 hover:bg-blue-500 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl pulse-thinker"
          >
            Pulse aquí para jugar!
          </button>

        }
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
    <div className="foot">
      <div className="socialparent">
        <div className="socialchild child-1">
          <a href="mailto:carlosbilbao2@gmail.com" className="socialbutton btn-1" h>
            <svg height="1em" viewBox="0 0 512 512" fill="#bd9f67">
              <path fill="#bd9f67"
                d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z">
              </path>
            </svg>
          </a>
        </div>
        <div className="socialchild child-2">
          <a href="https://www.linkedin.com/in/carlos-bilbao-lara/" className="socialbutton btn-2" h>
            <svg height="1em" viewBox="0 0 448 512" fill="#bd9f67">
              <path
                d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
              </path>
            </svg>
          </a>
        </div>
        <div className="socialchild child-3">
          <a href="https://github.com/Carlosbil" className="socialbutton btn-3" h>
            <svg height="1em" viewBox="0 0 496 512" fill="#bd9f67">
              <path
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z">

              </path>
            </svg>
          </a>
        </div>
        <div className="socialchild child-4">
          <a href="https://carlosbil.github.io" className="socialbutton btn-4" h>
            <svg height="1em" viewBox="0 0 496 512" fill="#bd9f67">
              <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
