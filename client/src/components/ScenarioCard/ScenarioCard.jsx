// src/components/ScenarioCard/ScenarioCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ScenarioCard.css';

// Конфигурация иконок
const ICON_MAP = {
  'lightbulb': 'fas fa-lightbulb',
  'tasks': 'fas fa-tasks',
  'comments': 'fas fa-comments',
  'user-injured': 'fas fa-user-injured',
  'user-friends': 'fas fa-user-friends',
  'user-shield': 'fas fa-user-shield',
  'users': 'fas fa-users',
  'shield-alt': 'fas fa-shield-alt',
  'chalkboard-teacher': 'fas fa-chalkboard-teacher',
  'brain': 'fas fa-brain',
  'gavel': 'fas fa-gavel',
  'scale-balanced': 'fas fa-scale-balanced',
  'users-slash': 'fas fa-users-slash',
  'book': 'fas fa-book',
  'laptop-code': 'fas fa-laptop-code',
  'flask': 'fas fa-flask',
  'question-circle': 'fas fa-question-circle'
};

const DIFFICULTY_CONFIG = {
  easy: { class: 'difficulty-easy', text: 'Базовый' },
  medium: { class: 'difficulty-medium', text: 'Средний' },
  hard: { class: 'difficulty-hard', text: 'Продвинутый' },
  базовый: { class: 'difficulty-easy', text: 'Базовый' },
  средний: { class: 'difficulty-medium', text: 'Средний' },
  продвинутый: { class: 'difficulty-hard', text: 'Продвинутый' }
};

const ScenarioCard = ({
  title,
  description,
  difficulty = 'medium',
  type,
  duration = '15',
  typeIcon = 'question-circle',
  id,
  dataType = 'scenario'
}) => {
  // Преобразуем id в строку
  const scenarioId = String(id);

  // Получаем настройки сложности
  const normalizedDifficulty = difficulty.toString().toLowerCase();
  const difficultyConfig = DIFFICULTY_CONFIG[normalizedDifficulty] || DIFFICULTY_CONFIG.medium;

  // Получаем класс иконки
  const getIconClass = () => {
    if (typeIcon?.startsWith('fas ') || typeIcon?.startsWith('far ')) {
      return typeIcon;
    }
    return ICON_MAP[typeIcon] || 'fas fa-question-circle';
  };

  // Обрезаем описание
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
  };

  // Обработчик клика для отладки
  const handleClick = () => {
    console.log('=== ScenarioCard Debug ===');
    console.log('Scenario ID:', scenarioId);
    console.log('Title:', title);
    console.log('Navigation to:', `/situation/${scenarioId}`);
  };

  return (
    <div
      className={`scenario-card ${difficultyConfig.class}`}
      data-type={dataType}
      data-difficulty={normalizedDifficulty}
      data-id={scenarioId}
    >
      {/* Бейдж сложности */}
      <div className="scenario-badge">
        <span className={`badge ${difficultyConfig.class}`}>
          {difficultyConfig.text}
        </span>
      </div>

      {/* Заголовок */}
      <h3 className="scenario-title" title={title}>
        {title}
      </h3>

      {/* Описание */}
      {/*<p className="scenario-description" title={description}>
        {truncateDescription(description)}
      </p>*/}

      {/* Мета-информация */}
      <div className="scenario-meta">
        {/*<div className="meta-item" title={`Продолжительность: ${duration} минут`}>
          <i className="far fa-clock"></i>
          <span>~{duration} мин</span>
        </div>*/}

        <div className="meta-item" title={`Тип: ${type}`}>
          <i className={getIconClass()}></i>
          <span>{type}</span>
        </div>
      </div>

      {/* Кнопка перехода */}
      <div className="scenario-actions">
        <Link
          to={`/situation/${scenarioId}`}
          className="btn btn-primary btn-sm"
          onClick={handleClick}
          aria-label={`Начать ситуацию "${title}"`}
        >
          <i className="fas fa-play"></i>
          <span>Начать</span>
        </Link>
      </div>

     {/* Дополнительные теги */}
      {/* <div className="scenario-tags">
        <span className="tag" title="Тип ситуации">{type}</span>
        <span className="tag" title="Сложность">{difficultyConfig.text}</span>
      </div>*/}
    </div>
  );
};

// PropTypes для валидации пропсов
ScenarioCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string.isRequired,
  duration: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  typeIcon: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  dataType: PropTypes.string
};

// Документация компонента для разработчиков
ScenarioCard.displayName = 'ScenarioCard';
ScenarioCard.__docgenInfo = {
  description: 'Карточка сценария для отображения в каталоге ситуаций',
  props: {
    title: {
      type: 'string',
      required: true,
      description: 'Название сценария'
    },
    id: {
      type: 'string|number',
      required: true,
      description: 'Уникальный идентификатор сценария (должен совпадать с ключом в situations.js)'
    },
    description: {
      type: 'string',
      required: true,
      description: 'Описание сценария'
    },
    type: {
      type: 'string',
      required: true,
      description: 'Тип педагогической ситуации'
    }
  }
};

export default ScenarioCard;
