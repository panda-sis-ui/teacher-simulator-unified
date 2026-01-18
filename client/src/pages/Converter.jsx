// src/pages/Converter.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import LibraryDataCard from '../components/LibraryDataCard/LibraryDataCard';
import './Converter.css';

const Converter = () => {
  const [libraryData, setLibraryData] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('contexts');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/library'); // Замените на ваш API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLibraryData(data);
        setJsonInput(JSON.stringify(data, null, 2));
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError(`Не удалось загрузить данные: ${err.message}`);
        // Можно установить пустые данные по умолчанию при ошибке
        setLibraryData({
          contexts: {},
          participants: {},
          problems: {},
          solutions: {},
          outcomes: {},
          metadata: {}
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  // Статистика данных
  const stats = libraryData ? {
    contexts: Object.keys(libraryData.contexts || {}).length,
    participants: Object.keys(libraryData.participants || {}).length,
    problems: Object.keys(libraryData.problems || {}).length,
    solutions: Object.keys(libraryData.solutions || {}).length,
    outcomes: Object.keys(libraryData.outcomes || {}).length
  } : {
    contexts: 0,
    participants: 0,
    problems: 0,
    solutions: 0,
    outcomes: 0
  };

  // Обработка ввода JSON
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleJsonParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setLibraryData(parsed);
      alert('JSON успешно применен!');
    } catch (error) {
      alert(`Ошибка парсинга JSON: ${error.message}`);
    }
  };

  const handleResetJson = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/library'); // Загружаем исходные данные с сервера
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLibraryData(data);
      setJsonInput(JSON.stringify(data, null, 2));
      alert('Данные успешно сброшены!');
    } catch (err) {
      alert(`Ошибка загрузки данных: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!libraryData) return;

    const jsonStr = JSON.stringify(libraryData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedagogical_library.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Фильтрация элементов по поиску
  const getFilteredItems = () => {
    if (!libraryData || !libraryData[activeCategory]) return [];

    const items = libraryData[activeCategory];
    if (!searchTerm) return Object.values(items);

    return Object.values(items).filter(item =>
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Получение иконки для категории
  const getCategoryIcon = (category) => {
    const icons = {
      contexts: 'fas fa-chalkboard',
      participants: 'fas fa-users',
      problems: 'fas fa-exclamation-triangle',
      solutions: 'fas fa-lightbulb',
      outcomes: 'fas fa-chart-line'
    };
    return icons[category] || 'fas fa-folder';
  };

  // Получение названия категории
  const getCategoryTitle = (category) => {
    const titles = {
      contexts: 'Контексты уроков',
      participants: 'Участники',
      problems: 'Проблемы',
      solutions: 'Решения',
      outcomes: 'Исходы'
    };
    return titles[category] || category;
  };

  if (loading) {
    return (
      <div className="converter-page">
        <Header />
        <main className="converter-main">
          <div className="container">
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin fa-3x"></i>
              <p>Загрузка данных библиотеки...</p>
            </div>
          </div>
        </main>
        <Footer isCatalogPage={false} />
      </div>
    );
  }

  if (error && !libraryData) {
    return (
      <div className="converter-page">
        <Header />
        <main className="converter-main">
          <div className="container">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i> Попробовать снова
              </button>
            </div>
          </div>
        </main>
        <Footer isCatalogPage={false} />
      </div>
    );
  }

  return (
    <div className="converter-page">
      <Header />

      <main className="converter-main">
        <div className="container">
          {/* Заголовок и описание */}
          <div className="converter-header">
            <h1>Конвертер педагогической библиотеки</h1>
            <p className="converter-description">
              Редактируйте, просматривайте и управляйте элементами педагогической онтологии.
              Загружайте и экспортируйте JSON данные библиотеки.
            </p>
            {error && (
              <div className="warning-banner">
                <i className="fas fa-exclamation-circle"></i>
                <span>Внимание: {error}. Работаете с локальной копией данных.</span>
              </div>
            )}
          </div>

          {/* Статистика */}
          <div className="converter-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chalkboard"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.contexts}</div>
                <div className="stat-label">Контекстов</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.participants}</div>
                <div className="stat-label">Участников</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.problems}</div>
                <div className="stat-label">Проблем</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.solutions}</div>
                <div className="stat-label">Решений</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.outcomes}</div>
                <div className="stat-label">Исходов</div>
              </div>
            </div>
          </div>

          <div className="converter-content">
            {/* Левая колонка - JSON редактор */}
            <div className="converter-editor">
              <div className="editor-header">
                <h3><i className="fas fa-code"></i> Редактор JSON</h3>
                <div className="editor-actions">
                  <button className="btn btn-primary" onClick={handleJsonParse}>
                    <i className="fas fa-check"></i> Применить
                  </button>
                  <button className="btn btn-outline" onClick={handleResetJson}>
                    <i className="fas fa-redo"></i> Сброс
                  </button>
                  <button className="btn btn-success" onClick={handleExportJson}>
                    <i className="fas fa-download"></i> Экспорт
                  </button>
                </div>
              </div>
              <div className="json-editor">
                <textarea
                  value={jsonInput}
                  onChange={handleJsonInputChange}
                  placeholder="Введите JSON здесь..."
                  spellCheck="false"
                />
              </div>
              <div className="editor-info">
                <p><i className="fas fa-info-circle"></i> Редактируйте JSON напрямую или используйте визуальный редактор ниже.</p>
              </div>
            </div>

            {/* Правая колонка - Просмотр элементов */}
            <div className="converter-viewer">
              <div className="viewer-header">
                <h3><i className="fas fa-eye"></i> Просмотр элементов</h3>

                {/* Поиск */}
                <div className="viewer-search">
                  <div className="search-input">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Поиск элементов..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="search-clear"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Категории */}
              <div className="category-tabs">
                {Object.keys(stats).map(category => (
                  <button
                    key={category}
                    className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <i className={getCategoryIcon(category)}></i>
                    <span>{getCategoryTitle(category)}</span>
                    <span className="tab-count">{stats[category]}</span>
                  </button>
                ))}
              </div>

              {/* Карточки элементов с горизонтальным скроллом */}
              <div className="elements-section">
                <div className="section-header">
                  <h4>
                    <i className={getCategoryIcon(activeCategory)}></i>
                    {getCategoryTitle(activeCategory)}
                    <span className="count-badge">{getFilteredItems().length}</span>
                  </h4>
                  {searchTerm && (
                    <div className="search-results">
                      Найдено: {getFilteredItems().length} элементов
                    </div>
                  )}
                </div>

                <div className="elements-scroll-container">
                  <div className="elements-scroll">
                    {getFilteredItems().length > 0 ? (
                      getFilteredItems().map((item, index) => (
                        <LibraryDataCard
                          key={item.id || index}
                          data={item}
                          category={activeCategory}
                        />
                      ))
                    ) : (
                      <div className="no-elements">
                        <i className="fas fa-inbox"></i>
                        <p>Элементы не найдены</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="scroll-hint">
                  <i className="fas fa-arrows-alt-h"></i>
                  <span>Прокрутите горизонтально для просмотра всех элементов</span>
                </div>
              </div>
            </div>
          </div>

          {/* Информация о метаданных */}
          {libraryData && libraryData.metadata && (
            <div className="metadata-info">
              <h4><i className="fas fa-info-circle"></i> Метаданные библиотеки</h4>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <div className="metadata-label">Версия:</div>
                  <div className="metadata-value">{libraryData.metadata.version}</div>
                </div>
                <div className="metadata-item">
                  <div className="metadata-label">Автор:</div>
                  <div className="metadata-value">{libraryData.metadata.author}</div>
                </div>
                <div className="metadata-item">
                  <div className="metadata-label">Создано:</div>
                  <div className="metadata-value">{libraryData.metadata.created}</div>
                </div>
                <div className="metadata-item">
                  <div className="metadata-label">Обновлено:</div>
                  <div className="metadata-value">{libraryData.metadata.last_updated}</div>
                </div>
                <div className="metadata-item full-width">
                  <div className="metadata-label">Описание:</div>
                  <div className="metadata-value">{libraryData.metadata.description}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer isCatalogPage={false} />
    </div>
  );
};

export default Converter;
