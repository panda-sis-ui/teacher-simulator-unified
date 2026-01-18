import React from 'react';
import './SituationViewer.css';

const SituationViewer = ({
  title,
  description,
  image,
  context,
  problem,
  participants,
  difficulty,
  config
}) => {
  const defaultImage = config?.display?.defaultImage || 'https://via.placeholder.com/400x300/cccccc/333333?text=Изображение+ситуации';

  const getIconForProblem = (problemType) => {
    const icons = config?.icons?.problemTypes || {};
    return icons[problemType] || icons.default || 'fas fa-question';
  };

  const getDifficultyBadge = (diff) => {
    if (!diff) return null;

    let className = 'difficulty-badge';
    let text = diff;

    if (diff.includes('Средн') || diff === 'Средний') {
      className += ' difficulty-medium';
      text = 'Средний';
    } else if (diff.includes('Высок') || diff === 'Высокий') {
      className += ' difficulty-hard';
      text = 'Продвинутый';
    } else {
      className += ' difficulty-easy';
      text = 'Базовый';
    }

    return <span className={className}>{text}</span>;
  };

  return (
    <div className="situation-viewer">
      {/* Заголовок и тип проблемы вверху */}
      <div className="situation-header">
        <div className="header-main">
          <h1>{title}</h1>
          {problem && (
            <div className="problem-type-main">
              <i className={getIconForProblem(problem.type)}></i>
              <span className="problem-type-text">{problem.type}</span>
              {difficulty && getDifficultyBadge(difficulty)}
            </div>
          )}
        </div>

        {/* Мета-информация */}
        <div className="situation-meta">
          {context && (
            <>
              <span className="meta-item">
                <i className="fas fa-clock"></i>
                <span className="meta-text">{context.duration || '~40 мин'}</span>
              </span>
              <span className="meta-item">
                <i className="fas fa-book"></i>
                <span className="meta-text">{context.subject}, {context.grade} класс</span>
              </span>
              <span className="meta-item">
                <i className="fas fa-tasks"></i>
                <span className="meta-text">{context.lessonPhase}</span>
              </span>
              <span className="meta-item">
                <i className="fas fa-laptop"></i>
                <span className="meta-text">{context.techEquipment}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Детальная информация о контексте */}
      {context && (
        <div className="context-detail-section">
          <h4><i className="fas fa-info-circle"></i> Контекст урока</h4>
          <div className="context-grid">
            <div className="context-item">
              <i className="fas fa-chalkboard"></i>
              <div>
                <div className="context-label">Предмет</div>
                <div className="context-value">{context.subject}</div>
              </div>
            </div>
            <div className="context-item">
              <i className="fas fa-user-graduate"></i>
              <div>
                <div className="context-label">Класс</div>
                <div className="context-value">{context.grade}</div>
              </div>
            </div>
            <div className="context-item">
              <i className="fas fa-tasks"></i>
              <div>
                <div className="context-label">Этап урока</div>
                <div className="context-value">{context.lessonPhase}</div>
              </div>
            </div>
            <div className="context-item">
              <i className="fas fa-laptop"></i>
              <div>
                <div className="context-label">Оборудование</div>
                <div className="context-value">{context.techEquipment}</div>
              </div>
            </div>
            <div className="context-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <div className="context-label">Формат</div>
                <div className="context-value">{context.format}</div>
              </div>
            </div>
            <div className="context-item">
              <i className="fas fa-hourglass-half"></i>
              <div>
                <div className="context-label">Длительность</div>
                <div className="context-value">{context.duration}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Детальная информация о проблеме */}
      {problem && (
        <div className="problem-detail-section">
          <h4><i className="fas fa-exclamation-triangle"></i> Анализ проблемы</h4>
          <div className="problem-content">
            <div className="problem-description">
              <div className="problem-title">{problem.type}</div>
              <p>{problem.description}</p>
            </div>
            <div className="problem-metadata">
              <div className="metadata-item">
                <div className="metadata-label">
                  <i className="fas fa-signal"></i> Интенсивность
                </div>
                <div className="metadata-value">{problem.intensity || 'Не указана'}</div>
              </div>
              <div className="metadata-item">
                <div className="metadata-label">
                  <i className="fas fa-map-marker-alt"></i> Источник
                </div>
                <div className="metadata-value">{problem.source || 'Не указан'}</div>
              </div>
              {problem.emotions && problem.emotions.length > 0 && (
                <div className="metadata-item">
                  <div className="metadata-label">
                    <i className="fas fa-smile"></i> Эмоции
                  </div>
                  <div className="metadata-value">
                    <div className="emotions-tags">
                      {problem.emotions.map((emotion, index) => (
                        <span key={index} className="emotion-tag">{emotion}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {problem.tensionFactor && (
                <div className="metadata-item">
                  <div className="metadata-label">
                    <i className="fas fa-chart-line"></i> Уровень напряженности
                  </div>
                  <div className="metadata-value">
                    <div className="tension-bar">
                      <div
                        className="tension-fill"
                        style={{ width: `${problem.tensionFactor * 100}%` }}
                      ></div>
                      <span className="tension-value">{Math.round(problem.tensionFactor * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Участники ситуации */}
      {participants && participants.length > 0 && (
        <div className="participants-section">
          <h4><i className="fas fa-users"></i> Участники ситуации</h4>
          <div className="participants-grid">
            {participants.map((p, index) => (
              <div key={index} className="participant-card">
                <div className="participant-header">
                  <div className="participant-avatar">
                    {p.type === 'Учитель' ? '👨‍🏫' : '👨‍🎓'}
                  </div>
                  <div className="participant-info">
                    <div className="participant-name">{p.name}</div>
                    <div className="participant-type">{p.type}</div>
                  </div>
                </div>

                <div className="participant-details">
                  {p.type === 'Учитель' ? (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Опыт:</span>
                        <span className="detail-value">{p.experience} лет</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Стиль:</span>
                        <span className="detail-value">{p.style}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Роль:</span>
                        <span className="detail-value">{p.role}</span>
                      </div>
                      {p.ei && (
                        <div className="detail-item">
                          <span className="detail-label">EI:</span>
                          <span className="detail-value">{p.ei}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Возраст:</span>
                        <span className="detail-value">{p.age}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Подготовка:</span>
                        <span className="detail-value">{p.preparation}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Мотивация:</span>
                        <span className="detail-value">
                          <div className="motivation-bar">
                            <div
                              className="motivation-fill"
                              style={{ width: `${p.motivation * 100}%` }}
                            ></div>
                            <span className="motivation-text">{Math.round(p.motivation * 100)}%</span>
                          </div>
                        </span>
                      </div>
                      {p.style && (
                        <div className="detail-item">
                          <span className="detail-label">Стиль обучения:</span>
                          <span className="detail-value">{p.style}</span>
                        </div>
                      )}
                      {p.socialStatus && (
                        <div className="detail-item">
                          <span className="detail-label">Статус:</span>
                          <span className="detail-value">{p.socialStatus}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Блок с описанием и картинкой в ряд */}
      <div className="situation-description-block">
        <div className="description-content">
          <h3>Описание ситуации</h3>
          <div className="description-text">{description}</div>
        </div>

        <div className="description-image">
          <img
            src={image || defaultImage}
            alt={title}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default SituationViewer;
