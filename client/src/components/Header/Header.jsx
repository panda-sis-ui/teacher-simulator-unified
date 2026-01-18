// src/components/Header/Header.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Добавьте Link
import './Header.css';
import Button from '../Button/Button';

const Header = () => {
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
          <Link to="/login">
            <Button variant="outline" className="mr-2">
              <i className="fas fa-sign-in-alt"></i> Войти
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">
              <i className="fas fa-user-plus"></i> Регистрация
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
