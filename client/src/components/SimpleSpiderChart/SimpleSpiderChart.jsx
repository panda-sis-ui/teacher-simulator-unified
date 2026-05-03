import React from 'react';
import './SimpleSpiderChart.css';

const SimpleSpiderChart = ({ metrics, title = "Диаграмма изменений метрик" }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="simple-spider-chart">
        <h4><i className="fas fa-chart-radar"></i> {title}</h4>
        <div className="no-metrics">
          <i className="fas fa-chart-line"></i>
          <p>Нет данных метрик для отображения</p>
        </div>
      </div>
    );
  }

  // Функция для перевода ключей метрик на русский
  const translateMetricKey = (key, short = false) => {
    const translations = {
      motivation: short ? 'Мотивация' : 'Мотивация',
      stress: short ? 'Стресс' : 'Стресс',
      trust: short ? 'Доверие' : 'Доверие',
      classClimate: short ? 'Климат' : 'Климат в классе',
      teacherAuthority: short ? 'Авторитет' : 'Авторитет учителя',
      burnout: short ? 'Выгорание' : 'Выгорание',
      motivationChange: short ? 'Мотивация' : 'Изменение мотивации',
      stressChange: short ? 'Стресс' : 'Изменение стресса',
      trustChange: short ? 'Доверие' : 'Изменение доверия',
      classClimateChange: short ? 'Климат' : 'Изменение климата',
      teacherAuthorityChange: short ? 'Авторитет' : 'Изменение авторитета',
      burnoutChange: short ? 'Выгорание' : 'Изменение выгорания',
      teacherBurnout: short ? 'Выгорание' : 'Выгорание учителя'
    };

    const baseKey = key.replace('Change', '');
    const result = translations[key] || translations[baseKey] || key;

    return result;
  };

  // Подготавливаем данные
  const metricsList = Object.entries(metrics).map(([key, value]) => {
    // Нормализуем значения от -1 до 1 до 0-100
    const normalizedValue = Math.max(0, Math.min(100, (value + 1) * 50));

    return {
      name: translateMetricKey(key.replace('Change', ''), true), // Короткие версии для диаграммы
      fullName: translateMetricKey(key.replace('Change', ''), false), // Полные версии для легенды
      value: normalizedValue,
      actualValue: value,
      color: value > 0 ? '#4caf50' : value < 0 ? '#f44336' : '#9e9e9e'
    };
  });

  const numMetrics = metricsList.length;
  const angleStep = (2 * Math.PI) / numMetrics;

  return (
    <div className="simple-spider-chart">
      <h4><i className="fas fa-chart-radar"></i> {title}</h4>
      <div className="spider-container">
        <svg className="spider-svg" viewBox="0 0 250 250" preserveAspectRatio="xMidYMid meet">
          {/* Внешний круг */}
          <circle cx="125" cy="125" r="100" fill="none" stroke="#eee" strokeWidth="1" />

          {/* Внутренние круги */}
          <circle cx="125" cy="125" r="75" fill="none" stroke="#eee" strokeWidth="1" />
          <circle cx="125" cy="125" r="50" fill="none" stroke="#eee" strokeWidth="1" />
          <circle cx="125" cy="125" r="25" fill="none" stroke="#eee" strokeWidth="1" />

          {/* Линии осей */}
          {metricsList.map((_, index) => {
            const angle = angleStep * index;
            const x2 = 125 + 100 * Math.cos(angle);
            const y2 = 125 + 100 * Math.sin(angle);
            return (
              <line
                key={`axis-${index}`}
                x1="125"
                y1="125"
                x2={x2}
                y2={y2}
                stroke="#ddd"
                strokeWidth="1"
              />
            );
          })}

          {/* Полигон с метриками */}
          <polygon
            points={metricsList.map((metric, index) => {
              const angle = angleStep * index;
              const r = metric.value; // Используем нормализованное значение напрямую
              const x = 125 + r * Math.cos(angle);
              const y = 125 + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(136, 132, 216, 0.3)"
            stroke="#8884d8"
            strokeWidth="2"
          />

          {/* Точки метрик */}
          {metricsList.map((metric, index) => {
            const angle = angleStep * index;
            const r = metric.value;
            const x = 125 + r * Math.cos(angle);
            const y = 125 + r * Math.sin(angle);
            return (
              <circle
                key={`point-${index}`}
                cx={x}
                cy={y}
                r="5"
                fill="#8884d8"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Подписи метрик с улучшенным позиционированием */}
          {metricsList.map((metric, index) => {
            const angle = angleStep * index;
            const labelRadius = 112; // Радиус для размещения подписей
            const x = 125 + labelRadius * Math.cos(angle);
            const y = 125 + labelRadius * Math.sin(angle);

            // Определяем квадрант для правильного выравнивания
            const quadrant = Math.floor((angle * 2) / Math.PI) % 4;

            let textAnchor = "middle";
            let dy = "0.35em";

            // Настраиваем выравнивание в зависимости от квадранта
            switch (quadrant) {
              case 0: // Правый верхний квадрант
                textAnchor = "start";
                dy = "-0.5em";
                break;
              case 1: // Левый верхний квадрант
                textAnchor = "end";
                dy = "-0.5em";
                break;
              case 2: // Левый нижний квадрант
                textAnchor = "end";
                dy = "1.2em";
                break;
              case 3: // Правый нижний квадрант
                textAnchor = "start";
                dy = "1.2em";
                break;
            }

            // Для вертикальных и горизонтальных осей
            if (Math.abs(Math.cos(angle)) < 0.1) { // Вертикально
              textAnchor = "middle";
              dy = Math.sin(angle) > 0 ? "1.2em" : "-0.5em";
            } else if (Math.abs(Math.sin(angle)) < 0.1) { // Горизонтально
              textAnchor = Math.cos(angle) > 0 ? "start" : "end";
              dy = "0.35em";
            }

            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="10"
                fill="#333"
                fontWeight="500"
                className="spider-label"
              >
                {metric.name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Легенда с реальными значениями */}
      <div className="spider-legend">
        {metricsList.map((metric, index) => (
          <div key={index} className="legend-row">
            <div className="legend-label">
              <span className="legend-dot" style={{ backgroundColor: metric.color }}></span>
              <span className="metric-name">{metric.fullName}</span>
            </div>
            <span className={`metric-value ${metric.actualValue > 0 ? 'positive' : metric.actualValue < 0 ? 'negative' : 'neutral'}`}>
              {metric.actualValue > 0 ? '+' : ''}{metric.actualValue.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="chart-description">
        <p><i className="fas fa-info-circle"></i> Значения нормализованы для отображения от 0 до 100.</p>
      </div>
    </div>
  );
};

export default SimpleSpiderChart;
