// src/data/library.js
const library = {
  "contexts": {
    "ctx_информатика_9_введение_6": {
      "id": "ctx_информатика_9_введение_6",
      "subject": "Информатика",
      "grade": "9",
      "lessonPhase": "Введение",
      "format": "Очный",
      "duration": "PT45M",
      "techEquipment": "ПК+Интернет",
      "description": "Информатика, 9 класс, этап: Введение, очный формат"
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
    "prob_9": {
      "id": "prob_9",
      "type": "Мотивационные кризисы",
      "source": "Внутренний",
      "intensity": "Средняя",
      "emotions": ["Апатия", "Раздражение"],
      "tensionFactor": 0.6,
      "description": "Ученик демонстрирует отсутствие интереса к теме, постоянно отвлекается на телефон"
    },
    "prob_conflict_interpersonal": {
      "id": "prob_conflict_interpersonal",
      "type": "Межличностные конфликты",
      "source": "Внутренний",
      "intensity": "Высокая",
      "emotions": ["Раздражение", "Тревога"],
      "tensionFactor": 0.8,
      "description": "Конфликт между двумя учениками в классе"
    },
    "prob_tech_divide": {
      "id": "prob_tech_divide",
      "type": "Конфликты взаимодействия",
      "source": "Системный",
      "intensity": "Средняя",
      "emotions": ["Стыд", "Тревога"],
      "tensionFactor": 0.7,
      "description": "Цифровое неравенство среди учеников"
    },
    "prob_organizational_conflict": {
      "id": "prob_organizational_conflict",
      "type": "Организационные конфликты",
      "source": "Внешний",
      "intensity": "Высокая",
      "emotions": ["Страх", "Тревога"],
      "tensionFactor": 0.75,
      "description": "Конфликт с родителями по поводу оценок"
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
      "description": "Использование игровых элементов в обучении",
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
      "description": "Индивидуальный подход к ученикам",
      "duration": "P1M",
      "frequency": "еженедельно"
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
    "sol_gamification_quiz": {
      "id": "sol_gamification_quiz",
      "type": "ТактическоеРешение",
      "method": "Геймификация",
      "strategy": "Компромисс",
      "risk": 3,
      "autonomy": 5,
      "resources": ["Образовательный", "Аппаратный"],
      "strengthens": ["Мотивация", "СплочённостьКласса"],
      "weakens": ["Стресс"],
      "principles": ["Доступность", "Гуманизм"],
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
      "resources": ["Образовательный", "Человеческий", "Информационный"],
      "strengthens": ["Мотивация", "Доверие", "СплочённостьКласса"],
      "weakens": ["Стресс"],
      "principles": ["УважениеКЛичности", "Справедливость", "Гуманизм"],
      "duration": "P2W",
      "description": "Долгосрочный проект в группах по выбранной теме"
    },
    "sol_individual_help": {
      "id": "sol_individual_help",
      "type": "ТактическоеРешение",
      "method": "Дифференциация",
      "strategy": "Сотрудничество",
      "risk": 2,
      "autonomy": 4,
      "resources": ["Образовательный", "Человеческий"],
      "strengthens": ["Доверие", "Мотивация"],
      "weakens": [],
      "principles": ["Индивидуальный подход", "Гуманизм"],
      "duration": "PT15M",
      "description": "Индивидуальная помощь ученику во время урока"
    },
    "sol_visual_explanation": {
      "id": "sol_visual_explanation",
      "type": "ТактическоеРешение",
      "method": "Визуализация",
      "strategy": "Обучение",
      "risk": 2,
      "autonomy": 3,
      "resources": ["Образовательный", "Аппаратный"],
      "strengthens": ["Мотивация", "Доверие"],
      "weakens": [],
      "principles": ["Наглядность", "Доступность"],
      "duration": "PT15M",
      "description": "Объяснение сложного материала с помощью визуальных средств"
    }
  },

  "outcomes": {
    "out_failure_16": {
      "id": "out_failure_16",
      "type": "failure",
      "text": "Ситуация ухудшается. Андрей начинает открыто протестовать. Урок срывается, вы теряете контроль. После урока приходится вызывать родителей и обсуждать ситуацию с завучем.",
      "longTerm": true,
      "reversible": false,
      "intensity": 50,
      "metrics": {
        "motivationChange": -0.5,
        "stressChange": 0.4,
        "trustChange": -0.4,
        "classClimateChange": -0.5,
        "teacherAuthorityChange": -0.3,
        "burnoutChange": 0.3
      }
    },
    "out_success_1": {
      "id": "out_success_1",
      "type": "success",
      "text": "Андрей оценил ваш тактичный подход. Он отложил телефон и начал слушать объяснение. К концу урока он задал несколько вопросов по теме и даже попробовал решить задачу. Ситуация разрешилась конструктивно.",
      "longTerm": true,
      "reversible": false,
      "intensity": 85,
      "metrics": {
        "motivationChange": 0.6,
        "stressChange": -0.3,
        "trustChange": 0.4,
        "classClimateChange": 0.3,
        "teacherAuthorityChange": 0.2,
        "burnoutChange": -0.1
      }
    },
    "out_success_14": {
      "id": "out_success_14",
      "type": "success",
      "text": "К концу урока Андрей активно работает, помогает одноклассникам, задает умные вопросы. Он подходит после звонка: 'Спасибо, теперь понял, зачем эти алгоритмы'. На следующем уроке он первый поднимает руку.",
      "longTerm": true,
      "reversible": false,
      "intensity": 90,
      "metrics": {
        "motivationChange": 0.7,
        "stressChange": -0.4,
        "trustChange": 0.5,
        "classClimateChange": 0.4,
        "teacherAuthorityChange": 0.4,
        "burnoutChange": -0.2
      }
    },
    "out_partial_12": {
      "id": "out_partial_12",
      "type": "partial",
      "text": "Вы не только решили ситуацию на уроке, но и разработали индивидуальный план для Андрея. Через месяц он становится активным участником IT-кружка, создает свой первый проект. Его успех мотивирует других.",
      "longTerm": true,
      "reversible": false,
      "intensity": 75,
      "metrics": {
        "motivationChange": 0.5,
        "stressChange": -0.2,
        "trustChange": 0.3,
        "classClimateChange": 0.3,
        "teacherAuthorityChange": 0.3,
        "burnoutChange": -0.1
      }
    },
    "out_partial_15": {
      "id": "out_partial_15",
      "type": "partial",
      "text": "Андрей выполняет минимальные требования, но без энтузиазма. Он не мешает уроку, но и не проявляет интереса. Ситуация стабилизировалась, но глубинная проблема мотивации не решена.",
      "longTerm": false,
      "reversible": true,
      "intensity": 50,
      "metrics": {
        "motivationChange": 0.1,
        "stressChange": -0.1,
        "trustChange": 0.1,
        "classClimateChange": 0.1,
        "teacherAuthorityChange": 0,
        "burnoutChange": 0
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
    }
  },

  "metadata": {
    "version": "1.0.0",
    "created": "2026-01-09",
    "author": "Веб-интерфейс",
    "description": "Библиотека педагогических объектов",
    "last_updated": "2026-01-09"
  }
};

export default library;
