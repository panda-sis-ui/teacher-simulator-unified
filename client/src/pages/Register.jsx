import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    specialization: '',
    experience: '',
    institution: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Роли пользователей
  const userRoles = [
    { value: 'student', label: 'Участник' },
    { value: 'teacher', label: 'Администратор контента' }
  ];

  // Специализации
  const specializations = [
    'Начальное образование',
    'Математика и информатика',
    'Физика и астрономия',
    'Химия и биология',
    'История и обществознание',
    'Русский язык и литература',
    'Иностранные языки',
    'Физическая культура и ОБЖ',
    'Искусство и технология',
    'Психология и педагогика',
    'Другая'
  ];

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
    } else if (formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Введите полное ФИО (минимум 2 слова)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать буквы в верхнем и нижнем регистре и цифры';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Необходимо согласие с условиями';
    }

    return newErrors;
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Временная имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Регистрация:', formData);

      // Сохраняем в localStorage (временное решение)
      const userData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isActive: true,
        avatar: null
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      setRegistrationSuccess(true);

      // Редирект после успешной регистрации
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Ошибка регистрации:', error);
      setErrors({ submit: 'Ошибка регистрации. Попробуйте позже.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Если регистрация успешна, показываем сообщение
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
            <p>
              Добро пожаловать в сообщество педагогов, {formData.fullName.split(' ')[0]}!
              Ваш аккаунт успешно создан.
            </p>
            <div className="success-details">
              <p><strong>Роль:</strong> {userRoles.find(r => r.value === formData.role)?.label}</p>
              <p><strong>Email:</strong> {formData.email}</p>
            </div>
            <p className="redirect-message">
              Через 3 секунды вы будете перенаправлены на главную страницу...
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="mt-3"
            >
              Перейти на главную сейчас
            </Button>
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
          <div className="hero-content">
            <h1>Присоединяйтесь к сообществу педагогов</h1>
            <p className="hero-subtitle">
              Зарегистрируйтесь для доступа к симулятору педагогических ситуаций,
              каталогу решений и аналитике ваших решений
            </p>
          </div>
        </div>
      </section>

      <section className="register-form-section">
        <div className="container">
          <div className="register-card">
            <div className="register-header">
              <h2>Создать аккаунт</h2>
              <p className="form-subtitle">
                Уже есть аккаунт? <Link to="/login" className="login-link">Войдите здесь</Link>
              </p>
            </div>

            {errors.submit && (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle"></i> {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Основная информация */}
              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-user"></i> Основная информация
                </h3>

                <div className="form-group">
                  <label htmlFor="fullName">
                    ФИО <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    placeholder="Иванова Анна Сергеевна"
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle"></i> {errors.fullName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="anna.ivanova@example.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle"></i> {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">
                      Пароль <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Минимум 8 символов"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-circle"></i> {errors.password}
                      </div>
                    )}
                    <div className="form-hint">
                      Пароль должен содержать заглавные и строчные буквы, цифры
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Подтверждение пароля <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Повторите пароль"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        <i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Профессиональная информация */}
              <div className="form-section">
                <h3 className="section-title">
                  <i className="fas fa-briefcase"></i> Профессиональная информация
                </h3>

                <div className="form-group">
                  <label htmlFor="role">
                    Ваша роль <span className="required">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    {userRoles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Соглашения */}
              <div className="form-section">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                  />
                  <label htmlFor="agreeToTerms" className="form-check-label">
                    Я согласен с <Link to="/terms" className="terms-link">Условиями использования</Link>
                    и <Link to="/privacy" className="terms-link">Политикой конфиденциальности</Link>
                    <span className="required"> *</span>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="invalid-feedback d-block">
                      <i className="fas fa-exclamation-circle"></i> {errors.agreeToTerms}
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопка отправки */}
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="submit-btn"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Регистрация...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i> Зарегистрироваться
                    </>
                  )}
                </Button>

              </div>
            </form>
          </div>

          {/* Блок преимуществ */}
          <div className="benefits-section">
            <h3 className="benefits-title">
              <i className="fas fa-star"></i> Преимущества регистрации
            </h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h4>Анализ решений</h4>
                <p>Получайте детальный анализ ваших педагогических решений с рекомендациями</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4>Прогресс обучения</h4>
                <p>Отслеживайте свой прогресс в решении педагогических ситуаций</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h4>Сообщество</h4>
                <p>Общайтесь с коллегами, обсуждайте кейсы и обменивайтесь опытом</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <h4>Сертификаты</h4>
                <p>Получайте сертификаты о прохождении тренингов и курсов</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
