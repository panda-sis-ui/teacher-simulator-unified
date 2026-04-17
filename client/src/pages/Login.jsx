// src/pages/Login.jsx - обновлённая версия с интеграцией API
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import './Login.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login.trim()) {
      newErrors.login = 'Введите логин';
    }
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Вызов API для входа
      await apiService.login(formData.login, formData.password);
      
      // Успешный вход - перенаправляем
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Ошибка входа. Проверьте данные и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  // Быстрый вход для демо
  const handleQuickLogin = async (type) => {
    const credentials = type === 'student' 
      ? { login: 'testuser', password: 'password123' }
      : { login: 'admin', password: 'admin123' };

    setFormData({
      ...credentials,
      rememberMe: false,
    });

    setIsLoading(true);
    setLoginError('');

    try {
      await apiService.login(credentials.login, credentials.password);
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error.message || 'Ошибка демо-входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />
      {/* ... остальной код формы без изменений ... */}
      <section className="login-hero">
        <div className="container">
          <h1>Войдите в свой аккаунт</h1>
        </div>
      </section>

      <section className="login-form-section">
        <div className="container">
          <div className="login-card">
            {/* ... форма входа ... */}
            {loginError && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle"></i> {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Логин</label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                  placeholder="Введите логин"
                />
                {errors.login && (
                  <div className="invalid-feedback">{errors.login}</div>
                )}
              </div>

              <div className="form-group">
                <label>Пароль</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="login-btn"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>

              {/* Демо-кнопки */}
              <div className="demo-login">
                <p className="demo-title">Демо-доступ:</p>
                <div className="demo-buttons">
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => handleQuickLogin('student')}
                    disabled={isLoading}
                  >
                    <i className="fas fa-user-graduate"></i> Студент
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;