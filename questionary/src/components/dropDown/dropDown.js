import React, { useState } from 'react';

const DropdownMenu = ({ trigger, components }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.dropdownContainer}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div style={styles.menuContainer}>
          {components.map((Component, index) => (
            <div key={index} style={styles.itemContainer}>
              <Component />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  dropdownContainer: {
    position: 'relative',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  menuContainer: {
    position: 'absolute',
    top: '100%',
    left: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    zIndex: 1
  },
  itemContainer: {
    marginBottom: '10px',
    padding: '5px',
    borderBottom: '1px solid #eee',
  }
};

export default DropdownMenu;