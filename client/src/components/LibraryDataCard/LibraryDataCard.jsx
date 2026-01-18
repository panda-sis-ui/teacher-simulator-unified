// src/components/LibraryDataCard/LibraryDataCard.jsx
import React from 'react';
import './LibraryDataCard.css';

const LibraryDataCard = ({ data, category }) => {
  // Функции для рендеринга разных типов данных
  const renderContext = () => (
    <>
      <div className="card-header">
        <div className="card-icon">
          <i className="fas fa-chalkboard"></i>
        </div>
        <div className="card-title">
          <h5>{data.subject} - {data.grade} класс</h5>
          <div className="card-subtitle">{data.lessonPhase}</div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-description">{data.description}</p>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Формат:</span>
            <span className="detail-value">{data.format}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Длительность:</span>
            <span className="detail-value">{data.duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Оборудование:</span>
            <span className="detail-value">{data.techEquipment}</span>
          </div>
        </div>
      </div>
    </>
  );

  const renderParticipant = () => (
    <>
      <div className="card-header">
        <div className="card-icon">
          <i className={data.type === 'Учитель' ? 'fas fa-chalkboard-teacher' : 'fas fa-user-graduate'}></i>
        </div>
        <div className="card-title">
          <h5>{data.name}</h5>
          <div className="card-subtitle">{data.type}</div>
        </div>
      </div>
      <div className="card-body">
        {data.type === 'Учитель' ? (
          <div className="card-details">
            <div className="detail-item">
              <span className="detail-label">Опыт:</span>
              <span className="detail-value">{data.experience} лет</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Стиль:</span>
              <span className="detail-value">{data.style}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Роль:</span>
              <span className="detail-value">{data.role}</span>
            </div>
            {data.ei && (
              <div className="detail-item">
                <span className="detail-label">EI:</span>
                <span className="detail-value">{data.ei}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card-details">
            <div className="detail-item">
              <span className="detail-label">Возраст:</span>
              <span className="detail-value">{data.age}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Мотивация:</span>
              <span className="detail-value">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${data.motivation * 100}%` }}
                  ></div>
                  <span className="progress-text">{Math.round(data.motivation * 100)}%</span>
                </div>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Подготовка:</span>
              <span className="detail-value">{data.preparation}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Стиль обучения:</span>
              <span className="detail-value">{data.style}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderProblem = () => (
    <>
      <div className="card-header">
        <div className="card-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="card-title">
          <h5>{data.type}</h5>
          <div className={`intensity-badge intensity-${data.intensity?.toLowerCase()}`}>
            {data.intensity}
          </div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-description">{data.description}</p>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Источник:</span>
            <span className="detail-value">{data.source}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Напряженность:</span>
            <span className="detail-value">
              <div className="tension-indicator">
                <div
                  className="tension-bar"
                  style={{ width: `${data.tensionFactor * 100}%` }}
                ></div>
                <span className="tension-value">{Math.round(data.tensionFactor * 100)}%</span>
              </div>
            </span>
          </div>
          {data.emotions && data.emotions.length > 0 && (
            <div className="detail-item">
              <span className="detail-label">Эмоции:</span>
              <div className="emotions-tags">
                {data.emotions.slice(0, 3).map((emotion, idx) => (
                  <span key={idx} className="emotion-tag">{emotion}</span>
                ))}
                {data.emotions.length > 3 && (
                  <span className="emotion-tag">+{data.emotions.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderSolution = () => (
    <>
      <div className="card-header">
        <div className="card-icon">
          <i className="fas fa-lightbulb"></i>
        </div>
        <div className="card-title">
          <h5>{data.method}</h5>
          <div className={`solution-type ${data.type?.replace('Решение', '').toLowerCase()}`}>
            {data.type}
          </div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-description">{data.description}</p>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Стратегия:</span>
            <span className="detail-value">{data.strategy}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Риск:</span>
            <span className="detail-value">
              <div className="risk-indicator">
                <div className={`risk-dot risk-${data.risk <= 3 ? 'low' : data.risk <= 6 ? 'medium' : 'high'}`}></div>
                <span>{data.risk}/10</span>
              </div>
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Автономия:</span>
            <span className="detail-value">
              <div className="autonomy-indicator">
                <div
                  className="autonomy-bar"
                  style={{ width: `${data.autonomy * 10}%` }}
                ></div>
                <span>{data.autonomy}/10</span>
              </div>
            </span>
          </div>
          {data.duration && (
            <div className="detail-item">
              <span className="detail-label">Длительность:</span>
              <span className="detail-value">{data.duration}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderOutcome = () => (
    <>
      <div className="card-header">
        <div className="card-icon">
          <i className={`fas fa-${data.type === 'success' ? 'check-circle' : data.type === 'failure' ? 'times-circle' : 'minus-circle'}`}></i>
        </div>
        <div className="card-title">
          <h5>
            {data.type === 'success' ? 'Успех' :
             data.type === 'failure' ? 'Провал' : 'Частичный успех'}
          </h5>
          <div className={`outcome-intensity intensity-${data.intensity <= 33 ? 'low' : data.intensity <= 66 ? 'medium' : 'high'}`}>
            {data.intensity}/100
          </div>
        </div>
      </div>
      <div className="card-body">
        <p className="card-description">{data.text}</p>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Эффект:</span>
            <span className="detail-value">{data.longTerm ? 'Долгосрочный' : 'Краткосрочный'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Обратимость:</span>
            <span className="detail-value">{data.reversible ? 'Обратимый' : 'Необратимый'}</span>
          </div>
          {data.metrics && (
            <div className="detail-item full-width">
              <span className="detail-label">Метрики:</span>
              <div className="metrics-grid">
                {Object.entries(data.metrics).map(([key, value]) => (
                  <div key={key} className="metric-item">
                    <span className="metric-label">{key.replace('Change', '')}</span>
                    <span className={`metric-value ${value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'}`}>
                      {value > 0 ? '+' : ''}{value.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Выбор рендера по категории
  const renderContent = () => {
    switch (category) {
      case 'contexts': return renderContext();
      case 'participants': return renderParticipant();
      case 'problems': return renderProblem();
      case 'solutions': return renderSolution();
      case 'outcomes': return renderOutcome();
      default: return <p>Неизвестная категория</p>;
    }
  };

  return (
    <div className="library-data-card">
      {renderContent()}
      <div className="card-footer">
        <div className="card-id">
          <i className="fas fa-hashtag"></i>
          <span>{data.id}</span>
        </div>
        <button className="card-action">
          <i className="fas fa-edit"></i>
        </button>
      </div>
    </div>
  );
};

export default LibraryDataCard;
