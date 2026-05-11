import React from 'react';
import './SimpleSpiderChart.css';

// Получение цвета по значению и ключу метрики (с учётом нормативов)
const getColorByMetric = (key, value) => {
  // Определяем базовый ключ без 'Change'
  const baseKey = key.replace('Change', '');

  // Пороги для каждой метрики (зелёная зона, жёлтая, красная)
  const thresholds = {
    motivation: { greenLow: 0.7, redHigh: 0.4, higherIsBetter: true },
    stress: { greenHigh: 0.4, redLow: 0.7, higherIsBetter: false },
    trust: { greenLow: 0.6, redHigh: 0.3, higherIsBetter: true },
    classClimate: { greenLow: 0.7, redHigh: 0.4, higherIsBetter: true },
    teacherAuthority: { greenLow: 0.6, redHigh: 0.3, higherIsBetter: true },
    burnout: { greenHigh: 0.3, redLow: 0.6, higherIsBetter: false },
    teacherBurnout: { greenHigh: 0.3, redLow: 0.6, higherIsBetter: false }
  };

  const t = thresholds[baseKey];
  if (!t) return '#9e9e9e'; // неизвестная метрика — серый

  if (t.higherIsBetter) {
    if (value >= t.greenLow) return '#4caf50';      // зелёный
    if (value < t.redHigh) return '#f44336';         // красный
    return '#ffc107';                                 // жёлтый
  } else {
    if (value <= t.greenHigh) return '#4caf50';     // зелёный
    if (value > t.redLow) return '#f44336';          // красный
    return '#ffc107';                                 // жёлтый
  }
};

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

  const metricsList = Object.entries(metrics).map(([key, value]) => {
    const normalizedValue = Math.max(0, Math.min(100, (value + 1) * 50));
    return {
      originalKey: key,
      name: translateMetricKey(key.replace('Change', ''), true),
      fullName: translateMetricKey(key.replace('Change', ''), false),
      value: normalizedValue,
      actualValue: value,
      color: getColorByMetric(key, value)
    };
  });

  const numMetrics = metricsList.length;
  const angleStep = (2 * Math.PI) / numMetrics;

  return (
    <div className="simple-spider-chart">
      <h4><i className="fas fa-chart-radar"></i> {title}</h4>
      <div className="spider-container">
        <svg className="spider-svg" viewBox="0 0 250 250" preserveAspectRatio="xMidYMid meet">
          <circle cx="125" cy="125" r="100" fill="none" stroke="#eee" strokeWidth="1" />
          <circle cx="125" cy="125" r="75" fill="none" stroke="#eee" strokeWidth="1" />
          <circle cx="125" cy="125" r="50" fill="none" stroke="#eee" strokeWidth="1" />
          <circle cx="125" cy="125" r="25" fill="none" stroke="#eee" strokeWidth="1" />

          {metricsList.map((_, index) => {
            const angle = angleStep * index;
            const x2 = 125 + 100 * Math.cos(angle);
            const y2 = 125 + 100 * Math.sin(angle);
            return <line key={`axis-${index}`} x1="125" y1="125" x2={x2} y2={y2} stroke="#ddd" strokeWidth="1" />;
          })}

          <polygon
            points={metricsList.map((metric, index) => {
              const angle = angleStep * index;
              const r = metric.value;
              const x = 125 + r * Math.cos(angle);
              const y = 125 + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(136, 132, 216, 0.3)"
            stroke="#8884d8"
            strokeWidth="2"
          />

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
                fill={metric.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {metricsList.map((metric, index) => {
            const angle = angleStep * index;
            const labelRadius = 112;
            const x = 125 + labelRadius * Math.cos(angle);
            const y = 125 + labelRadius * Math.sin(angle);

            let textAnchor = "middle";
            let dy = "0.35em";
            const quadrant = Math.floor((angle * 2) / Math.PI) % 4;
            switch (quadrant) {
              case 0: textAnchor = "start"; dy = "-0.5em"; break;
              case 1: textAnchor = "end"; dy = "-0.5em"; break;
              case 2: textAnchor = "end"; dy = "1.2em"; break;
              case 3: textAnchor = "start"; dy = "1.2em"; break;
            }
            if (Math.abs(Math.cos(angle)) < 0.1) {
              textAnchor = "middle";
              dy = Math.sin(angle) > 0 ? "1.2em" : "-0.5em";
            } else if (Math.abs(Math.sin(angle)) < 0.1) {
              textAnchor = Math.cos(angle) > 0 ? "start" : "end";
              dy = "0.35em";
            }

            return (
              <text key={`label-${index}`} x={x} y={y} textAnchor={textAnchor} dy={dy}
                fontSize="10" fill="#333" fontWeight="500" className="spider-label">
                {metric.name}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="spider-legend">
        {metricsList.map((metric, index) => (
          <div key={index} className="legend-row">
            <div className="legend-label">
              <span className="legend-dot" style={{ backgroundColor: metric.color }}></span>
              <span className="metric-name">{metric.fullName}</span>
            </div>
            <span className="metric-value">
              {metric.actualValue > 0 ? '+' : ''}{metric.actualValue.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="chart-description">
        <p><i className="fas fa-info-circle"></i>
          Зелёный — норма, жёлтый — внимание, красный — риск.
        </p>
        <p><i className="fas fa-info-circle"></i>
          Нормативы: мотивация ≥0,7; стресс ≤0,4; доверие ≥0,6;
          климат ≥0,7; авторитет ≥0,6; выгорание ≤0,3.
        </p>
      </div>
    </div>
  );
};

export default SimpleSpiderChart;