
import { useState } from 'react';

const HamburgerMenu = () => {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div className="hamburger-menu">
      <label className="hamburger cursor-pointer">
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          className="hidden" 
        />
        <svg viewBox="0 0 32 32" className="h-6 w-6 transition-transform duration-600 ease-bezier" 
             style={{ 
               transform: isChecked ? 'rotate(-45deg)' : 'none',
               transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
             }}>
          <path 
            className={`line line-top-bottom ${isChecked ? 'checked' : ''}`} 
            d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            style={{
              strokeDasharray: isChecked ? '20 300' : '12 63',
              strokeDashoffset: isChecked ? '-32.42' : '0'
            }}
          />
          <path 
            className="line" 
            d="M7 16 27 16" 
          />
        </svg>
      </label>
    </div>
  );
};

export default HamburgerMenu;
