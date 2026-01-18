// src/data/situations.js (переименуйте situationData.js в situations.js)
const situations = {
  "sit_motivation_informatika_9": { // ← ИСПРАВЛЕНО: добавлена буква 'i'
    id: "sit_motivation_informatika_9",
    title: "Андрей отвлекается на уроке информатики",
    initialNode: "start",
    contextRef: "ctx_информатика_9_введение_6",
    problemRef: "prob_9",
    participantsRef: ["teacher_мария_ивановна", "student_andrey"],
    metadata: {
      learning_objectives: ["Развитие эмпатии", "Управление вниманием"],
      tags: ["мотивация", "дисциплина", "информатика"]
    },
    nodes: {
      start: {
        id: "start",
        description: "Вы объясняете новый материал, но замечаете, что Андрей снова смотрит в телефон.",
        choices: [
          {
            id: "choice1",
            text: "Сделать публичное замечание",
            solutionRef: "sol_12",
            next: "outcome1"
          },
          {
            id: "choice2",
            text: "Подойти и тихо спросить, всё ли в порядке",
            solutionRef: "sol_13",
            next: "node2"
          }
        ]
      },
      node2: {
        id: "node2",
        description: "Андрей говорит, что материал ему неинтересен.",
        choices: [
          {
            id: "choice3",
            text: "Предложить ему помощь после урока",
            solutionRef: "sol_13",
            next: "outcome2"
          }
        ]
      },
      outcome1: {
        id: "outcome1",
        description: "Андрей обиделся и начал протестовать.",
        outcomeRef: "out_failure_16"
      },
      outcome2: {
        id: "outcome2",
        description: "Андрей согласился обсудить проблему после урока.",
        outcomeRef: "out_success_1"
      }
    }
  }
};

export default situations;
