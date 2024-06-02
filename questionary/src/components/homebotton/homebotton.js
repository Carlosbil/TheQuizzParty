import React, { useState } from "react";
import home from "../../assets/images/home.png";

import "./homebotton.css";
import { getCookieValue } from "../../authSlide";
import sound_on from "../../assets/images/audio_on.png";
import sound_off from "../../assets/images/audio_mute.png";
import stats from "../../assets/images/stats.png"
import { stopAllSounds } from "../../sounds";

function DropdownMenu({ onClick, prop_avatar }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialSoundValue = getCookieValue("sound") === "true";
  const [sound, setSound] = useState(initialSoundValue);
  let userAvatar = prop_avatar
  // set if show or not the menu options
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleStats = () => {
    window.location.href = "/stats"
  }
  const handleProfile = () => {
    window.location.href = "/profile"
  }

  // set if play or not sounds 
  const toggleSound = () => {
    const newSoundValue = !sound;
    document.cookie = `sound=${newSoundValue}; path=/; max-age=3600; samesite=Lax`;
    setSound(newSoundValue);
    stopAllSounds();
  }

  return (
    <div>
      <div className="menu-fixed">
        <label className="hamburger">
        <input type="checkbox" onClick={toggleMenu}/>
          <svg viewBox="0 0 32 32">
            <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
            <path className="line" d="M7 16 27 16"></path>
          </svg>
      </label>
        {isOpen && (
          <div className="menu">
            <button
              className="logo-container"
              onClick={onClick}
              style={{ backgroundImage: `url(${home})` }}>
            </button>
          </div>
        )}
        {isOpen && (
          <div>
              <button
                className="profile_container"
                style={{ backgroundImage: `url(${userAvatar})` }}
                onClick={handleProfile}>
              </button>
          </div>)}
        {isOpen && (
          <div>
            <button
              className="profile_container"
              onClick={toggleSound}
              style={{ backgroundImage: `url(${sound ? sound_on : sound_off})` }}>
            </button>
          </div>)}
          {isOpen && (
          <div>
            <button
              className="profile_container"
              onClick={handleStats}
              style={{ backgroundImage: `url(${stats})` }}>
            </button>
          </div>)}
      </div >
    </div>
  );
}

export default DropdownMenu;
