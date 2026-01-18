import React from 'react';
import './ChoiceCard.css';

const ChoiceCard = ({ choice, solution, onClick, config }) => {
  const getIconForMethod = (method) => {
    const icons = config?.icons?.solutionMethods || {};
    return icons[method] || icons.default || 'fas fa-hand-point-right';
  };

  const getRiskColor = (risk) => {
    if (!risk) return 'unknown';
    if (risk <= 3) return 'low';
    if (risk <= 6) return 'medium';
    return 'high';
  };

  const getStrategyLabel = (strategy) => {
    const strategies = {
      'Соперничество': { icon: 'fas fa-fist-raised', color: 'strategy-competitive' },
      'Сотрудничество': { icon: 'fas fa-handshake', color: 'strategy-cooperative' },
      'Компромисс': { icon: 'fas fa-balance-scale', color: 'strategy-compromise' },
      'Избегание': { icon: 'fas fa-running', color: 'strategy-avoidance' },
      'Приспособление': { icon: 'fas fa-adjust', color: 'strategy-accommodation' },
      'Обучение': { icon: 'fas fa-graduation-cap', color: 'strategy-learning' },
      'Контроль': { icon: 'fas fa-cogs', color: 'strategy-control' }
    };

    return strategies[strategy] || { icon: 'fas fa-question', color: 'strategy-default' };
  };

  const strategyInfo = getStrategyLabel(solution?.strategy);

  return (
    <button className="choice-card" onClick={onClick}>
      <div className="choice-header">
        <div className="choice-icon">
          <i className={getIconForMethod(solution?.method)}></i>
        </div>
        <h4>{choice.description}</h4>
      </div>

      {solution && (
        <div className="choice-details">


          {solution.description && (
            <p className="solution-description">
              <i className="fas fa-info-circle"></i> {solution.description}
            </p>
          )}

          <div className="solution-meta">
            <div className="solution-method">
              <span className="meta-label"><i className="fas fa-cogs"></i> Метод:</span>
              <span className="meta-value">{solution.method || 'Не указан'}</span>
            </div>

            <div className={`solution-strategy ${strategyInfo.color}`}>
              <span className="meta-label"><i className={strategyInfo.icon}></i> Стратегия:</span>
              <span className="meta-value">{solution.strategy || 'Не указана'}</span>
            </div>

            <div className={`solution-risk risk-${getRiskColor(solution.risk)}`}>
              <span className="meta-label"><i className="fas fa-exclamation-triangle"></i> Риск:</span>
              <span className="meta-value">
                {solution.risk !== undefined ? `${solution.risk}/10` : 'Не указан'}
              </span>
            </div>

            <div className="solution-autonomy">
              <span className="meta-label"><i className="fas fa-user-check"></i> Автономия:</span>
              <span className="meta-value">
                {solution.autonomy !== undefined ? `${solution.autonomy}/10` : 'Не указана'}
              </span>
            </div>

            {solution.duration && (
              <div className="solution-duration">
                <i className="fas fa-clock"></i>
                <span>{solution.duration}</span>
              </div>
            )}
          </div>

          {solution.type && (
            <div className="solution-type">
              <span className="type-label">Тип решения:</span>
              <span className="type-value">
                {solution.type === 'ТактическоеРешение' ? 'Тактическое' : 'Стратегическое'}
              </span>
            </div>
          )}


          <div class="conteiner_card">
          {solution.principles && solution.principles.length > 0 && (
            <div className="solution-principles">
              <span className="principles-label">
                <i className="fas fa-balance-scale"></i> Педагогические принципы:
              </span>
              <div className="principles-tags">
                {solution.principles.map((principle, idx) => (
                  <span key={idx} className="principle-tag">{principle}</span>
                ))}
              </div>
            </div>
          )}

          {solution.resources && solution.resources.length > 0 && (
            <div className="solution-resources">
              <span className="resources-label">
                <i className="fas fa-toolbox"></i> Ресурсы:
              </span>
              <div className="resources-tags">
                {solution.resources.map((resource, idx) => (
                  <span key={idx} className="resource-tag">{resource}</span>
                ))}
              </div>
            </div>
          )}

          {solution.strengthens && solution.strengthens.length > 0 && (
            <div className="solution-effects">
              <div className="strengthens">
                <span className="effects-label positive">
                  <i className="fas fa-plus-circle"></i> Укрепляет:
                </span>
                <div className="effects-tags">
                  {solution.strengthens.map((effect, idx) => (
                    <span key={idx} className="effect-tag positive">{effect}</span>
                  ))}
                </div>
              </div>

              {solution.weakens && solution.weakens.length > 0 && (
                <div className="weakens">
                  <span className="effects-label negative">
                    <i className="fas fa-minus-circle"></i> Ослабляет:
                  </span>
                  <div className="effects-tags">
                    {solution.weakens.map((effect, idx) => (
                      <span key={idx} className="effect-tag negative">{effect}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      )}

      <div className="choice-footer">
        <span className="choose-text">
          <i className="fas fa-mouse-pointer"></i> Выбрать этот вариант
        </span>
        <i className="fas fa-chevron-right"></i>
      </div>
    </button>
  );
};

export default ChoiceCard;
