import React from 'react';
import logo from './logo_provisional.png';
import avatar from '../../assets/images/avatars/simple_avatar.png'
import { Link } from 'react-router-dom';

function Logo({ onClick }) {
  return (
    <div>
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
            }
            }
          />
        </div>
      </Link>
    </div>
  );
}



export default Logo;
