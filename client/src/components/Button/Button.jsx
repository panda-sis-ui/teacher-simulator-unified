import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false
}) => {
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-large';
      default: return '';
    }
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${getSizeClass()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
