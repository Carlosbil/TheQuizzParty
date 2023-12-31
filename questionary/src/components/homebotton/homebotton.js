import React, { useState } from "react";
import logo from "./logo_provisional.png";
import menu from "../../assets/images/menu.png";
import home from "../../assets/images/home.png";

import { Link } from "react-router-dom";
import "./homebotton.css";
import { getCookieValue } from "../../authSlide";
import sound_on from "../../assets/images/audio_on.png";
import sound_off from "../../assets/images/audio_mute.png";
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
  
  // set if play or not sounds 
  const toggleSound = () => {
    const newSoundValue = !sound;
    document.cookie = `sound=${newSoundValue}; path=/; max-age=3600; samesite=Lax`; 
    setSound(newSoundValue);
    stopAllSounds();
  }

  return (
    <div className="menu-fixed">
      <button
        className="settings_menu"
        onClick={toggleMenu}
        style={{ backgroundImage: `url(${menu})` }}>
      </button>

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
          <Link to="profile">
            <button
              className="profile_container"
              style={{ backgroundImage: `url(${userAvatar})` }}>
            </button>
          </Link>
        </div>)}
        {isOpen && (
        <div>
            <button
              className="profile_container"
              onClick={toggleSound}
              style={{ backgroundImage: `url(${sound ? sound_on : sound_off})` }}> 
            </button>
        </div>)}
    </div >
  );
}

export default DropdownMenu;
