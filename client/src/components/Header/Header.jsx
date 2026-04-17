// src/components/Header/Header.jsx - обновлённая версия
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import apiService from '../../services/api';
import './Header.css';
import Button from '../Button/Button';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Проверяем состояние авторизации при монтировании
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      const currentUser = apiService.getCurrentUser();
      setIsLoggedIn(authenticated);
      setUser(currentUser);
    };

    checkAuth();
    
    // Слушаем изменения storage (для синхронизации между вкладками)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Обработчик выхода
  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/catalog', label: 'Каталог ситуаций' },
    { path: '/ontology', label: 'Онтология' },
    { path: '/converter', label: 'Конвертер JSON' },
    { path: '/generator', label: 'Генератор JSON' },
  ];

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
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="auth">
          {isLoggedIn ? (
            <>
              <span style={{ 
                marginRight: '15px', 
                color: '#555',
                fontSize: '14px'
              }}>
                👤 {user?.login || 'Пользователь'}
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