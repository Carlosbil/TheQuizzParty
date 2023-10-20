import React, { useState } from 'react';
import logo from './logo_provisional.png';
import avatar from '../../assets/images/avatars/simple_avatar.png';
import settings from '../../assets/images/ajustes_1.png';
import { Link } from 'react-router-dom';
import './homebotton.css';

function DropdownMenu({ onClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
    </div >
  );
}


export default DropdownMenu;
