// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import apiService from '../../services/api';
import './Header.css';
import Button from '../Button/Button';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      const currentUser = apiService.getCurrentUser();
      setIsLoggedIn(authenticated);
      setUser(currentUser);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const userRole = user?.role || '';

  // Базовые пункты для всех авторизованных (и для неавторизованных тоже, если нужно)
  const baseNavItems = [
    { path: '/', label: 'Главная' },
    { path: '/catalog', label: 'Каталог ситуаций' },
  ];

  // Дополнительные пункты только для методиста
  const metodistNavItems = [
    { path: '/ontology', label: 'Онтология' },          // внутренняя ссылка
    { 
      type: 'external', 
      href: '/generator.html', 
      label: 'Создание ситуаций',
      target: '_blank'
    },
  ];

  // Формируем итоговую навигацию
  let navItems = [];
  if (!isLoggedIn) {
    navItems = [...baseNavItems];
  } else {
    navItems = [...baseNavItems];
    if (userRole === 'ROLE_МЕТОДИСТ') {
      navItems.push(...metodistNavItems);
    }
  }

  // Ссылка на руководство (доступна всем)
  const helpLink = {
    type: 'external',
    href: '/help.html',
    label: 'Руководство пользователя',
    target: '_blank'
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1><span className="logo-accent">Симулятор</span>Учителя</h1>
          <p className="logo-subtitle">
            Симулятор педагогических решений на основе онтологического подхода
          </p>
        </div>
        
        <nav className="nav">
          {navItems.map((item, idx) => {
            if (item.type === 'external') {
              return (
                <a 
                  key={idx}
                  href={item.href}
                  target={item.target || '_self'}
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  {item.label}
                </a>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            );
          })}
          
          <a 
            href={helpLink.href}
            target={helpLink.target}
            rel="noopener noreferrer"
            className="nav-link"
          >
            {helpLink.label}
          </a>
        </nav>

        <div className="auth">
          {isLoggedIn ? (
            <>
              <span style={{ 
                marginRight: '15px', 
                color: '#555', 
                fontSize: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold'
              }}>
                <img 
                  src="/user.png" 
                  alt="avatar" 
                  style={{ 
                    width: '50px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                /> 
                {user?.login || 'Пользователь'}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">
                  <i className="fas fa-sign-in-alt"></i> Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  <i className="fas fa-user-plus"></i> Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;