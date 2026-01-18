import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Импортируем данные правильно (относительно расположения этого файла)
import situationsData from '../../data/situations';

const DebugLink = ({ to, children, ...props }) => {
  const handleClick = (e) => {
    console.log('=== DEBUG NAVIGATION ===');
    console.log('Navigation to:', to);
    console.log('Available situation keys:', Object.keys(situationsData));

    // Извлекаем sitId из URL
    const urlParts = to.split('/');
    const sitId = urlParts[urlParts.length - 1];
    console.log('Extracted sitId:', sitId);

    // Проверяем, существует ли ситуация
    if (situationsData[sitId]) {
      console.log('✅ Ситуация найдена:', situationsData[sitId].title);
    } else {
      console.log('❌ Ситуация НЕ найдена!');
      console.log('Попробуйте один из этих ID:', Object.keys(situationsData));
    }
    console.log('=== END DEBUG ===');
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

DebugLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default DebugLink;
