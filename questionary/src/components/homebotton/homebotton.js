import React, { useState } from 'react';
import logo from './logo_provisional.png';
import avatar from '../../assets/images/avatars/simple_avatar.png';
import settings from '../../assets/images/ajustes_1.png';
import { Link } from 'react-router-dom';
import './homebotton.css';
import { getCookieValue } from '../../authSlide';
import sound_on from '../../assets/images/audio_on.png';
import sound_off from '../../assets/images/audio_mute.png';
import { stopAllSounds } from '../../sounds';

function DropdownMenu({ onClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialSoundValue = getCookieValue("sound") === "true";
  const [sound, setSound] = useState(initialSoundValue);

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
    <div className='menu-fixed'>
      <button
        className="settings_menu"
        onClick={toggleMenu}
        style={{ backgroundImage: `url(${settings})` }}>
      </button>

      {isOpen && (
        <div className="menu">
          <button
            className="logo-container"
            onClick={onClick}
            style={{ backgroundImage: `url(${logo})` }}>
          </button>
        </div>
      )}
      {isOpen && (
        <div>
          <Link to='profile'>
            <button
              className='profile_container'
              style={{ backgroundImage: `url(${avatar})` }}>
            </button>
          </Link>
        </div>)}
        {isOpen && (
        <div>
            <button
              className='profile_container'
              onClick={toggleSound}
              style={{ backgroundImage: `url(${sound ? sound_on : sound_off})` }}> 
            </button>
        </div>)}
    </div >
  );
}

export default DropdownMenu;
