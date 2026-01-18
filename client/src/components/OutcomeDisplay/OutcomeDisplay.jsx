import React from 'react';
import './OutcomeDisplay.css';

const OutcomeDisplay = ({ outcome, onRestart, onBackToStart, config }) => {
  if (!outcome) return null;

  const getOutcomeTypeText = (type) => {
    const texts = config?.texts?.outcomeTypes || {};
    return texts[type] || 'Результат';
  };

  const getOutcomeIcon = (type) => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'partial': return 'fas fa-exclamation-circle';
      case 'failure': return 'fas fa-times-circle';
      default: return 'fas fa-info-circle';
    }
  };

  const formatMetrics = (metrics) => {
    if (!metrics) return [];

    return Object.entries(metrics).map(([key, value]) => {
      const formattedKey = key.replace('Change', '').replace(/([A-Z])/g, ' $1');
      const sign = value >= 0 ? '+' : '';
      const valueClass = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';

      return {
        key: formattedKey,
        originalKey: key,
        value,
        sign,
        valueClass,
        absoluteValue: Math.abs(value)
      };
    });
  };

  const metrics = formatMetrics(outcome.metrics);
  const outcomeTypeText = getOutcomeTypeText(outcome.type);
  const outcomeIcon = getOutcomeIcon(outcome.type);

  return (
    <div className={`outcome-card outcome-${outcome.type}`}>
      <div className="outcome-header">
        <div className="outcome-title">
          <i className={`outcome-icon ${outcomeIcon}`}></i>
          <h3>{outcomeTypeText}</h3>
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

        {metrics.length > 0 && (
          <div className="outcome-metrics">
            <h4><i className="fas fa-chart-line"></i> Изменения метрик:</h4>
            <div className="metrics-grid">
              {metrics.map((item, index) => (
                <div key={index} className="metric-item">
                  <div className="metric-info">
                    <div className="metric-label">{item.key}</div>
                    <div className={`metric-value ${item.valueClass}`}>
                      {item.sign}{item.value.toFixed(1)}
                    </div>
                  </div>
                  <div className="metric-bar-container">
                    <div
                      className={`metric-bar ${item.valueClass}`}
                      style={{
                        width: `${Math.min(item.absoluteValue * 100, 100)}%`,
                        transform: item.value < 0 ? 'scaleX(-1)' : 'none'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="metrics-summary">
              <div className="summary-item">
                <i className="fas fa-arrow-up positive"></i>
                <span>Положительные изменения: {
                  metrics.filter(m => m.value > 0).length
                }</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-arrow-down negative"></i>
                <span>Отрицательные изменения: {
                  metrics.filter(m => m.value < 0).length
                }</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-equals neutral"></i>
                <span>Нейтральные изменения: {
                  metrics.filter(m => m.value === 0).length
                }</span>
              </div>
            </div>
          </div>
        )}

        <div className="outcome-actions">
          <button className="btn btn-primary" onClick={onRestart}>
            <i className="fas fa-redo"></i> Начать заново
          </button>
          <button className="btn btn-outline" onClick={onBackToStart}>
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

export default OutcomeDisplay;
