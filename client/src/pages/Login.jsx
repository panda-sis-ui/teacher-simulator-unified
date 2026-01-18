import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'trainee' // тренирующийся по умолчанию
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Типы пользователей
  const userTypes = [
    {
      value: 'trainee',
      label: 'Тренирующийся',
      description: 'Решение педагогических ситуаций',
      icon: 'fas fa-user-graduate'
    },
    {
      value: 'scenario_developer',
      label: 'Разработчик сценариев',
      description: 'Создание и редактирование ситуаций',
      icon: 'fas fa-edit'
    }
  ];

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }

    return newErrors;
  };

  // Обработка изменений полей
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Очищаем ошибки при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  // Обработка входа
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
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Тестовые данные для демонстрации
      const testUsers = {
        'trainee@example.com': {
          password: 'Password123',
          role: 'trainee',
          name: 'Анна Петрова',
          specialization: 'Начальное образование'
        },
        'developer@example.com': {
          password: 'Developer123',
          role: 'scenario_developer',
          name: 'Иван Сидоров',
          specialization: 'Методист'
        }
      };

      const user = testUsers[formData.email];

      if (!user || user.password !== formData.password) {
        throw new Error('Неверный email или пароль');
      }

      if (user.role !== formData.userType) {
        throw new Error(`Выбран неверный тип пользователя. Попробуйте войти как ${user.role === 'trainee' ? 'Тренирующийся' : 'Разработчик сценариев'}`);
      }

      // Сохраняем данные пользователя
      const userData = {
        ...user,
        email: formData.email,
        rememberMe: formData.rememberMe,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);

      // Сохраняем настройки
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Редирект
      navigate(from, { replace: true });

    } catch (error) {
      console.log('Ошибка входа:', error);
      setLoginError(error.message || 'Ошибка входа. Проверьте данные и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  // Быстрый вход для демонстрации
  const handleQuickLogin = (type) => {
    if (type === 'trainee') {
      setFormData({
        email: 'trainee@example.com',
        password: 'Password123',
        rememberMe: false,
        userType: 'trainee'
      });
    } else {
      setFormData({
        email: 'developer@example.com',
        password: 'Developer123',
        rememberMe: false,
        userType: 'scenario_developer'
      });
    }
    setLoginError('');
  };

  // Восстановление пароля
  const handleForgotPassword = () => {
    if (!formData.email) {
      setLoginError('Введите email для восстановления пароля');
      return;
    }
    alert(`На адрес ${formData.email} отправлена инструкция по восстановлению пароля`);
  };

  return (
    <div className="login-page">
      <Header />

      <section className="login-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Войдите в свой аккаунт</h1>
            <p className="hero-subtitle">
              Получите доступ к симулятору педагогических ситуаций,
              аналитике решений и сообществу педагогов
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <div className="container">
          <div className="login-wrapper">
            {/* Левая часть - форма */}
            <div className="login-card">
              <div className="login-header">
                <h2>Вход в систему</h2>
                <p className="form-subtitle">
                  Новый пользователь? <Link to="/register" className="register-link">Зарегистрируйтесь</Link>
                </p>
              </div>

              {loginError && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle"></i> {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                {/* Выбор типа пользователя */}
                <div className="user-type-selection">
                  <label className="section-label">Выберите тип входа:</label>
                  <div className="user-type-grid">
                    {userTypes.map(type => (
                      <div
                        key={type.value}
                        className={`user-type-card ${formData.userType === type.value ? 'selected' : ''}`}
                        onClick={() => handleInputChange({
                          target: { name: 'userType', value: type.value }
                        })}
                      >
                        <div className="type-icon">
                          <i className={type.icon}></i>
                        </div>
                        <div className="type-content">
                          <h4>{type.label}</h4>
                          <p>{type.description}</p>
                        </div>
                        <div className="type-check">
                          <i className={`fas fa-check ${formData.userType === type.value ? 'visible' : ''}`}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Поля формы */}
                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i> Email адрес
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="ваш.email@example.com"
                    autoComplete="username"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle"></i> {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i> Пароль
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Введите пароль"
                      autoComplete="current-password"
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
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle"></i> {errors.password}
                    </div>
                  )}
                </div>

                {/* Опции */}
                <div className="form-options">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor="rememberMe" className="form-check-label">
                      Запомнить меня
                    </label>
                  </div>
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={handleForgotPassword}
                  >
                    Забыли пароль?
                  </button>
                </div>

                {/* Кнопка входа */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="login-btn"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Вход...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i> Войти
                    </>
                  )}
                </Button>

                {/* Быстрый вход для демонстрации */}
                <div className="demo-login">
                  <p className="demo-title">Демо-доступ:</p>
                  <div className="demo-buttons">
                    <button
                      type="button"
                      className="demo-btn trainee-btn"
                      onClick={() => handleQuickLogin('trainee')}
                    >
                      <i className="fas fa-user-graduate"></i> Тренирующийся
                    </button>
                    <button
                      type="button"
                      className="demo-btn developer-btn"
                      onClick={() => handleQuickLogin('developer')}
                    >
                      <i className="fas fa-edit"></i> Разработчик
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Правая часть - информация */}
            <div className="login-info">
              <div className="info-card">
                <div className="info-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h3>Преимущества входа</h3>
                <ul className="benefits-list">
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Персонализированные рекомендации</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>История решенных ситуаций</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Сертификаты и достижения</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Сообщество педагогов</span>
                  </li>
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Анализ эффективности решений</span>
                  </li>
                </ul>

                <div className="role-info">
                  <h4>О ролях:</h4>
                  <div className="role-card">
                    <h5><i className="fas fa-user-graduate"></i> Тренирующийся</h5>
                    <p>Решение педагогических ситуаций, анализ результатов, отслеживание прогресса</p>
                  </div>
                  <div className="role-card">
                    <h5><i className="fas fa-edit"></i> Разработчик сценариев</h5>
                    <p>Создание новых ситуаций, редактирование контента, управление материалами</p>
                  </div>
                </div>

                <div className="support-info">
                  <p>
                    <i className="fas fa-question-circle"></i>
                    <strong>Нужна помощь?</strong>
                  </p>
                  <Link to="/help" className="support-link">
                    Центр поддержки пользователей
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
