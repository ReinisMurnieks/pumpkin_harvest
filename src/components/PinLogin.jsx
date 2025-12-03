import React, { useState } from 'react';

const pinToDashboard = {
  '1111': 'office',
  '2222': 'garden',
  '3333': 'storage',
  '4444': 'delivery',
  '5555': 'client',
  '6666': 'driver',
  '7777': 'manager',
  '8888': 'registry'
};

export function getDashboardByPin(pin) {
  return pinToDashboard[pin] || null;
}

export default function PinLogin({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinClick = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        const dashboard = getDashboardByPin(newPin);
        if (dashboard) {
          onSuccess(dashboard);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 300);
        }
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="pin-login-overlay">
      <div className="pin-login-modal">
        <h1>Harvestly</h1>
        <p>Enter PIN to access dashboard</p>
        
        <div className={`pin-display ${error ? 'error' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />
          ))}
        </div>
        
        {error && <span className="pin-error">Invalid PIN</span>}
        
        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button key={digit} className="pin-key" onClick={() => handlePinClick(String(digit))}>
              {digit}
            </button>
          ))}
          <button className="pin-key" onClick={handleClear}>C</button>
          <button className="pin-key" onClick={() => handlePinClick('0')}>0</button>
          <button className="pin-key" onClick={handleBackspace}>←</button>
        </div>

        <div className="made-with-kiro">
          <span>Made with</span>
          <svg className="kiro-logo" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="kiro-text">Kiro</span>
        </div>
      </div>
    </div>
  );
}
