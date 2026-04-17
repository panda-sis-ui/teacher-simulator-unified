// src/pages/Home.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScenarioCard from '../components/ScenarioCard/ScenarioCard';
import './Home.css';

const Home = () => {
  const scrollerRef = useRef(null);
  const gridRef = useRef(null);
  const [isLeftDisabled, setIsLeftDisabled] = useState(true);
  const [isRightDisabled, setIsRightDisabled] = useState(false);
  const [randomScenarios, setRandomScenarios] = useState([]);
  const [allScenarios, setAllScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Данные для онтологических карточек
  const ontologyCards = [
    {
      icon: 'chart-line',
      title: 'Мотивационные кризисы',
      description: 'Демотивация, апатия, сопротивление, «непрактичность» обучения'
    },
    {
      icon: 'tasks',
      title: 'Организационные конфликты',
      description: 'Нарушения в структуре урока, распределении времени, заданий'
    },
    {
      icon: 'comments',
      title: 'Конфликты взаимодействия',
      description: 'Нарушения прямого общения: агрессия, игнорирование, публичное унижение'
    }
  ];

  // Функция для получения случайных сценариев
  const getRandomScenarios = (scenarios, count = 3) => {
    if (scenarios.length <= count) return scenarios;
    const shuffled = [...scenarios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Загрузка данных с сервера
  const fetchData = async () => {
    try {
      console.log('📥 Загружаем данные с сервера...');
      setLoading(true);
      setError(null);

      // Проверяем авторизацию
      const authenticated = apiService.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        console.log('⚠️ Пользователь не авторизован, используем локальные данные');
        const localData = getLocalScenarios();
        setAllScenarios(localData);
        setRandomScenarios(getRandomScenarios(localData));
        return;
      }

      // Получаем данные с сервера
      const data = await apiService.getSituations();
      console.log('✅ Данные получены:', data);

      // Форматируем данные
      const formattedScenarios = data.map(item => ({
        id: item.id,
        title: item.name,
        description: `${item.typeProblem} - ${item.lessonName}`,
        typeProblem: item.typeProblem,
        lessonName: item.lessonName,
        lessonFormat: item.lessonFormat,
        problemIntensity: item.problemIntensity,
        difficulty: item.problemIntensity >= 0.7 ? 'hard' : 
                   item.problemIntensity >= 0.4 ? 'medium' : 'easy',
        type: item.typeProblem,
        duration: 10,
        typeIcon: 'question-circle',
        dataType: 'scenario'
      }));

      setAllScenarios(formattedScenarios);
      setRandomScenarios(getRandomScenarios(formattedScenarios));

    } catch (err) {
      console.error('❌ Ошибка загрузки:', err);
      
      if (err.message.includes('авториз')) {
        setError('Для загрузки данных необходимо войти в систему');
        setIsLoggedIn(false);
      } else {
        setError('Не удалось загрузить данные с сервера');
      }

      // Используем локальные данные как fallback
      const localData = getLocalScenarios();
      setAllScenarios(localData);
      setRandomScenarios(getRandomScenarios(localData));

    } finally {
      setLoading(false);
    }
  };

  // Локальные данные (fallback)
  const getLocalScenarios = () => {
    return [
      {
        id: 1,
        title: "Обвинение ученика в предвзятости оценивания",
        description: "Организационные конфликты - Информатика",
        difficulty: "medium",
        type: "Организационные конфликты",
        duration: 10,
        typeIcon: "lightbulb",
        dataType: "organizational"
      },
      {
        id: 2,
        title: "Тревога при публичном выступлении на уроке",
        description: "Конфликты взаимодействия - Литература",
        difficulty: "easy",
        type: "Конфликты взаимодействия",
        duration: 10,
        typeIcon: "tasks",
        dataType: "interaction"
      },
      {
        id: 3,
        title: "Нарушение дисциплины на уроке",
        description: "Мотивационные кризисы",
        difficulty: "hard",
        type: "Мотивационные кризисы",
        duration: 10,
        typeIcon: "comments",
        dataType: "motivational"
      }
    ];
  };

  // Функция для обновления случайных сценариев
  const handleRefreshRandom = () => {
    const newRandom = getRandomScenarios(allScenarios);
    setRandomScenarios(newRandom);
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchData();
  }, []);

  // Функции для прокрутки онтологии
  const scrollOntology = (direction) => {
    if (!gridRef.current) return;
    const scrollAmount = 280;
    gridRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const updateScrollButtons = () => {
    if (!gridRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = gridRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setIsLeftDisabled(scrollLeft <= 10);
    setIsRightDisabled(scrollLeft >= maxScroll - 10);
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => grid.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  return (
    <>
      <Header />

      {/* Герой-секция */}
      <section className="hero">
        <div className="container">
          <h2>Готовы принять педагогическое решение в условиях неопределённости?</h2>
          <p className="hero-desc">
            Симулятор учителя — интерактивная среда имитации сложных педагогических ситуаций, 
            построенная на онтологической модели знаний. Развивайте рефлексивность, 
            стратегическое мышление и этическую компетентность через практику.
          </p>

          {/* Панель управления */}
          <div className="hero-cta" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '20px',
            marginTop: '30px'
          }}>
            {isLoggedIn ? (
              <>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link to="/catalog" className="btn btn-primary btn-large">
                    <i className="fas fa-play"></i> Начать тренировку
                  </Link>
                  <button 
                    onClick={handleRefreshRandom}
                    className="btn btn-outline btn-large"
                    disabled={loading}
                  >
                    <i className="fas fa-random"></i> Новые случайные
                  </button>
                </div>
                <p style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '0.9rem',
                  marginTop: '10px'
                }}>
                  Загружено ситуаций: {allScenarios.length}
                </p>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link to="/register" className="btn btn-primary btn-large">
                    <i className="fas fa-user-plus"></i> Зарегистрироваться
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large" style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    borderColor: 'white',
                    color: 'white'
                  }}>
                    <i className="fas fa-sign-in-alt"></i> Войти
                  </Link>
                </div>
                {error && (
                  <p style={{ 
                    color: 'rgba(255,200,200,0.9)', 
                    fontSize: '0.85rem',
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: 'rgba(255,0,0,0.2)',
                    borderRadius: '4px'
                  }}>
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Онтологический навигатор */}
      <section className="ontology-section">
        <div className="container">
          <h3 className="section-title">Категории педагогических ситуаций</h3>
          <p className="section-subtitle">Выберите тип ситуации для тренировки</p>

          <div className="ontology-scroller" ref={scrollerRef}>
            <button
              className={`scroll-btn scroll-btn-left ${isLeftDisabled ? 'disabled' : ''}`}
              aria-label="Прокрутить влево"
              onClick={() => scrollOntology('left')}
              disabled={isLeftDisabled}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="ontology-grid" ref={gridRef}>
              {ontologyCards.map((card, index) => (
                <div className="ontology-card" key={index}>
                  <div className="icon-box">
                    <i className={`fas fa-${card.icon}`}></i>
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>

            <button
              className={`scroll-btn scroll-btn-right ${isRightDisabled ? 'disabled' : ''}`}
              aria-label="Прокрутить вправо"
              onClick={() => scrollOntology('right')}
              disabled={isRightDisabled}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Случайные ситуации */}
      <section className="scenarios-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">
              Случайные ситуации для практики
              {loading && <span className="loading-badge" style={{
                marginLeft: '15px',
                fontSize: '0.8rem',
                padding: '4px 12px',
                background: 'rgba(44,110,73,0.2)',
                borderRadius: '12px',
                color: '#2c6e49'
              }}>загрузка...</span>}
            </h3>
            <p className="section-subtitle">
              Каждый раз новые ситуации для практики принятия решений
            </p>
          </div>

          {loading ? (
            <div className="loading-random" style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#2c6e49', marginBottom: '20px' }}></i>
              <p>Загружаем случайные ситуации с сервера...</p>
            </div>
          ) : randomScenarios.length === 0 ? (
            <div className="no-scenarios" style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#666'
            }}>
              <i className="fas fa-search fa-3x" style={{ color: '#ddd', marginBottom: '20px' }}></i>
              <p>Нет доступных ситуаций</p>
            </div>
          ) : (
            <>
              <div className="scenarios-grid">
                {randomScenarios.map(scenario => (
                  <ScenarioCard
                    key={scenario.id}
                    title={scenario.title}
                    description={scenario.description}
                    difficulty={scenario.difficulty}
                    type={scenario.type}
                    duration={scenario.duration || 10}
                    typeIcon={scenario.typeIcon}
                    id={String(scenario.id)}
                    dataType={scenario.dataType}
                  />
                ))}
              </div>

              <div style={{ 
                textAlign: 'center', 
                marginTop: '30px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.9rem',
                  marginBottom: '15px'
                }}>
                  <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#2c6e49' }}></i>
                  Нажмите «Новые случайные», чтобы получить другие ситуации для практики
                </p>
                
                {isLoggedIn && (
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={handleRefreshRandom}
                      className="btn btn-outline"
                    >
                      <i className="fas fa-random"></i> Новые случайные
                    </button>
                    <Link to="/catalog" className="btn btn-primary">
                      <i className="fas fa-list"></i> Открыть каталог
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Секция преимуществ */}
      <section style={{ 
        padding: '60px 0', 
        background: 'white',
        borderTop: '1px solid #eee'
      }}>
        <div className="container">
          <h3 className="section-title" style={{ marginBottom: '40px' }}>
            Почему симулятор учителя?
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '30px 20px',
              background: '#f9f9f9',
              borderRadius: '12px'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-brain" style={{ fontSize: '1.8rem', color: '#2c6e49' }}></i>
              </div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Безопасная среда</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Отрабатывайте решения без риска для реальных учеников
              </p>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '30px 20px',
              background: '#f9f9f9',
              borderRadius: '12px'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-chart-line" style={{ fontSize: '1.8rem', color: '#1976d2' }}></i>
              </div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>Объективная оценка</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Метрики мотивации, стресса, доверия и климата в классе
              </p>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '30px 20px',
              background: '#f9f9f9',
              borderRadius: '12px'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-history" style={{ fontSize: '1.8rem', color: '#f57c00' }}></i>
              </div>
              <h4 style={{ marginBottom: '10px', color: '#333' }}>История прогресса</h4>
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Отслеживайте свой рост через историю прохождений
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer isCatalogPage={false} />
    </>
  );
};

export default Home;