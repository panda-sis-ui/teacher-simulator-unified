import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import SituationViewer from '../components/SituationViewer/SituationViewer';
import ChoiceCard from '../components/ChoiceCard/ChoiceCard';
import OutcomeDisplay from '../components/OutcomeDisplay/OutcomeDisplay';
import SimpleSpiderChart from '../components/SimpleSpiderChart/SimpleSpiderChart';
import './Situation.css';

const Situation = () => {
  const { sitId, nodeId } = useParams();
  const navigate = useNavigate();

  // Добавляем ref для скролла
  const situationTopRef = useRef(null);
  const prevNodeIdRef = useRef(null);

  const [situation, setSituation] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [context, setContext] = useState(null);
  const [problem, setProblem] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = {
    icons: {
      problemTypes: {
        'Мотивационные кризисы': 'fas fa-lightbulb',
        'Организационные конфликты': 'fas fa-gavel',
        'Конфликты взаимодействия': 'fas fa-brain',
        'Внутриличностные конфликты': 'fas fa-scale-balanced',
        'Межличностные конфликты': 'fas fa-tasks',
        'Личность vs. группа': 'fas fa-users',
        'Межгрупповые конфликты': 'fas fa-users-slash',
        'default': 'fas fa-question'
      },
      solutionMethods: {
        'ТрадиционноеОбучение': 'fas fa-chalkboard-teacher',
        'Геймификация': 'fas fa-gamepad',
        'Дифференциация': 'fas fa-users',
        'РолеваяИгра': 'fas fa-theater-masks',
        'Визуализация': 'fas fa-photo-film',
        'ПроектнаяДеятельность': 'fas fa-project-diagram',
        'ТехноИнтеграция': 'fas fa-laptop-code',
        'default': 'fas fa-hand-point-right'
      }
    },
    texts: {
      loading: 'Загрузка...',
      situationNotFound: 'Ситуация не найдена',
      nodeNotFound: 'Узел не найден',
      noChoices: 'В этом узле нет доступных вариантов выбора.',
      outcomeTypes: {
        success: '✅ Успех',
        partial: '⚠️ Частичный успех',
        failure: '❌ Провал'
      },
      buttons: {
        restart: '<i class="fas fa-redo"></i> Начать заново',
        backToStart: '<i class="fas fa-arrow-left"></i> К началу ситуации',
        returnToStart: '<i class="fas fa-arrow-left"></i> Вернуться к началу'
      }
    },
    display: {
      defaultImage: 'https://via.placeholder.com/400x300/cccccc/333333?text=Изображение+ситуации'
    }
  };

  // Базовый URL API
  const API_BASE_URL = 'http://localhost:5000/api';

  // Функции для получения данных с сервера
  const fetchSituation = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/situations/${id}`);
      if (!response.ok) throw new Error('Ситуация не найдена');
      const data = await response.json();
      console.log('Загружена ситуация:', data);
      return data;
    } catch (error) {
      console.error('Ошибка загрузки ситуации:', error);
      return null;
    }
  };

  const fetchNode = async (situationId, nodeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/situations/${situationId}/nodes/${nodeId}`);
      if (!response.ok) throw new Error('Узел не найден');
      const data = await response.json();
      console.log('Загружен узел:', data);
      return data;
    } catch (error) {
      console.error('Ошибка загрузки узла:', error);
      return null;
    }
  };

  const fetchContext = async (contextRef) => {
    if (!contextRef) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/library/contexts/${contextRef}`);
      if (!response.ok) {
        console.log(`Контекст ${contextRef} не найден`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки контекста:', error);
      return null;
    }
  };

  const fetchProblem = async (problemRef) => {
    if (!problemRef) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/library/problems/${problemRef}`);
      if (!response.ok) {
        console.log(`Проблема ${problemRef} не найдена`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки проблемы:', error);
      return null;
    }
  };

  const fetchParticipant = async (participantRef) => {
    if (!participantRef) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/library/participants/${participantRef}`);
      if (!response.ok) {
        console.log(`Участник ${participantRef} не найден`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки участника:', error);
      return null;
    }
  };

  const fetchSolution = async (solutionRef) => {
    if (!solutionRef) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/library/solutions/${solutionRef}`);
      if (!response.ok) {
        console.log(`Решение ${solutionRef} не найдено`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки решения:', error);
      return null;
    }
  };

  const fetchOutcome = async (outcomeRef) => {
    if (!outcomeRef) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/library/outcomes/${outcomeRef}`);
      if (!response.ok) {
        console.log(`Результат ${outcomeRef} не найден`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка загрузки результата:', error);
      return null;
    }
  };

  const loadContextData = async (situationData) => {
    if (!situationData) return;

    console.log('Загрузка контекстных данных для ситуации:', situationData.id);

    // Загружаем контекст
    if (situationData.contextRef) {
      const contextData = await fetchContext(situationData.contextRef);
      setContext(contextData);
    }

    // Загружаем проблему
    if (situationData.problemRef) {
      const problemData = await fetchProblem(situationData.problemRef);
      setProblem(problemData);
    }

    // Загружаем участников
    if (situationData.participantsRef && situationData.participantsRef.length > 0) {
      const participantsData = await Promise.all(
        situationData.participantsRef.map(ref => fetchParticipant(ref))
      );
      setParticipants(participantsData.filter(p => p !== null));
    }
  };

  // Функция для скролла к началу страницы
  const scrollToTop = () => {
    console.log('Скроллим к началу страницы');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const makeChoice = async (choice) => {
    if (choice.next) {
      // Сохраняем текущий узел в историю
      const newHistory = [...history, currentNode];
      setHistory(newHistory);

      console.log(`Переход к узлу: ${choice.next}`);

      // Загружаем следующий узел
      const nextNode = await fetchNode(sitId, choice.next);
      if (nextNode) {
        setCurrentNode(nextNode);
        navigate(`/situation/${sitId}/${choice.next}`);

        // Скроллим после небольшой задержки
        setTimeout(() => {
          scrollToTop();
        }, 100);
      } else {
        console.error(`Не удалось загрузить узел ${choice.next}`);
        // Возвращаем предыдущее состояние
        setHistory(history);
      }
    }
  };

  const goBack = async () => {
    if (history.length > 0) {
      const previousNode = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      setCurrentNode(previousNode);
      setHistory(newHistory);

      // Находим ID предыдущего узла для обновления URL
      if (situation && situation.nodes) {
        const nodeKey = Object.keys(situation.nodes).find(
          key => situation.nodes[key].id === previousNode.id
        );
        if (nodeKey) {
          navigate(`/situation/${sitId}/${nodeKey}`);
        }
      }

      // Скроллим вверх
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  };

  const restartSituation = async () => {
    if (situation) {
      const initialNode = await fetchNode(sitId, situation.initialNode);
      if (initialNode) {
        setCurrentNode(initialNode);
        setHistory([]);
        navigate(`/situation/${sitId}/${situation.initialNode}`);

        setTimeout(() => {
          scrollToTop();
        }, 100);
      }
    }
  };

  const goToInitialNode = async () => {
    if (situation) {
      const initialNode = await fetchNode(sitId, situation.initialNode);
      if (initialNode) {
        setCurrentNode(initialNode);
        setHistory([]);
        navigate(`/situation/${sitId}/${situation.initialNode}`);

        setTimeout(() => {
          scrollToTop();
        }, 100);
      }
    }
  };

  // Скролл к началу при изменении узла
  useEffect(() => {
    if (currentNode && currentNode.id !== prevNodeIdRef.current) {
      prevNodeIdRef.current = currentNode.id;

      // Небольшая задержка для гарантии отрисовки нового контента
      const timer = setTimeout(() => {
        scrollToTop();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [currentNode]);

  // Загрузка данных при монтировании и изменении параметров
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      console.log(`Загрузка ситуации ${sitId}, узел: ${nodeId || 'начальный'}`);

      try {
        // Загружаем ситуацию
        const situationData = await fetchSituation(sitId);
        if (!situationData) {
          setLoading(false);
          return;
        }

        setSituation(situationData);

        // Определяем ID узла для загрузки
        const targetNodeId = nodeId || situationData.initialNode;

        // Загружаем узел
        const nodeData = await fetchNode(sitId, targetNodeId);

        if (!nodeData) {
          // Если узел не найден, пробуем загрузить начальный узел
          const initialNode = await fetchNode(sitId, situationData.initialNode);
          if (initialNode) {
            setCurrentNode(initialNode);
            navigate(`/situation/${sitId}/${situationData.initialNode}`);
          } else {
            console.error('Не удалось загрузить начальный узел');
          }
        } else {
          setCurrentNode(nodeData);
        }

        setHistory([]);

        // Загружаем контекстные данные
        await loadContextData(situationData);

      } catch (error) {
        console.error('Критическая ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sitId, nodeId]);

  // Компонент для отображения карточки выбора с загрузкой решения
  const ChoiceCardWithSolution = ({ choice }) => {
    const [solution, setSolution] = useState(null);
    const [loadingSolution, setLoadingSolution] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadSolution = async () => {
        if (choice.solutionRef) {
          setLoadingSolution(true);
          setError(null);
          try {
            const solutionData = await fetchSolution(choice.solutionRef);
            setSolution(solutionData);
          } catch (err) {
            setError('Не удалось загрузить информацию о решении');
            console.error(err);
          } finally {
            setLoadingSolution(false);
          }
        }
      };
      loadSolution();
    }, [choice.solutionRef]);

    const handleClick = () => {
      console.log('Клик по выбору:', choice.description);
      makeChoice(choice);
    };

    if (error) {
      return (
        <div className="choice-card error">
          <p className="error-message">{error}</p>
          <button
            className="btn btn-primary"
            onClick={handleClick}
            disabled={loadingSolution}
          >
            {loadingSolution ? 'Загрузка...' : choice.description}
          </button>
        </div>
      );
    }

    return (
      <ChoiceCard
        choice={choice}
        solution={solution}
        loading={loadingSolution}
        onClick={handleClick}
        config={config}
      />
    );
  };

  // Компонент для отображения результата с диаграммой
  const OutcomeDisplayWithData = ({ outcomeRef }) => {
    const [outcome, setOutcome] = useState(null);
    const [loadingOutcome, setLoadingOutcome] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadOutcome = async () => {
        if (outcomeRef) {
          setLoadingOutcome(true);
          setError(null);
          try {
            const outcomeData = await fetchOutcome(outcomeRef);
            setOutcome(outcomeData);
          } catch (err) {
            setError('Не удалось загрузить информацию о результате');
            console.error(err);
          } finally {
            setLoadingOutcome(false);
          }
        }
      };
      loadOutcome();
    }, [outcomeRef]);

    if (loadingOutcome) {
      return (
        <div className="outcome-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Загрузка результата...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="outcome-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-outline" onClick={restartSituation}>
            Начать заново
          </button>
        </div>
      );
    }

    if (!outcome) return null;

    return (
      <div className={`outcome-card outcome-${outcome.type}`}>
        <div className="outcome-header">
          <div className="outcome-title">
            <i className={`outcome-icon fas fa-${outcome.type === 'success' ? 'check-circle' : outcome.type === 'failure' ? 'times-circle' : 'minus-circle'}`}></i>
            <h3>
              {outcome.type === 'success' ? '✅ Успех' :
               outcome.type === 'failure' ? '❌ Провал' : '⚠️ Частичный успех'}
            </h3>
          </div>

          <div className="outcome-intensity">
            <div className="intensity-label">Интенсивность воздействия:</div>
            <div className="intensity-value">
              <div className="intensity-bar">
                <div
                  className="intensity-fill"
                  style={{ width: `${outcome.intensity || 0}%` }}
                ></div>
              </div>
              <strong>{outcome.intensity || 0}/100</strong>
            </div>
          </div>
        </div>

        <div className="outcome-content">
          <div className="outcome-text-container">
            <i className="fas fa-quote-left"></i>
            <p className="outcome-text">{outcome.text}</p>
            <i className="fas fa-quote-right"></i>
          </div>

          <div className="outcome-meta">
            <div className="meta-grid">
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="meta-content">
                  <div className="meta-label">Длительность эффекта</div>
                  <div className="meta-value">
                    {outcome.longTerm ? 'Долгосрочный' : 'Краткосрочный'}
                  </div>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-undo"></i>
                </div>
                <div className="meta-content">
                  <div className="meta-label">Обратимость</div>
                  <div className="meta-value">
                    {outcome.reversible ? 'Обратимый' : 'Необратимый'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Добавляем диаграмму-паутинку если есть метрики */}
          {outcome.metrics && Object.keys(outcome.metrics).length > 0 && (
            <div className="spider-chart-section">
              <SimpleSpiderChart
                metrics={outcome.metrics}
                title="Изменения ключевых показателей"
              />
            </div>
          )}

          {/* Табличное представление метрик (опционально) */}
          {outcome.metrics && Object.keys(outcome.metrics).length > 0 && (
            <div className="outcome-metrics-table">
              <h4><i className="fas fa-chart-bar"></i> Детали изменений:</h4>
              <div className="metrics-table">
                {Object.entries(outcome.metrics).map(([key, value]) => {
                  // Функция для перевода ключей метрик на русский
                  const translateMetricKey = (key) => {
                    const translations = {
                      motivation: 'Мотивация',
                      stress: 'Стресс',
                      trust: 'Доверие',
                      classClimate: 'Климат в классе',
                      teacherAuthority: 'Авторитет учителя',
                      burnout: 'Выгорание',
                      motivationChange: 'Изменение мотивации',
                      stressChange: 'Изменение стресса',
                      trustChange: 'Изменение доверия',
                      classClimateChange: 'Изменение климата',
                      teacherAuthorityChange: 'Изменение авторитета',
                      burnoutChange: 'Изменение выгорания'
                    };
                    return translations[key] || key;
                  };

                  const valueClass = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
                  const sign = value > 0 ? '+' : '';

                  return (
                    <div key={key} className="metric-row">
                      <div className="metric-label">{translateMetricKey(key)}:</div>
                      <div className={`metric-value ${valueClass}`}>
                        {sign}{value.toFixed(1)}
                      </div>
                      <div className="metric-bar-container">
                        <div
                          className={`metric-bar ${valueClass}`}
                          style={{
                            width: `${Math.min(Math.abs(value) * 100, 100)}%`,
                            transform: value < 0 ? 'scaleX(-1)' : 'none'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="outcome-actions">
            <button className="btn btn-primary" onClick={restartSituation}>
              <i className="fas fa-redo"></i> Начать заново
            </button>
            <button className="btn btn-outline" onClick={goToInitialNode}>
              <i className="fas fa-arrow-left"></i> К началу ситуации
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/catalog'}>
              <i className="fas fa-list"></i> В каталог
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
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

  if (!situation || !currentNode) {
    return (
      <div className="situation-error">
        <Header />
        <main className="situation-main">
          <div className="container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
              <h3>Ситуация не найдена</h3>
              <p>Пожалуйста, вернитесь в каталог и выберите другую ситуацию.</p>
              <a href="/catalog" className="btn btn-primary">
                Вернуться в каталог
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="situation-page">
      <Header />

      <main className="situation-main">
        <div className="container">
          {/* Используем ref для указания начала контента ситуации */}
          <div ref={situationTopRef} className="situation-content-start"></div>

          <div className="situation-breadcrumbs">
            <a href="/catalog">Каталог</a>
            <span> / </span>
            <span>{situation.title}</span>
            {history.length > 0 && (
              <>
                <span> / </span>
                <span>Шаг {history.length}</span>
              </>
            )}
          </div>

          {/* Кнопки навигации */}
          <div className="situation-navigation">
            {history.length > 0 && (
              <button className="btn btn-outline" onClick={goBack}>
                <i className="fas fa-arrow-left"></i> Назад
              </button>
            )}
            <button className="btn btn-outline" onClick={restartSituation}>
              <i className="fas fa-redo"></i> Начать заново
            </button>
            {currentNode.outcomeRef && (
              <button className="btn btn-outline" onClick={goToInitialNode}>
                <i className="fas fa-arrow-left"></i> К началу ситуации
              </button>
            )}
          </div>

          {/* Основная информация о ситуации */}
          <SituationViewer
            title={situation.title}
            description={currentNode.description}
            image={currentNode.image || config.display.defaultImage}
            context={context}
            problem={problem}
            participants={participants}
            difficulty={situation.metadata?.difficulty}
          />

          {/* Блок выбора или результат */}
          <div className="situation-choices-section">
            {currentNode.outcomeRef ? (
              <OutcomeDisplayWithData outcomeRef={currentNode.outcomeRef} />
            ) : (
              <>
                <h3 className="choices-title">Ваш выбор:</h3>
                <div className="choices-grid">
                  {currentNode.choices?.map((choice) => (
                    <ChoiceCardWithSolution key={choice.id} choice={choice} />
                  ))}
                </div>
                {(!currentNode.choices || currentNode.choices.length === 0) && (
                  <p className="no-choices-message">{config.texts.noChoices}</p>
                )}
              </>
            )}
          </div>

          {/* Информация о метаданных ситуации */}
          {situation.metadata && (
            <div className="situation-metadata">
              <div className="metadata-section">
                <h4><i className="fas fa-bullseye"></i> Цели обучения:</h4>
                {situation.metadata.learning_objectives && situation.metadata.learning_objectives.length > 0 ? (
                  <ul>
                    {situation.metadata.learning_objectives.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">Цели обучения не указаны</p>
                )}
              </div>

              {situation.metadata.tags && situation.metadata.tags.length > 0 && (
                <div className="metadata-section">
                  <h4><i className="fas fa-tags"></i> Теги:</h4>
                  <div className="tags-container">
                    {situation.metadata.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="metadata-section">
                <h4><i className="fas fa-user"></i> Информация о ситуации:</h4>
                <p><strong>Автор:</strong> {situation.metadata.author || 'Не указан'}</p>
                <p><strong>Сложность:</strong> {situation.metadata.difficulty || 'Не указана'}</p>
                <p><strong>Примерное время:</strong> {situation.metadata.estimated_time || 'Не указано'} минут</p>
                <p><strong>Версия:</strong> {situation.metadata.version || '1.0.0'}</p>
                {situation.metadata.created && (
                  <p><strong>Создана:</strong> {situation.metadata.created}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Situation;
