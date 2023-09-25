import React from 'react';
import logo from './logo_provisional.png';

function Logo({ onClick }) {
    return (
      <div className="logo-container" onClick={onClick}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ 
            cursor: 'pointer',
            width: '10%',
            height: 'auto',
            minWidth: '10vmin',
            minHeight:'10vmin'
          }} 
        />
      </div>
    );
  }
  
  

export default Logo;
