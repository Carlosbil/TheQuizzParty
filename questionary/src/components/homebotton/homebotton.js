import React from 'react';
import logo from './logo_provisional.png';
import avatar from '../../assets/images/avatars/simple_avatar.png';
import { Link } from 'react-router-dom';
import DropdownMenu from '../dropDown/dropDown';

const profile = () =>
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
  </Link>;

export const homebotton = (onClick) =>
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
  </div>;

function Logo({ onClick }) {
  return (
    <DropdownMenu 
      trigger={homebotton(onClick)}
      components={[profile]}
    />
  );
}

export default Logo;
