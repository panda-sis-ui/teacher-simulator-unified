// src/data/situations.js
const situations = {
  // Локальные данные для офлайн-режима
  "1": {
    id: "1",
    title: "Обвинение ученика в предвзятости оценивания",
    name: "Обвинение ученика в предвзятости оценивания",
    initialNode: "221",
    contextRef: "ctx_informatika_9",
    problemRef: "prob_organizational_conflict",
    participantsRef: ["teacher_maria_ivanovna", "student_dima"],
    metadata: {
      difficulty: "medium",
      learning_objectives: ["Развитие эмпатии", "Управление конфликтами"],
      tags: ["конфликт", "оценивание", "дисциплина"]
    },
    nodes: {
      "221": {
        id: "221",
        description: "После объявления оценок за контрольную работу Дмитрий резко встаёт и заявляет...",
        urlImage: "https://disk.yandex.ru/i/9sBlDMAJoHlTYw",
        choices: [
          { id: 68, description: "Предоставлю письменные критерии оценки" },
          { id: 65, description: "Давайте разберём критерии оценивания вместе" },
          { id: 58, description: "Жёсткая защита позиции" }
        ]
      }
    }
  }
};

export default situations;