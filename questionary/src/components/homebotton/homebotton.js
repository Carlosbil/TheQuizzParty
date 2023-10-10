import React from 'react';
import logo from './logo_provisional.png';
import temporalProfile from '../../assets/images/temporal_profile.png'
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
            src={temporalProfile}
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
