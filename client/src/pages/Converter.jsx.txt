// src/pages/Converter.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import LibraryDataCard from '../components/LibraryDataCard/LibraryDataCard';
import './Converter.css';

// Пример данных библиотеки (в реальном проекте это будет импорт из файла)
const SAMPLE_LIBRARY = {
  "contexts": {
    "ctx_информатика_8_контроль_1": {
      "id": "ctx_информатика_8_контроль_1",
      "subject": "Информатика",
      "grade": "8",
      "lessonPhase": "Контроль",
      "format": "Очный",
      "duration": "PT40M",
      "techEquipment": "Смарткласс",
      "description": "Информатика, 8 класс, этап: Контроль, очный формат"
    },
    "ctx_informatics_7_intro": {
      "id": "ctx_informatics_7_intro",
      "subject": "Информатика",
      "grade": "7",
      "lessonPhase": "Введение",
      "format": "Очный",
      "duration": "PT40M",
      "techEquipment": "Смарткласс",
      "description": "Урок информатики в 7 классе, знакомство с историей компьютеров"
    },
    "ctx_math_8_practice": {
      "id": "ctx_math_8_practice",
      "subject": "Математика",
      "grade": "8",
      "lessonPhase": "Практика",
      "format": "Очный",
      "duration": "PT45M",
      "techEquipment": "ПК+Интернет",
      "description": "Практический урок математики в 8 классе"
    },
    "ctx_biology_9_lab": {
      "id": "ctx_biology_9_lab",
      "subject": "Биология",
      "grade": "9",
      "lessonPhase": "Лабораторная работа",
      "format": "Очный",
      "duration": "PT60M",
      "techEquipment": "Лабораторное оборудование",
      "description": "Лабораторная работа по изучению клеток"
    },
    "ctx_literature_10_discussion": {
      "id": "ctx_literature_10_discussion",
      "subject": "Литература",
      "grade": "10",
      "lessonPhase": "Дискуссия",
      "format": "Очный",
      "duration": "PT40M",
      "techEquipment": "Классическая доска",
      "description": "Анализ романа 'Преступление и наказание'"
    },
    "ctx_информатика_9_введение_6": {
      "id": "ctx_информатика_9_введение_6",
      "subject": "Информатика",
      "grade": "9",
      "lessonPhase": "Введение",
      "format": "Очный",
      "duration": "PT45M",
      "techEquipment": "ПК+Интернет",
      "description": "Информатика, 9 класс, этап: Введение, очный формат"
    }
  },
  "participants": {
    "teacher_мария_ивановна": {
      "id": "teacher_мария_ивановна",
      "type": "Учитель",
      "name": "Мария Ивановна",
      "experience": 5,
      "ei": "Средний",
      "style": "Либеральный",
      "role": "Предметник",
      "age": 30
    },
    "student_миша": {
      "id": "student_миша",
      "type": "Ученик",
      "name": "Миша",
      "age": 13,
      "motivation": 0.7,
      "preparation": "Средний",
      "style": "Визуал",
      "socialStatus": "Лидер",
      "homeTech": "НетПК"
    },
    "teacher_anna": {
      "id": "teacher_anna",
      "type": "Учитель",
      "name": "Анна Сергеевна",
      "experience": 5,
      "ei": "Средний",
      "style": "Демократический",
      "role": "Предметник",
      "age": 32
    },
    "teacher_ivan": {
      "id": "teacher_ivan",
      "type": "Учитель",
      "name": "Иван Петрович",
      "experience": 12,
      "ei": "Высокий",
      "style": "Авторитарный",
      "role": "Классрук",
      "age": 45
    },
    "teacher_maria": {
      "id": "teacher_maria",
      "type": "Учитель",
      "name": "Мария Ивановна",
      "experience": 8,
      "ei": "Средний",
      "style": "Демократический",
      "role": "Классрук",
      "age": 38
    },
    "student_masha": {
      "id": "student_masha",
      "type": "Ученик",
      "name": "Маша",
      "age": 13,
      "motivation": 0.3,
      "preparation": "Слабый",
      "style": "Визуал",
      "socialStatus": "Изолированный",
      "homeTech": "ПК+Интернет"
    },
    "student_petya": {
      "id": "student_petya",
      "type": "Ученик",
      "name": "Петя",
      "age": 14,
      "motivation": 0.8,
      "preparation": "Сильный",
      "style": "Кинестетик",
      "socialStatus": "Лидер",
      "homeTech": "Смарткласс"
    },
    "student_liza": {
      "id": "student_liza",
      "type": "Ученик",
      "name": "Лиза",
      "age": 13,
      "motivation": 0.6,
      "preparation": "Средний",
      "style": "Аудиал",
      "socialStatus": "Последователь",
      "homeTech": "ТолькоТелефон"
    },
    "student_andrey": {
      "id": "student_andrey",
      "type": "Ученик",
      "name": "Андрей",
      "age": 15,
      "motivation": 0.9,
      "preparation": "Сильный",
      "style": "Дигитал",
      "socialStatus": "Лидер",
      "homeTech": "ПК+Интернет"
    },
    "student_olga": {
      "id": "student_olga",
      "type": "Ученик",
      "name": "Ольга",
      "age": 14,
      "motivation": 0.4,
      "preparation": "Средний",
      "style": "Визуал",
      "socialStatus": "Активный",
      "homeTech": "Планшет"
    },
    "student_dima": {
      "id": "student_dima",
      "type": "Ученик",
      "name": "Дима",
      "age": 13,
      "motivation": 0.2,
      "preparation": "Слабый",
      "style": "Кинестетик",
      "socialStatus": "Застенчивый",
      "homeTech": "Только телефон"
    }
  },
  "problems": {
    "prob_1": {
      "id": "prob_1",
      "type": "Мотивационные кризисы",
      "source": "Внутренний",
      "intensity": "Высокая",
      "emotions": [
        "Апатия",
        "Раздражение",
        "Стыд",
        "Страх"
      ],
      "tensionFactor": 0.8,
      "description": "Пример описания проблемы"
    },
    "prob_motivation_apathy": {
      "id": "prob_motivation_apathy",
      "type": "Мотивационные кризисы",
      "source": "Внутренний",
      "intensity": "Средняя",
      "emotions": [
        "Апатия",
        "Скука"
      ],
      "tensionFactor": 0.6,
      "description": "Снижение учебной мотивации на теоретических темах"
    },
    "prob_conflict_interpersonal": {
      "id": "prob_conflict_interpersonal",
      "type": "Межличностные конфликты",
      "source": "Внутренний",
      "intensity": "Высокая",
      "emotions": [
        "Раздражение",
        "Тревога"
      ],
      "tensionFactor": 0.8,
      "description": "Конфликт между двумя учениками в классе"
    },
    "prob_tech_divide": {
      "id": "prob_tech_divide",
      "type": "Конфликты взаимодействия",
      "source": "Системный",
      "intensity": "Средняя",
      "emotions": [
        "Стыд",
        "Тревога"
      ],
      "tensionFactor": 0.7,
      "description": "Цифровое неравенство среди учеников"
    },
    "prob_organizational_conflict": {
      "id": "prob_organizational_conflict",
      "type": "Организационные конфликты",
      "source": "Внешний",
      "intensity": "Высокая",
      "emotions": [
        "Страх",
        "Тревога"
      ],
      "tensionFactor": 0.75,
      "description": "Конфликт с родителями по поводу оценок"
    },
    "prob_late_student": {
      "id": "prob_late_student",
      "type": "Организационные конфликты",
      "source": "Внешний",
      "intensity": "Средняя",
      "emotions": [
        "Раздражение",
        "Стыд"
      ],
      "tensionFactor": 0.6,
      "description": "Ученик регулярно опаздывает на уроки"
    },
    "proc_understanding_difficulty": {
      "id": "proc_understanding_difficulty",
      "type": "Внутриличностные конфликты",
      "source": "Внутренний",
      "intensity": "Высокая",
      "emotions": [
        "Тревога",
        "Смятение"
      ],
      "tensionFactor": 0.7,
      "description": "Трудности с пониманием сложного материала"
    },
    "prob_cheating_attempt": {
      "id": "prob_cheating_attempt",
      "type": "Этические конфликты",
      "source": "Внутренний",
      "intensity": "Кризисная",
      "emotions": [
        "Стыд",
        "Страх"
      ],
      "tensionFactor": 0.9,
      "description": "Попытка списывания на контрольной работе"
    },
    "prob_9": {
      "id": "prob_9",
      "type": "Мотивационные кризисы",
      "source": "Внутренний",
      "intensity": "Средняя",
      "emotions": [
        "Апатия",
        "Раздражение"
      ],
      "tensionFactor": 0.6,
      "description": "Ученик демонстрирует отсутствие интереса к теме, постоянно отвлекается на телефон"
    }
  },
  "solutions": {
    "sol_1": {
      "id": "sol_1",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Соперничество",
      "risk": 3,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "щдшлгнеорткпаув",
      "duration": "PT20M"
    },
    "sol_2": {
      "id": "sol_2",
      "type": "СтратегическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "зжзжзжзж",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_3": {
      "id": "sol_3",
      "type": "СтратегическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Описание отсутствует",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_mental_maps": {
      "id": "sol_mental_maps",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 8,
      "resources": [
        "Образовательный",
        "Человеческий"
      ],
      "strengthens": [
        "Мотивация",
        "Доверие",
        "СплочённостьКласса"
      ],
      "weakens": [],
      "principles": [
        "УважениеКЛичности",
        "Справедливость"
      ],
      "duration": "PT25M",
      "description": "Создание ментальных карт в группах"
    },
    "sol_traditional_lecture": {
      "id": "sol_traditional_lecture",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Соперничество",
      "risk": 5,
      "autonomy": 2,
      "resources": [
        "Образовательный"
      ],
      "strengthens": [
        "АвторитетУчителя"
      ],
      "weakens": [
        "Мотивация",
        "Доверие"
      ],
      "principles": [
        "Научность"
      ],
      "duration": "PT40M",
      "description": "Традиционная лекция с объяснением материала"
    },
    "sol_gamification_quiz": {
      "id": "sol_gamification_quiz",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Компромисс",
      "risk": 3,
      "autonomy": 5,
      "resources": [
        "Образовательный",
        "Аппаратный"
      ],
      "strengthens": [
        "Мотивация",
        "СплочённостьКласса"
      ],
      "weakens": [
        "Стресс"
      ],
      "principles": [
        "Доступность",
        "Гуманизм"
      ],
      "duration": "PT30M",
      "description": "Проведение образовательной викторины с элементами игры"
    },
    "sol_project_based": {
      "id": "sol_project_based",
      "type": "СтратегическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 9,
      "resources": [
        "Образовательный",
        "Человеческий",
        "Информационный"
      ],
      "strengthens": [
        "Мотивация",
        "Доверие",
        "СплочённостьКласса"
      ],
      "weakens": [
        "Стресс"
      ],
      "principles": [
        "УважениеКЛичности",
        "Справедливость",
        "Гуманизм"
      ],
      "duration": "P2W",
      "description": "Долгосрочный проект в группах по выбранной теме"
    },
    "sol_tech_integration": {
      "id": "sol_tech_integration",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Приспособление",
      "risk": 3,
      "autonomy": 6,
      "resources": [
        "Аппаратный",
        "Информационный"
      ],
      "strengthens": [
        "Мотивация"
      ],
      "weakens": [
        "ЦифровоеРазделение"
      ],
      "principles": [
        "Доступность"
      ],
      "duration": "PT35M",
      "description": "Использование цифровых технологий в обучении с учетом разных возможностей учеников"
    },
    "sol_individual_help": {
      "id": "sol_individual_help",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 4,
      "resources": [
        "Образовательный",
        "Человеческий"
      ],
      "strengthens": [
        "Доверие",
        "Мотивация"
      ],
      "weakens": [],
      "principles": [
        "Индивидуальный подход",
        "Гуманизм"
      ],
      "duration": "PT15M",
      "description": "Индивидуальная помощь ученику во время урока"
    },
    "sol_mediator_talk": {
      "id": "sol_mediator_talk",
      "type": "ТактическоеРешение",
      "method": "РолеваяИгра",
      "strategy": "Компромисс",
      "risk": 3,
      "autonomy": 6,
      "resources": [
        "Человеческий"
      ],
      "strengthens": [
        "Доверие",
        "СплочённостьКласса"
      ],
      "weakens": [
        "Стресс"
      ],
      "principles": [
        "УважениеКЛичности",
        "Справедливость"
      ],
      "duration": "PT20M",
      "description": "Медиативная беседа для разрешения конфликта"
    },
    "sol_visual_explanation": {
      "id": "sol_visual_explanation",
      "type": "ТактическоеРешение",
      "method": "Визуализация",
      "strategy": "Обучение",
      "risk": 2,
      "autonomy": 3,
      "resources": [
        "Образовательный",
        "Аппаратный"
      ],
      "strengthens": [
        "Мотивация",
        "Доверие"
      ],
      "weakens": [],
      "principles": [
        "Наглядность",
        "Доступность"
      ],
      "duration": "PT15M",
      "description": "Объяснение сложного материала с помощью визуальных средств"
    },
    "sol_12": {
      "id": "sol_12",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Соперничество",
      "risk": 7,
      "autonomy": 2,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Прямое публичное замечание для немедленного восстановления дисциплины",
      "duration": "PT20M"
    },
    "sol_13": {
      "id": "sol_13",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 2,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Личный подход к ученику для выяснения причин поведения",
      "duration": "PT20M"
    },
    "sol_14": {
      "id": "sol_14",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Избегание",
      "risk": 6,
      "autonomy": 1,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Сознательное игнорирование проблемы в надежде на саморегуляцию",
      "duration": "PT20M"
    },
    "sol_15": {
      "id": "sol_15",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Соперничество",
      "risk": 8,
      "autonomy": 3,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Публичное испытание для демонстрации контроля над ситуацией",
      "duration": "PT20M"
    },
    "sol_16": {
      "id": "sol_16",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Компромисс",
      "risk": 4,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Переход к практической работе для повышения вовлеченности",
      "duration": "PT20M"
    },
    "sol_17": {
      "id": "sol_17",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 5,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Изменение содержания или формы урока для перезагрузки внимания",
      "duration": "PT20M"
    },
    "sol_18": {
      "id": "sol_18",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 8,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Исследование личных интересов ученика для персонализации обучения",
      "duration": "PT20M"
    },
    "sol_19": {
      "id": "sol_19",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 4,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Индивидуализация задания с сохранением учебных целей",
      "duration": "PT20M"
    },
    "sol_20": {
      "id": "sol_20",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 4,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Демонстрация практической значимости учебного материала",
      "duration": "PT20M"
    },
    "sol_21": {
      "id": "sol_21",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Соперничество",
      "risk": 4,
      "autonomy": 2,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Коллективное напоминание о правилах без персональной атаки",
      "duration": "PT20M"
    },
    "sol_22": {
      "id": "sol_22",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Использование игровых элементов для активизации класса",
      "duration": "PT20M"
    },
    "sol_23": {
      "id": "sol_23",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 5,
      "autonomy": 8,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Изоляция проблемы через индивидуальную работу",
      "duration": "PT20M"
    },
    "sol_24": {
      "id": "sol_24",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Поддерживающая помощь в ситуации публичного напряжения",
      "duration": "PT20M"
    },
    "sol_25": {
      "id": "sol_25",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Использование ресурсов класса для помощи ученику",
      "duration": "PT20M"
    },
    "sol_26": {
      "id": "sol_26",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Соперничество",
      "risk": 7,
      "autonomy": 2,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Жесткое завершение неловкой ситуации с указанием на недостаток подготовки",
      "duration": "PT20M"
    },
    "sol_27": {
      "id": "sol_27",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Персональное сопровождение в начале сложного задания",
      "duration": "PT20M"
    },
    "sol_28": {
      "id": "sol_28",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 4,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Адаптация сложности задания к уровню подготовки учеников",
      "duration": "PT20M"
    },
    "sol_29": {
      "id": "sol_29",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Создание смешанной группы для взаимного обучения",
      "duration": "PT20M"
    },
    "sol_30": {
      "id": "sol_30",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Интеграция актуальных интересов в учебный контекст",
      "duration": "PT20M"
    },
    "sol_31": {
      "id": "sol_31",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Визуальная демонстрация связи теории и практики",
      "duration": "PT20M"
    },
    "sol_32": {
      "id": "sol_32",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 3,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Творческое задание для развития креативного мышления",
      "duration": "PT20M"
    },
    "sol_33": {
      "id": "sol_33",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Конкретные примеры применения учебного материала в интересующей области",
      "duration": "PT20M"
    },
    "sol_34": {
      "id": "sol_34",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 6,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Долгосрочная мотивация через значимый личный проект",
      "duration": "PT20M"
    },
    "sol_35": {
      "id": "sol_35",
      "type": "СтратегическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 6,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Долгосрочная мотивация через значимый личный проект",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_36": {
      "id": "sol_36",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 4,
      "autonomy": 10,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Полная индивидуализация обучения на основе выявленных интересов",
      "duration": "PT20M"
    },
    "sol_37": {
      "id": "sol_37",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 8,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Сбалансированный контроль с предоставлением самостоятельности",
      "duration": "PT20M"
    },
    "sol_38": {
      "id": "sol_38",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Социализация индивидуальной работы через презентацию результатов",
      "duration": "PT20M"
    },
    "sol_39": {
      "id": "sol_39",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Избегание",
      "risk": 6,
      "autonomy": 10,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Полное доверие и минимальное вмешательство в работу ученика",
      "duration": "PT20M"
    },
    "sol_40": {
      "id": "sol_40",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 3,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Изменение формата представления материала для лучшего понимания",
      "duration": "PT20M"
    },
    "sol_41": {
      "id": "sol_41",
      "type": "ТактическоеРешение",
      "method": "ТехноИнтеграция",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Использование знакомых примеров для объяснения сложных понятий",
      "duration": "PT20M"
    },
    "sol_42": {
      "id": "sol_42",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Вовлечение ученика в проектирование собственного обучения",
      "duration": "PT20M"
    },
    "sol_43": {
      "id": "sol_43",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Избегание",
      "risk": 7,
      "autonomy": 2,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Игнорирование эмоционального климата в пользу содержания урока",
      "duration": "PT20M"
    },
    "sol_44": {
      "id": "sol_44",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Компромисс",
      "risk": 4,
      "autonomy": 5,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Использование юмора для снижения напряженности",
      "duration": "PT20M"
    },
    "sol_45": {
      "id": "sol_45",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Приспособление",
      "risk": 4,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Тактическое упрощение задания для восстановления рабочей атмосферы",
      "duration": "PT20M"
    },
    "sol_46": {
      "id": "sol_46",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Целенаправленная поддержка отстающей группы",
      "duration": "PT20M"
    },
    "sol_47": {
      "id": "sol_47",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 8,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Наделение ответственностью для повышения вовлеченности",
      "duration": "PT20M"
    },
    "sol_48": {
      "id": "sol_48",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Положительное подкрепление для закрепления прогресса",
      "duration": "PT20M"
    },
    "sol_49": {
      "id": "sol_49",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Регулярный мониторинг индивидуальной работы",
      "duration": "PT20M"
    },
    "sol_50": {
      "id": "sol_50",
      "type": "ТактическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Введение элемента взаимопроверки для социализации работы",
      "duration": "PT20M"
    },
    "sol_51": {
      "id": "sol_51",
      "type": "ТактическоеРешение",
      "method": "ТрадиционноеОбучение",
      "strategy": "Избегание",
      "risk": 6,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Минимальное вмешательство в самостоятельную работу",
      "duration": "PT20M"
    },
    "sol_52": {
      "id": "sol_52",
      "type": "СтратегическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 8,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Долгосрочное вовлечение через внеурочную деятельность и наставничество",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_53": {
      "id": "sol_53",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 4,
      "autonomy": 6,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Углубленный разбор ситуации в спокойной обстановке",
      "duration": "PT20M"
    },
    "sol_54": {
      "id": "sol_54",
      "type": "СтратегическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 6,
      "autonomy": 4,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Профессиональная помощь в сложной педагогической ситуации",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_55": {
      "id": "sol_55",
      "type": "СтратегическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 5,
      "autonomy": 9,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Превращение ученика из потребителя в создателя учебного контента",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_56": {
      "id": "sol_56",
      "type": "СтратегическоеРешение",
      "method": "ПроектнаяДеятельность",
      "strategy": "Сотрудничество",
      "risk": 6,
      "autonomy": 10,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Трансформация интереса в серьезную учебно-исследовательскую работу",
      "duration": "P1M",
      "frequency": "еженедельно"
    },
    "sol_57": {
      "id": "sol_57",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Сотрудничество",
      "risk": 3,
      "autonomy": 7,
      "resources": [],
      "strengthens": [],
      "weakens": [],
      "principles": [],
      "description": "Публичное признание достижений для укрепления самооценки",
      "duration": "PT20M"
    }
  },
  "outcomes": {
    "out_mental_maps_success": {
      "id": "out_mental_maps_success",
      "type": "success",
      "text": "Ученики активно включились в работу. Группы создали красочные ментальные карты. Улучшилось понимание темы и взаимодействие между учениками.",
      "longTerm": true,
      "reversible": false,
      "intensity": 85,
      "metrics": {
        "motivationChange": 0.5,
        "stressChange": -0.2,
        "trustChange": 0.4,
        "classClimateChange": 0.4,
        "teacherAuthorityChange": 0.3,
        "burnoutChange": -0.1
      }
    },
    "out_lecture_boredom_failure": {
      "id": "out_lecture_boredom_failure",
      "type": "failure",
      "text": "Традиционная лекция не вызвала интереса у учеников. Большинство отвлеклись на телефоны, атмосфера в классе стала напряженной.",
      "longTerm": false,
      "reversible": true,
      "intensity": 70,
      "metrics": {
        "motivationChange": -0.4,
        "stressChange": 0.3,
        "trustChange": -0.2,
        "classClimateChange": -0.3,
        "teacherAuthorityChange": -0.1,
        "burnoutChange": 0.2
      }
    },
    "out_gamification_partial": {
      "id": "out_gamification_partial",
      "type": "partial",
      "text": "Викторина развеселила учеников, но слабые ученики почувствовали себя неуверенно. Знания усвоены поверхностно.",
      "longTerm": false,
      "reversible": true,
      "intensity": 60,
      "metrics": {
        "motivationChange": 0.2,
        "stressChange": 0.1,
        "trustChange": 0.1,
        "classClimateChange": 0.2,
        "teacherAuthorityChange": 0.1,
        "burnoutChange": 0
      }
    },
    "out_project_success": {
      "id": "out_project_success",
      "type": "success",
      "text": "Проектная работа прошла успешно. Ученики проявили самостоятельность, научились работать в команде, результаты превзошли ожидания.",
      "longTerm": true,
      "reversible": false,
      "intensity": 90,
      "metrics": {
        "motivationChange": 0.7,
        "stressChange": -0.1,
        "trustChange": 0.5,
        "classClimateChange": 0.6,
        "teacherAuthorityChange": 0.4,
        "burnoutChange": -0.2
      }
    },
    "out_conflict_resolved_success": {
      "id": "out_conflict_resolved_success",
      "type": "success",
      "text": "Медиативная беседа помогла разрешить конфликт. Ученики пришли к взаимопониманию, атмосфера в классе улучшилась.",
      "longTerm": true,
      "reversible": true,
      "intensity": 80,
      "metrics": {
        "motivationChange": 0.3,
        "stressChange": -0.4,
        "trustChange": 0.6,
        "classClimateChange": 0.5,
        "teacherAuthorityChange": 0.5,
        "burnoutChange": -0.3
      }
    },
    "out_individual_help_success": {
      "id": "out_individual_help_success",
      "type": "success",
      "text": "Индивидуальная помощь помогла ученику разобраться с материалом. Ученик почувствовал уверенность и начал активно работать.",
      "longTerm": true,
      "reversible": false,
      "intensity": 75,
      "metrics": {
        "motivationChange": 0.4,
        "stressChange": -0.3,
        "trustChange": 0.3,
        "classClimateChange": 0.2,
        "teacherAuthorityChange": 0.4,
        "burnoutChange": -0.1
      }
    },
    "out_visual_explanation_success": {
      "id": "out_visual_explanation_success",
      "type": "success",
      "text": "Визуальное объяснение помогло ученикам лучше понять сложный материал. Интерес к теме значительно вырос.",
      "longTerm": true,
      "reversible": false,
      "intensity": 80,
      "metrics": {
        "motivationChange": 0.5,
        "stressChange": -0.2,
        "trustChange": 0.3,
        "classClimateChange": 0.3,
        "teacherAuthorityChange": 0.3,
        "burnoutChange": -0.1
      }
    },
    "out_tech_integration_partial": {
      "id": "out_tech_integration_partial",
      "type": "partial",
      "text": "Использование технологий вызвало интерес, но у некоторых учеников возникли технические трудности. Не все смогли полноценно участвовать.",
      "longTerm": false,
      "reversible": true,
      "intensity": 65,
      "metrics": {
        "motivationChange": 0.3,
        "stressChange": 0.1,
        "trustChange": 0.1,
        "classClimateChange": 0.1,
        "teacherAuthorityChange": 0.2,
        "burnoutChange": 0.1
      }
    },
    "out_strict_response_failure": {
      "id": "out_strict_response_failure",
      "type": "failure",
      "text": "Строгое реагирование на проблему усугубило ситуацию. Ученики замкнулись, атмосфера в классе стала напряженной.",
      "longTerm": true,
      "reversible": false,
      "intensity": 75,
      "metrics": {
        "motivationChange": -0.5,
        "stressChange": 0.4,
        "trustChange": -0.4,
        "classClimateChange": -0.4,
        "teacherAuthorityChange": -0.2,
        "burnoutChange": 0.3
      }
    },
    "out_success_11": {
      "id": "out_success_11",
      "type": "success",
      "text": "К концу урока Алексей активно работает, задает вопросы, даже помогает одноклассникам. Он подходит после урока: 'Спасибо, теперь понял, зачем нужны алгоритмы'. На следующем уроке он один из первых поднимает руку.",
      "longTerm": true,
      "reversible": false,
      "intensity": 85,
      "metrics": {
        "motivationChange": 0,
        "stressChange": 0,
        "trustChange": 0,
        "classClimateChange": 0,
        "teacherAuthorityChange": 0,
        "burnoutChange": 0
      }
    },
    "out_partial_12": {
      "id": "out_partial_12",
      "type": "partial",
      "text": "Описание отсутствует",
      "longTerm": true,
      "reversible": false,
      "intensity": 50,
      "metrics": {
        "motivationChange": 0,
        "stressChange": 0,
        "trustChange": 0,
        "classClimateChange": 0,
        "teacherAuthorityChange": 0,
        "burnoutChange": 0
      }
    }
  },
  "metadata": {
    "version": "1.0.0",
    "created": "2026-01-09",
    "author": "Бублик",
    "description": "Библиотека педагогических объектов",
    "last_updated": "2026-01-09",
    "imported_from": "pedagogical_library.json"
  }
}


const Converter = () => {
  const [libraryData, setLibraryData] = useState(SAMPLE_LIBRARY);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_LIBRARY, null, 2));
  const [activeCategory, setActiveCategory] = useState('contexts');
  const [searchTerm, setSearchTerm] = useState('');

  // Статистика данных
  const stats = {
    contexts: Object.keys(libraryData.contexts || {}).length,
    participants: Object.keys(libraryData.participants || {}).length,
    problems: Object.keys(libraryData.problems || {}).length,
    solutions: Object.keys(libraryData.solutions || {}).length,
    outcomes: Object.keys(libraryData.outcomes || {}).length
  };

  // Обработка ввода JSON
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleJsonParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setLibraryData(parsed);
      alert('JSON успешно загружен!');
    } catch (error) {
      alert(`Ошибка парсинга JSON: ${error.message}`);
    }
  };

  const handleResetJson = () => {
    setJsonInput(JSON.stringify(SAMPLE_LIBRARY, null, 2));
    setLibraryData(SAMPLE_LIBRARY);
  };

  const handleExportJson = () => {
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
    const items = libraryData[activeCategory] || {};
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
          </div>

          {/* Информация о метаданных */}
          {libraryData.metadata && (
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
