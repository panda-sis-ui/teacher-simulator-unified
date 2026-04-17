// src/pages/Register.jsx - обновлённая версия
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    role: 'Студент',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = 'Введите логин';
    } else if (formData.login.length < 3) {
      newErrors.login = 'Логин должен быть не менее 3 символов';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласие с условиями';
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

    try {
      // Вызов API для регистрации
      await apiService.register(formData.login, formData.password);
      
      setRegistrationSuccess(true);
      
      // Перенаправляем на главную через 3 секунды
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'Ошибка регистрации. Попробуйте позже.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Если регистрация успешна
  if (registrationSuccess) {
    return (
      <div className="register-page">
        <Header />
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Регистрация успешно завершена!</h2>
            <p>Добро пожаловать, {formData.login}!</p>
            <p className="redirect-message">
              Через 3 секунды вы будете перенаправлены на главную страницу...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="register-page">
      <Header />
      <section className="register-hero">
        <div className="container">
          <h1>Присоединяйтесь к сообществу педагогов</h1>
        </div>
      </section>

      <section className="register-form-section">
        <div className="container">
          <div className="register-card">
            <div className="register-header">
              <h2>Создать аккаунт</h2>
              <p>Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
            </div>

            {errors.submit && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle"></i> {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label>Логин <span className="required">*</span></label>
                  <input
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                    placeholder="Придумайте логин"
                  />
                  {errors.login && (
                    <div className="invalid-feedback">{errors.login}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Пароль <span className="required">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Минимум 6 символов"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Подтверждение пароля <span className="required">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Повторите пароль"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="form-check-input"
                  />
                  <label htmlFor="agreeToTerms" className="form-check-label">
                    Я согласен с условиями использования
                    <span className="required"> *</span>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>
                )}
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Register;