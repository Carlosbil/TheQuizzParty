import React, { useState } from 'react';
import logo from './logo_provisional.png';
import avatar from '../../assets/images/avatars/simple_avatar.png';
import settings from '../../assets/images/ajustes_1.png';
import { Link } from 'react-router-dom';
import './homebotton.css';

function DropdownMenu({onClick}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='menu'>
      <div className="settings_menu" onClick={toggleMenu}>
        <img
          src={settings}
          alt="Logo"
          style={{
            cursor: 'pointer',
            width: '10%',
            height: 'auto',
            minWidth: '10vmin',
            minHeight: '10vmin'
          }} />
      </div>
      {isOpen && (
        <div className="menu">
          <div className="logo-container" onClick={onClick}>
            <img
              src={logo}
              alt="Logo"
              style={{
                cursor: 'pointer',
                width: '10%',
                height: 'auto',
                minWidth: '10vmin',
                minHeight: '10vmin'
              }}
            />
          </div>
          <Link to='profile'>
            <div className='profile_container'>
              <img
                src={avatar}
                alt="Profile"
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: 'auto',
                  minWidth: '10vmin',
                  minHeight: '10vmin',
                }}
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
