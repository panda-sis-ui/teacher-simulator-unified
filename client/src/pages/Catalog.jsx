// src/pages/Catalog.jsx
import React, { useState, useEffect } from 'react';
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

  // 1. Функция для загрузки данных с сервера
  const fetchScenarios = async () => {
    try {
      console.log('🔄 Загружаю сценарии с сервера...');
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/situations');

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Данные получены:', data);

      // Данные с сервера уже в правильном формате!
      setServerScenarios(data);
      setFilteredScenarios(data);
      setError(null);

    } catch (err) {
      console.error('❌ Ошибка загрузки:', err);
      setError('Не удалось загрузить данные с сервера');
      // Используем локальные данные как fallback
      const localData = getLocalScenarios();
      setServerScenarios(localData);
      setFilteredScenarios(localData);
    } finally {
      setLoading(false);
    }
  };

  // 2. Локальные данные (только как fallback)
  const getLocalScenarios = () => {
    return [
      {
        id: 1,
        title: "«Экран важнее алгоритмов»: ученик погружен в телефон",
        description: "Как вернуть внимание к уроку, не разрушая доверительные отношения?",
        difficulty: "hard",
        type: "Мотивационные кризисы",
        duration: 10,
        typeIcon: "lightbulb",
        dataType: "motivational"
      },
      {
        id: 2,
        title: "«Я не успеваю, а он уже всё сделал»",
        description: "Как организовать урок, чтобы не демотивировать ни сильных, ни слабых?",
        difficulty: "medium",
        type: "Организационные конфликты",
        duration: 10,
        typeIcon: "tasks",
        dataType: "organizational"
      },
      {
        id: 3,
        title: "«Шайба гнева»: хоккеист против «несправедливости» учителя",
        description: "Как перевести агрессию спортивного лидера в конструктивное русло, не теряя авторитет перед классом?",
        difficulty: "easy",
        type: "Конфликты взаимодействия",
        duration: 8,
        typeIcon: "comments",
        dataType: "interaction"
      }
    ];
  };

  // 3. Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchScenarios();
  }, []);

  // 4. Фильтрация сценариев
  useEffect(() => {
    const filtered = serverScenarios.filter(scenario => {
      // Проверка сложности
      const difficultyMatch = difficultyFilter === 'all' ||
        scenario.difficulty === difficultyFilter;

      // Проверка типа
      let typeMatch = false;
      if (typeFilter === 'all') {
        typeMatch = true;
      } else if (scenario.dataType && scenario.dataType.includes(' ')) {
        // Для двойных типов проверяем каждый (например: "organizational interaction")
        const types = scenario.dataType.split(' ');
        typeMatch = types.includes(typeFilter);
      } else {
        typeMatch = scenario.dataType === typeFilter;
      }

      return difficultyMatch && typeMatch;
    });

    setFilteredScenarios(filtered);
  }, [typeFilter, difficultyFilter, serverScenarios]);

  // 5. Типы ситуаций для фильтров
  const situationTypes = [
    { value: 'all', label: 'Все' },
    { value: 'motivational', label: 'Мотивационные кризисы' },
    { value: 'organizational', label: 'Организационные конфликты' },
    { value: 'interaction', label: 'Конфликты взаимодействия' },
    { value: 'intrapersonal', label: 'Внутриличностные конфликты' },
    { value: 'interpersonal', label: 'Межличностные конфликты' },
    { value: 'person-vs-group', label: 'Личность vs. группа' },
    { value: 'intergroup', label: 'Межгрупповые конфликты' }
  ];

  // 6. Уровни сложности
  const difficultyLevels = [
    { value: 'all', label: 'Все' },
    { value: 'easy', label: 'Базовый' },
    { value: 'medium', label: 'Средний' },
    { value: 'hard', label: 'Продвинутый' }
  ];

  // 7. Функция для обновления данных
  const handleRefresh = () => {
    fetchScenarios();
  };

  return (
    <>
      <Header />

      {/* Герой секция каталога */}
      <section className="catalog-hero">
        <div className="container">
          <h2>Каталог педагогических ситуаций</h2>
          <p className="hero-desc">
            {serverScenarios.length} сценариев, структурированных по онтологической классификации педагогических ситуаций.
            Каждая ситуация — это шаг к осознанному, этичному и стратегически выверенному решению.
          </p>

          {/* Панель управления загрузкой */}
          <div className="server-controls">
            <button
              onClick={handleRefresh}
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? '🔄 Загрузка...' : '🔄 Обновить с сервера'}
            </button>

            <div className="server-info">
              <small>Загружено: {serverScenarios.length} ситуаций</small>
              <br />
              <small>Сервер: http://localhost:5000/api/situations</small>
            </div>
          </div>
        </div>
      </section>

      {/* Состояния загрузки и ошибок */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <h3>Загружаем сценарии с сервера...</h3>
          <p>Пожалуйста, подождите</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-state">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Внимание: {error}</h3>
            <p>Используются локальные данные. Убедитесь, что сервер запущен.</p>
            <button onClick={handleRefresh} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        </div>
      )}

      {/* Основной контент (показываем когда не загружается) */}
      {!loading && (
        <>
          {/* Фильтры */}
          <section className="filters-section">
            <div className="container">
              <div className="filters-grid">
                {/* Тип ситуации */}
                <div className="filter-group">
                  <label><i className="fas fa-layer-group"></i> Тип ситуации</label>
                  <div className="filter-buttons">
                    {situationTypes.map((type) => (
                      <button
                        key={type.value}
                        className={`filter-btn ${typeFilter === type.value ? 'active' : ''}`}
                        onClick={() => setTypeFilter(type.value)}
                        data-type={type.value}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Уровень сложности */}
                <div className="filter-group">
                  <label><i className="fas fa-chart-line"></i> Уровень сложности</label>
                  <div className="filter-buttons">
                    {difficultyLevels.map((difficulty) => (
                      <button
                        key={difficulty.value}
                        className={`filter-btn ${difficultyFilter === difficulty.value ? 'active' : ''}`}
                        onClick={() => setDifficultyFilter(difficulty.value)}
                        data-diff={difficulty.value}
                      >
                        {difficulty.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Сценарии */}
          <section className="scenarios-section">
            <div className="container">
              <div className="scenarios-header">
                <h3 className="section-title">Доступные сценарии</h3>
                <p className="section-subtitle">
                  Найдено {filteredScenarios.length} из {serverScenarios.length} сценариев
                  {error && <span className="local-badge"> (локальные данные)</span>}
                  {!error && <span className="server-badge"> (данные с сервера)</span>}
                </p>
              </div>

              {filteredScenarios.length === 0 ? (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <h3>Сценарии не найдены</h3>
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
                      duration={scenario.duration || 10} // значение по умолчанию
                      typeIcon={scenario.typeIcon}
                      id={String(scenario.id)}
                      dataType={scenario.dataType}
                    />
                  ))}
                </div>
              )}

              {/* Отладочная информация */}
              <div className="debug-info">
                <details>
                  <summary>Отладочная информация</summary>
                  <pre>{JSON.stringify(serverScenarios, null, 2)}</pre>
                </details>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer isCatalogPage={true} />
    </>
  );
};

export default Catalog;
