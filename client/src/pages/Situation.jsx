// src/pages/Situation.jsx - обновлённая версия с интеграцией API
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChoiceCard from '../components/ChoiceCard/ChoiceCard';
import SimpleSpiderChart from '../components/SimpleSpiderChart/SimpleSpiderChart';
import './Situation.css';

const Situation = () => {
  const { sitId, nodeId } = useParams();
  const navigate = useNavigate();
  const situationTopRef = useRef(null);

  const [situation, setSituation] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);

  const metricNames = {
    motivation: 'Мотивация',
    stress: 'Стресс',
    trust: 'Доверие',
    classClimate: 'Климат в классе',
    teacherAuthority: 'Авторитет учителя',
    teacherBurnout: 'Выгорание учителя'
  };

  // Прокрутка к началу
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Загрузка начальных данных ситуации
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      console.log(`📥 Загрузка ситуации ${sitId}, узел: ${nodeId || 'старт'}`);

      try {
        // Проверяем авторизацию
        if (!apiService.isAuthenticated()) {
          throw new Error('Требуется авторизация');
        }

        // Если есть nodeId, получаем данные узла
        // Если нет - начинаем новую сессию
        if (nodeId) {
          // Пока нет отдельного эндпоинта для получения узла,
          // используем start для начала или обрабатываем через историю
          const situationDetails = await apiService.getSituationDetails(sitId);
          setSituation(situationDetails);
        } else {
          // Начинаем новую сессию
          const startData = await apiService.startSituation(sitId);
          setCurrentNode(startData.currentNode);
          setCurrentMetrics(startData.metrics);
          setSituation(startData);
        }

        setHistory([]);
        setError(null);

      } catch (err) {
        console.error('❌ Ошибка загрузки:', err);

        if (err.message.includes('авториз')) {
          navigate('/login', { state: { from: { pathname: `/situation/${sitId}` } } });
        } else {
          setError(err.message || 'Не удалось загрузить ситуацию');
        }
      } finally {
        setLoading(false);
      }
    };

    if (sitId) {
      loadData();
    }

  }, [sitId, nodeId]);

  // Прокрутка при изменении узла
  useEffect(() => {
    if (currentNode) {
      setTimeout(() => scrollToTop(), 100);
    }
  }, [currentNode?.id]);

  // Обработка выбора
  const makeChoice = async (choice) => {
    if (!choice || !sitId) return;

    setLoading(true);
    console.log('👉 Делаем выбор:', choice.description);

    try {
      // Сохраняем текущий узел в историю
      const newHistory = [...history, currentNode];
      setHistory(newHistory);

      // Отправляем выбор на сервер
      const choiceData = await apiService.makeChoice(sitId, choice.id);

      console.log('✅ Результат выбора:', choiceData);

      // Обновляем состояние
      setCurrentNode(choiceData.nextNode);
      setCurrentMetrics(choiceData.metrics);
      setIsFinished(choiceData.isFinished);

      // Если завершено - получаем результат
      if (choiceData.isFinished) {
        const resultData = await apiService.getResult(sitId);
        setResult(resultData);
      }

      // Обновляем URL
      navigate(`/situation/${sitId}/${choiceData.nextNode.id}`, { replace: true });

    } catch (err) {
      console.error('❌ Ошибка выбора:', err);

      if (err.message.includes('авториз')) {
        navigate('/login');
      } else {
        // Возвращаем предыдущее состояние
        setHistory(history);
        setError(err.message || 'Ошибка при выборе');
      }
    } finally {
      setLoading(false);
    }
  };

  // Перезапуск ситуации
  const restartSituation = async () => {
    setLoading(true);
    try {
      const startData = await apiService.startSituation(sitId);
      setCurrentNode(startData.currentNode);
      setCurrentMetrics(startData.metrics);
      setHistory([]);
      setIsFinished(false);
      setResult(null);
      navigate(`/situation/${sitId}`);
      scrollToTop();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Возврат к начальному узлу
  const goToInitialNode = async () => {
    await restartSituation();
  };

  // Возврат назад (в истории)
  const goBack = async () => {
    if (history.length > 0) {
      // Упрощённая реализация - просто перезапускаем
      await restartSituation();
    }
  };

  if (loading && !currentNode) {
    return (
      <div className="situation-loading">
        <Header />
        <main className="situation-main">
          <div className="container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin fa-3x"></i>
              <p>Загрузка ситуации...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !currentNode) {
    return (
      <div className="situation-error">
        <Header />
        <main className="situation-main">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
              <h3>Ошибка</h3>
              <p>{error}</p>
              <Link to="/catalog" className="btn btn-primary">
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="situation-error">
        <Header />
        <main className="situation-main">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-question-circle fa-3x"></i>
              <h3>Ситуация не загружена</h3>
              <Link to="/catalog" className="btn btn-primary">
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const metricNormatives = {
    motivation: { good: 0.7, medium: 0.4, reverse: false },
    stress: { good: 0.4, medium: 0.7, reverse: true },
    trust: { good: 0.6, medium: 0.4, reverse: false },
    classClimate: { good: 0.7, medium: 0.5, reverse: false },
    teacherAuthority: { good: 0.6, medium: 0.4, reverse: false },
    teacherBurnout: { good: 0.3, medium: 0.6, reverse: true }
  };

  const getMetricColor = (key, value) => {
    const norm = metricNormatives[key];
    if (!norm) return '#f8d7da'; // fallback красный

    if (norm.reverse) {
      // чем меньше, тем лучше
      if (value <= norm.good) return '#d4edda'; // зелёный
      if (value <= norm.medium) return '#fff3cd'; // жёлтый
      return '#f8d7da'; // красный
    } else {
      // чем больше, тем лучше
      if (value >= norm.good) return '#d4edda';
      if (value >= norm.medium) return '#fff3cd';
      return '#f8d7da';
    }
  };

  return (
    <div className="situation-page">
      <Header />
      <main className="situation-main">
        <div className="container">
          {/* Навигационная панель */}
          <div className="situation-breadcrumbs">
            <Link to="/catalog">Каталог</Link>
            <span> / </span>
            <span>{situation?.name || 'Ситуация'}</span>
            {history.length > 0 && (
              <>
                <span> / </span>
                <span>Шаг {history.length + 1}</span>
              </>
            )}
          </div>

          <div className="situation-navigation">
            {history.length > 0 && (
              <button className="btn btn-outline" onClick={goBack}>
                <i className="fas fa-arrow-left"></i> Назад
              </button>
            )}
            <button className="btn btn-outline" onClick={restartSituation}>
              <i className="fas fa-redo"></i> Начать заново
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/catalog')}>
              <i className="fas fa-list"></i> К каталогу
            </button>
          </div>

          {/* Отображение метрик */}
          {currentMetrics && !isFinished && (
            <div className="metrics-panel" style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c6e49' }}>
                <i className="fas fa-chart-line"></i> Текущие метрики:
              </h4>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {Object.entries(currentMetrics).map(([key, value]) => {
                  const color = getMetricColor(key, value);
                  return (
                    <div key={key} style={{
                      padding: '5px 10px',
                      background: color,
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      <strong>{metricNames[key] || key}:</strong> {typeof value === 'number' ? value.toFixed(1) : value}
                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* Описание ситуации */}
          <div className="situation-description" style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            {currentNode.urlImage && (
              <img
                src={currentNode.urlImage}
                alt="Иллюстрация ситуации"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
              {currentNode.description}
            </p>
          </div>

          {/* Результат или выборы */}
          {isFinished && result ? (
            <div className="outcome-section" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              border: result.result === 'SUCCESS' ? '3px solid #28a745' :
                result.result === 'PARTIAL_SUCCESS' ? '3px solid #ffc107' : '3px solid #dc3545'
            }}>
              <h2 style={{
                color: result.result === 'SUCCESS' ? '#28a745' :
                  result.result === 'PARTIAL_SUCCESS' ? '#ffc107' : '#dc3545',
                marginBottom: '20px'
              }}>
                {result.result === 'SUCCESS' ? '✅ Успех!' :
                  result.result === 'PARTIAL_SUCCESS' ? '⚠️ Частичный успех' :
                    '❌ Неудача'}
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <h4>Пройдено метрик: {result.metricsPassed} / 6</h4>
              </div>

              {/* Диаграмма метрик */}
              <SimpleSpiderChart
                metrics={result.finalMetrics}
                title="Итоговые метрики"
              />

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={restartSituation}>
                  <i className="fas fa-redo"></i> Начать заново
                </button>
                <button className="btn btn-outline" onClick={goToInitialNode}>
                  <i className="fas fa-arrow-left"></i> К началу ситуации
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/catalog')}>
                  <i className="fas fa-list"></i> В каталог
                </button>
              </div>
            </div>
          ) : (
            /* Варианты выбора */
            <div className="choices-section">
              <h3 className="choices-title">Ваш выбор:</h3>
              <div className="choices-grid">
                {currentNode.choices?.map((choice) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    onClick={() => makeChoice(choice)}
                  />
                ))}
              </div>
              {(!currentNode.choices || currentNode.choices.length === 0) && (
                <p>Нет доступных вариантов выбора.</p>
              )}
            </div>
          )}

          {/* Сообщение об ошибке выбора */}
          {error && (
            <div className="alert alert-danger" style={{ marginTop: '20px' }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Situation;