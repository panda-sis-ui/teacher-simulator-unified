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

  // Определяем роль пользователя (значение может быть 'ROLE_СТУДЕНТ' или 'ROLE_МЕТОДИСТ')
  const userRole = user?.role || '';

  // Базовые пункты меню для всех авторизованных
  const baseNavItems = [
    { path: '/', label: 'Главная' },
    { path: '/catalog', label: 'Каталог ситуаций' },
  ];

  // Дополнительные пункты для методиста
  const metodistNavItems = [
    { 
      type: 'external', 
      href: '/generator.html', 
      label: 'Создание ситуаций',
      target: '_blank'
    },
  ];

  // Пункты для незарегистрированных пользователей
  const publicNavItems = [...baseNavItems];

  // Формируем итоговый массив навигации
  let navItems = [];
  if (!isLoggedIn) {
    navItems = publicNavItems;
  } else {
    navItems = [...baseNavItems];
    if (userRole === 'ROLE_МЕТОДИСТ') {
      navItems.push(...metodistNavItems);
    }
  }

  // Всегда добавляем "Руководство пользователя" для всех (доступно всегда)
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
          {/* Внутренние и внешние ссылки в зависимости от роли */}
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
          
          {/* Руководство пользователя отображается всегда */}
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