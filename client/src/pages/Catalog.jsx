// src/pages/Catalog.jsx - обновлённая версия с интеграцией API
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ScenarioCard from '../components/ScenarioCard/ScenarioCard';
import './Catalog.css';

const Catalog = () => {
  
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverScenarios, setServerScenarios] = useState([]);

  // Загрузка данных с сервера
  const fetchScenarios = async () => {
    try {
      console.log('📥 Загружаю ситуации с сервера...');
      setLoading(true);

      // Проверяем авторизацию
      if (!apiService.isAuthenticated()) {
        throw new Error('Требуется авторизация');
      }

      const data = await apiService.getSituations();
      console.log('✅ Данные получены:', data);

      // Преобразуем данные в нужный формат
      const formattedScenarios = data.map(item => {
          console.log(`🔍 Scenario type from server: ${item.typeProblem}`);
        return{
        id: item.id,
        title: item.name,
        description: `${item.typeProblem} - ${item.lessonName}`,
        typeProblem: item.typeProblem,
        lessonName: item.lessonName,
        lessonFormat: item.lessonFormat,
        problemIntensity: item.problemIntensity,
        // Вычисляем сложность на основе интенсивности
        difficulty: item.problemIntensity >= 0.7 ? 'hard' : 
                   item.problemIntensity >= 0.4 ? 'medium' : 'easy',
        type: item.typeProblem,
        duration: 10,
        typeIcon: 'question-circle',
        dataType: 'scenario'
      }
    });

      setServerScenarios(formattedScenarios);
      setFilteredScenarios(formattedScenarios);
      setError(null);

    } catch (err) {
      console.error('❌ Ошибка загрузки:', err);
      
      if (err.message.includes('авториз')) {
        setError('Для доступа к каталогу необходимо войти.');
        // Здесь можно добавить редирект на страницу входа
      } else {
        setError(err.message || 'Не удалось загрузить данные с сервера');
      }
      
      // Fallback данные
      const fallbackData = getLocalScenarios();
      setServerScenarios(fallbackData);
      setFilteredScenarios(fallbackData);
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
        title: "Тревога при публичном выступлении",
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

  const typeMapping = {
  motivational: 'Мотивационные кризисы',
  organizational: 'Организационные конфликты',
  interaction: 'Конфликты взаимодействия'
};
  // Загружаем данные при монтировании
  useEffect(() => {
    fetchScenarios();
  }, []);

  // Фильтрация сценариев
  // Фильтрация сценариев
useEffect(() => {
  const filtered = serverScenarios.filter(scenario => {
    console.log(`🔎 Фильтрация: scenario.type = "${scenario.type}", dataType = "${scenario.dataType}"`);
    
    const difficultyMatch = difficultyFilter === 'all' || 
      scenario.difficulty === difficultyFilter;
    
    let typeMatch = typeFilter === 'all';
    if (!typeMatch && typeFilter !== 'all') {
      // Получаем русское название для выбранного фильтра
      const expectedType = typeMapping[typeFilter];
      // Сравниваем с типом сценария (который уже на русском)
      typeMatch = scenario.type === expectedType;
    }
    
    return difficultyMatch && typeMatch;
  });

    setFilteredScenarios(filtered);
  }, [typeFilter, difficultyFilter, serverScenarios]);

  // Типы ситуаций для фильтров
  const situationTypes = [
    { value: 'all', label: 'Все' },
    { value: 'motivational', label: 'Мотивационные кризисы' },
    { value: 'organizational', label: 'Организационные конфликты' },
    { value: 'interaction', label: 'Конфликты взаимодействия' },
  ];

  const difficultyLevels = [
    { value: 'all', label: 'Все' },
    { value: 'easy', label: 'Базовый' },
    { value: 'medium', label: 'Средний' },
    { value: 'hard', label: 'Продвинутый' }
  ];

  const handleRefresh = () => {
    fetchScenarios();
  };

  return (
    <>
      <Header />

      <section className="catalog-hero">
        <div className="container">
          <h2>Каталог педагогических ситуаций</h2>
          <p className="hero-desc">
            {serverScenarios.length} ситуаций для отработки навыков принятия педагогических решений.
            Выберите ситуацию и начните прохождение.
          </p>

          <div className="server-controls">
            <button
              onClick={handleRefresh}
              className="btn btn-outline"
              disabled={loading}
              style={{ background: 'white', color: '#2c6e49' }}
            >
              {loading ? '⏳ Загрузка...' : '🔄 Обновить с сервера'}
            </button>
          </div>
        </div>
      </section>

      {/* Состояние загрузки */}
      {loading && (
        <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: '#2c6e49' }}></i>
          <p>Загружаем ситуации с сервера...</p>
        </div>
      )}

      {/* Состояние ошибки */}
      {error && !loading && (
        <div className="container" style={{ padding: '20px' }}>
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        </div>
      )}

      {/* Основной контент */}
      {!loading && (
        <>
          <section className="filters-section">
            <div className="container">
              <div className="filters-grid">
                <div className="filter-group">
                  <label><i className="fas fa-layer-group"></i> Тип ситуации</label>
                  <div className="filter-buttons">
                    {situationTypes.map((type) => (
                      <button
                        key={type.value}
                        className={`filter-btn ${typeFilter === type.value ? 'active' : ''}`}
                        onClick={() => setTypeFilter(type.value)}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label><i className="fas fa-chart-line"></i> Уровень сложности</label>
                  <div className="filter-buttons">
                    {difficultyLevels.map((difficulty) => (
                      <button
                        key={difficulty.value}
                        className={`filter-btn ${difficultyFilter === difficulty.value ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter(difficulty.value)}
                      >
                        {difficulty.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="scenarios-section">
            <div className="container">
              <h3 className="section-title">Доступные ситуации</h3>
              <p className="section-subtitle">
                Найдено {filteredScenarios.length} из {serverScenarios.length} ситуаций
                {error && <span className="local-badge"> (локальные данные)</span>}
                {!error && <span className="server-badge"> (данные с сервера)</span>}
              </p>

              {filteredScenarios.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>Ситуации не найдены</h3>
                  <p>Попробуйте изменить параметры фильтрации</p>
                </div>
              ) : (
                <div className="scenarios-grid">
                  {filteredScenarios.map(scenario => (
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
              )}
            </div>
          </section>
        </>
      )}

      <Footer isCatalogPage={true} />
    </>
  );
};

export default Catalog;