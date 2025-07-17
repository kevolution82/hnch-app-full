// reusable button component
import React from 'react';
import './CustomButton.css';

// Button with optional props
function CustomButton({ label, onClick, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick} className={`custom-btn ${className}`}>
      {label}
    </button>
  );
}

export default CustomButton;
