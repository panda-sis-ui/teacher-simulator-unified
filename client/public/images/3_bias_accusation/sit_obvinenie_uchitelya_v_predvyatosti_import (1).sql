-- ============================================
-- Импорт сценария: Обвинение ученика в предвзятости оценивания
-- ID: sit_obvinenie_uchitelya_v_predvyatosti
-- Сгенерировано: 2026-03-21T18:15:02.982Z
-- ============================================
BEGIN;

-- 1. СПРАВОЧНИКИ
-- solution_type
INSERT INTO solution_type (name)
SELECT 'СтратегическоеРешение' WHERE NOT EXISTS (
  SELECT 1 FROM solution_type WHERE name = 'СтратегическоеРешение'
);

INSERT INTO solution_type (name)
SELECT 'ТактическоеРешение' WHERE NOT EXISTS (
  SELECT 1 FROM solution_type WHERE name = 'ТактическоеРешение'
);

-- response_strategy
INSERT INTO response_strategy (name)
SELECT 'Сотрудничество' WHERE NOT EXISTS (
  SELECT 1 FROM response_strategy WHERE name = 'Сотрудничество'
);

INSERT INTO response_strategy (name)
SELECT 'Компромисс' WHERE NOT EXISTS (
  SELECT 1 FROM response_strategy WHERE name = 'Компромисс'
);

INSERT INTO response_strategy (name)
SELECT 'Соперничество' WHERE NOT EXISTS (
  SELECT 1 FROM response_strategy WHERE name = 'Соперничество'
);

INSERT INTO response_strategy (name)
SELECT 'Избегание' WHERE NOT EXISTS (
  SELECT 1 FROM response_strategy WHERE name = 'Избегание'
);

-- resource
INSERT INTO resource (name)
SELECT 'Образовательный' WHERE NOT EXISTS (
  SELECT 1 FROM resource WHERE name = 'Образовательный'
);

INSERT INTO resource (name)
SELECT 'Информационный' WHERE NOT EXISTS (
  SELECT 1 FROM resource WHERE name = 'Информационный'
);

INSERT INTO resource (name)
SELECT 'Временной' WHERE NOT EXISTS (
  SELECT 1 FROM resource WHERE name = 'Временной'
);

INSERT INTO resource (name)
SELECT 'Материальный' WHERE NOT EXISTS (
  SELECT 1 FROM resource WHERE name = 'Материальный'
);

INSERT INTO resource (name)
SELECT 'Человеческий' WHERE NOT EXISTS (
  SELECT 1 FROM resource WHERE name = 'Человеческий'
);

-- type_consequence
INSERT INTO type_consequence (name)
SELECT 'Неудача' WHERE NOT EXISTS (
  SELECT 1 FROM type_consequence WHERE name = 'Неудача'
);

INSERT INTO type_consequence (name)
SELECT 'Успех' WHERE NOT EXISTS (
  SELECT 1 FROM type_consequence WHERE name = 'Успех'
);

INSERT INTO type_consequence (name)
SELECT 'ЧастичныйУспех' WHERE NOT EXISTS (
  SELECT 1 FROM type_consequence WHERE name = 'ЧастичныйУспех'
);


-- 2. КОНТЕКСТ УРОКА
INSERT INTO lesson (name) SELECT 'Информатика' WHERE NOT EXISTS (SELECT 1 FROM lesson WHERE name = 'Информатика');
INSERT INTO classroom (name) SELECT '9 класс' WHERE NOT EXISTS (SELECT 1 FROM classroom WHERE name = '9 класс');
INSERT INTO lesson_stage (name) SELECT 'Первичное закрепление' WHERE NOT EXISTS (SELECT 1 FROM lesson_stage WHERE name = 'Первичное закрепление');
INSERT INTO lesson_format (name) SELECT 'Очный' WHERE NOT EXISTS (SELECT 1 FROM lesson_format WHERE name = 'Очный');
INSERT INTO tech_equip (name) SELECT 'ПК+Интернет' WHERE NOT EXISTS (SELECT 1 FROM tech_equip WHERE name = 'ПК+Интернет');

INSERT INTO context (lesson_id, classroom_id, lesson_stage_id, lesson_format_id, tech_equip_id, duration)
SELECT
  (SELECT id FROM lesson WHERE name = $subject$Информатика$subject$ LIMIT 1),
  (SELECT id FROM classroom WHERE name = $grade$9 класс$grade$ LIMIT 1),
  (SELECT id FROM lesson_stage WHERE name = $phase$Первичное закрепление$phase$ LIMIT 1),
  (SELECT id FROM lesson_format WHERE name = $format$Очный$format$ LIMIT 1),
  (SELECT id FROM tech_equip WHERE name = $tech$ПК+Интернет$tech$ LIMIT 1),
  45
WHERE NOT EXISTS (
  SELECT 1 FROM context
  WHERE lesson_id = (SELECT id FROM lesson WHERE name = $subject$Информатика$subject$ LIMIT 1)
);


-- 3. УЧАСТНИКИ
-- Участник: Мария Петровна (Учитель)
INSERT INTO participant (full_name, age) VALUES ($name$Мария Петровна$name$, 45);

INSERT INTO emotion_intelligence (name) SELECT 'Средний' WHERE NOT EXISTS (SELECT 1 FROM emotion_intelligence WHERE name = 'Средний');
INSERT INTO pedagogical_style (name) SELECT 'Демократический' WHERE NOT EXISTS (SELECT 1 FROM pedagogical_style WHERE name = 'Демократический');
INSERT INTO professional_role (name) SELECT 'Предметник' WHERE NOT EXISTS (SELECT 1 FROM professional_role WHERE name = 'Предметник');

INSERT INTO teacher (participant_id, emotion_intell_id, style_id, prof_role_id, experience)
SELECT
  (SELECT id FROM participant WHERE full_name = $name$Мария Петровна$name$ ORDER BY id DESC LIMIT 1),
  (SELECT id FROM emotion_intelligence WHERE name = $ei$Средний$ei$ LIMIT 1),
  (SELECT id FROM pedagogical_style WHERE name = $style$Демократический$style$ LIMIT 1),
  (SELECT id FROM professional_role WHERE name = $role$Предметник$role$ LIMIT 1),
  8
WHERE NOT EXISTS (
  SELECT 1 FROM teacher WHERE participant_id = (SELECT id FROM participant WHERE full_name = $name$Мария Петровна$name$ ORDER BY id DESC LIMIT 1)
);

-- Участник: Дмитрий Волков (Ученик)
INSERT INTO participant (full_name, age) VALUES ($name$Дмитрий Волков$name$, 15);

INSERT INTO tech_equip (name) SELECT 'ПК+Интернет' WHERE NOT EXISTS (SELECT 1 FROM tech_equip WHERE name = 'ПК+Интернет');
INSERT INTO communication_style (name) SELECT 'Конфликтный' WHERE NOT EXISTS (SELECT 1 FROM communication_style WHERE name = 'Конфликтный');
INSERT INTO social_status (name) SELECT 'Принятые' WHERE NOT EXISTS (SELECT 1 FROM social_status WHERE name = 'Принятые');

INSERT INTO student (participant_id, tech_equip_id, comm_style_id, social_status_id, motivation, preparation)
SELECT
  (SELECT id FROM participant WHERE full_name = $name$Дмитрий Волков$name$ ORDER BY id DESC LIMIT 1),
  (SELECT id FROM tech_equip WHERE name = $tech$ПК+Интернет$tech$ LIMIT 1),
  (SELECT id FROM communication_style WHERE name = $comm$Конфликтный$comm$ LIMIT 1),
  (SELECT id FROM social_status WHERE name = $status$Принятые$status$ LIMIT 1),
  0.5,
  0.6
WHERE NOT EXISTS (
  SELECT 1 FROM student WHERE participant_id = (SELECT id FROM participant WHERE full_name = $name$Дмитрий Волков$name$ ORDER BY id DESC LIMIT 1)
);


-- 4. ПРОБЛЕМА
INSERT INTO type_problem (name) SELECT 'Конфликты взаимодействия' WHERE NOT EXISTS (SELECT 1 FROM type_problem WHERE name = 'Конфликты взаимодействия');
INSERT INTO source_problem (name) SELECT 'Внутренний' WHERE NOT EXISTS (SELECT 1 FROM source_problem WHERE name = 'Внутренний');
INSERT INTO emotion (name) SELECT 'Раздражение' WHERE NOT EXISTS (SELECT 1 FROM emotion WHERE name = 'Раздражение');
INSERT INTO emotion (name) SELECT 'Тревога' WHERE NOT EXISTS (SELECT 1 FROM emotion WHERE name = 'Тревога');
INSERT INTO emotion (name) SELECT 'Обида' WHERE NOT EXISTS (SELECT 1 FROM emotion WHERE name = 'Обида');

INSERT INTO problem (
  type_problem_id, source_problem_id, intensity, tension_factor, description,
  start_motivation, start_stress, start_trust, start_class_climate,
  start_teacher_authority, start_teacher_burnout
)
SELECT
  (SELECT id FROM type_problem WHERE name = $type$Конфликты взаимодействия$type$ LIMIT 1),
  (SELECT id FROM source_problem WHERE name = $source$Внутренний$source$ LIMIT 1),
  0.8,
  0.8,
  $desc$Ученик публично заявляет о предвзятости учителя после получения низкой оценки за контрольную работу.$desc$,
  0.3,
  0.8,
  0.3,
  0.3,
  0.4,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM problem WHERE description = $desc$Ученик публично заявляет о предвзятости учителя после получения низкой оценки за контрольную работу.$desc$
);

INSERT INTO problem_emotions (emotion_id, problem_id)
SELECT e.id, p.id
FROM emotion e, problem p
WHERE e.name IN ($emotion$Раздражение$emotion$, $emotion$Тревога$emotion$, $emotion$Обида$emotion$)
  AND p.description = $desc$Ученик публично заявляет о предвзятости учителя после получения низкой оценки за контрольную работу.$desc$
ON CONFLICT (emotion_id, problem_id) DO NOTHING;


-- 5. УЗЛЫ СЦЕНАРИЯ
-- Узел: node_1 (промежуточный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('После объявления оценок за контрольную работу Дмитрий резко встаёт и заявляет: «Это несправедливо! Вы всегда занижаете мне оценки!». Класс затихает, все смотрят на учителя. Лицо Дмитрия покраснело от возмущения, несколько учеников переглядываются. Учитель чувствует, как нарастает напряжение — от её реакции зависит, перерастёт ли это в открытый конфликт или удастся перевести ситуацию в конструктивное русло.', 'https://disk.yandex.ru/i/9sBlDMAJoHlTYw', false) RETURNING id;

-- Узел: node_1_1 (промежуточный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Учитель выбрал жёсткую позицию, но конфликт не исчерпан. Дмитрий продолжает настаивать на своём, его голос дрожит от обиды. Класс наблюдает за противостоянием. Необходимо выбрать конкретный способ защиты своей позиции, но каждый вариант несёт риски эскалации конфликта или потери доверия.', 'https://disk.yandex.ru/i/3aY60bUnK3KgpA', false) RETURNING id;

-- Узел: node_1_2 (промежуточный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Учитель предложил открытый диалог. Дмитрий немного успокоился, но всё ещё напряжён. Класс внимательно слушает. Теперь важно выбрать формат, который покажет объективность оценивания, не унизив ученика и сохранив учебное время.', 'https://disk.yandex.ru/i/dTDAqDM1ThjfCw', false) RETURNING id;

-- Узел: node_1_3 (промежуточный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Учитель выбрал формальный подход к решению конфликта. Дмитрий ожидает конкретных действий. Класс наблюдает, насколько серьёзно учитель относится к процедуре оценивания. Необходимо выбрать способ документирования, который покажет прозрачность без излишней бюрократизации.', 'https://disk.yandex.ru/i/WPblkgyistH_xg', false) RETURNING id;

-- Узел: out_5 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Ученик замолкает, но чувствует бессилие. Родители могут воспринять отказ от объяснений как неуважение. Конфликт не решён, напряжение сохраняется. Учитель сохраняет формальный авторитет, но доверие подорвано.', '', true) RETURNING id;

-- Узел: out_6 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Обвиняемый чувствует унижение, класс видит «любимчиков». Риск нарушения конфиденциальности оценок. Атмосфера в классе ухудшается, учитель воспринимается учениками как непонимающий.', '', true) RETURNING id;

-- Узел: out_7 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Конфликт переходит на уровень администрации. Учитель теряет контроль над ситуацией. Родители занимают оборонительную позицию. Начинаются бюрократические разбирательства.', '', true) RETURNING id;

-- Узел: out_8 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Ученик видит конкретные ошибки, чувствует внимание к себе. Конфликт переводится в конструктивное русло. Личный контакт укрепляет доверие. Учитель демонстрирует профессионализм.', '', true) RETURNING id;

-- Узел: out_9 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Класс видит единые правила. Обвинение теряет почву. Есть риск восприятия как оправдания, но в целом ситуация стабилизируется. Учитель показывает системный подход.', '', true) RETURNING id;

-- Узел: out_10 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Снижается острота конфликта, появляется шанс на исправление. Ученик чувствует гибкость учителя. Мотивация растёт, но есть риск восприятия как «подачки».', '', true) RETURNING id;

-- Узел: out_11 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Оценка становится объективной и проверяемой. Снижается пространство для субъективных обвинений. Учитель демонстрирует профессиональную подготовку.', '', true) RETURNING id;

-- Узел: out_12 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Максимальная объективность, но признание сомнений в своей оценке. Есть риск подрыва собственного авторитета. Ученик видит открытость к проверке.', '', true) RETURNING id;

-- Узел: out_13 (финальный)
INSERT INTO script_node (description, url_image, is_terminal) VALUES ('Многие обвинения снимаются при необходимости документирования. Конфликт переводится в официальное русло. Снижается эмоциональность, но процесс формализуется.', '', true) RETURNING id;


-- 6. РЕШЕНИЯ И ВЫБОРЫ
-- Решение для выбора ch_1
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$СтратегическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Сотрудничество$strat$ LIMIT 1),
  4,
  7
RETURNING id;

INSERT INTO resource (name) SELECT 'Образовательный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Образовательный');
INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO resource (name) SELECT 'Временной' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Временной');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
);

-- Выбор ch_1
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$После объявления оценок за контрольную работу Дмитрий резко встаёт и заявляет: «Это несправедливо! Вы всегда занижаете мне оценки!». Класс затихает, все смотрят на учителя. Лицо Дмитрия покраснело от возмущения, несколько учеников переглядываются. Учитель чувствует, как нарастает напряжение — от её реакции зависит, перерастёт ли это в открытый конфликт или удастся перевести ситуацию в конструктивное русло.$node$ LIMIT 1),
  NULL,
  $desc$Давайте разберём критерии оценивания вместе$desc$,
  0.3,
  -0.4,
  0.4,
  0.2,
  0.3,
  -0.1
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Давайте разберём критерии оценивания вместе$desc$
);

-- Решение для выбора ch_2
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$СтратегическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Компромисс$strat$ LIMIT 1),
  5,
  5
RETURNING id;

INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO resource (name) SELECT 'Материальный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Материальный');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
);

-- Выбор ch_2
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$После объявления оценок за контрольную работу Дмитрий резко встаёт и заявляет: «Это несправедливо! Вы всегда занижаете мне оценки!». Класс затихает, все смотрят на учителя. Лицо Дмитрия покраснело от возмущения, несколько учеников переглядываются. Учитель чувствует, как нарастает напряжение — от её реакции зависит, перерастёт ли это в открытый конфликт или удастся перевести ситуацию в конструктивное русло.$node$ LIMIT 1),
  NULL,
  $desc$Предоставлю письменные критерии оценки$desc$,
  0.2,
  -0.3,
  0.3,
  0.1,
  0.2,
  -0.1
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Предоставлю письменные критерии оценки$desc$
);

-- Решение для выбора ch_3
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$ТактическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Соперничество$strat$ LIMIT 1),
  9,
  5
RETURNING id;

INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO resource (name) SELECT 'Материальный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Материальный');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
);

-- Выбор ch_3
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель выбрал жёсткую позицию, но конфликт не исчерпан. Дмитрий продолжает настаивать на своём, его голос дрожит от обиды. Класс наблюдает за противостоянием. Необходимо выбрать конкретный способ защиты своей позиции, но каждый вариант несёт риски эскалации конфликта или потери доверия.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Обвиняемый чувствует унижение, класс видит «любимчиков». Риск нарушения конфиденциальности оценок. Атмосфера в классе ухудшается, учитель воспринимается учениками как непонимающий.$next$ LIMIT 1),
  $desc$Показать лучшие работы класса в качестве примера$desc$,
  -0.4,
  0.5,
  -0.5,
  -0.4,
  -0.2,
  0.3
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Показать лучшие работы класса в качестве примера$desc$
);

-- Решение для выбора ch_4
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$ТактическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Соперничество$strat$ LIMIT 1),
  10,
  3
RETURNING id;

INSERT INTO resource (name) SELECT 'Человеческий' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Человеческий');
INSERT INTO resource (name) SELECT 'Временной' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Временной');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Человеческий$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Человеческий$res$ LIMIT 1)
);

-- Выбор ch_4
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель выбрал жёсткую позицию, но конфликт не исчерпан. Дмитрий продолжает настаивать на своём, его голос дрожит от обиды. Класс наблюдает за противостоянием. Необходимо выбрать конкретный способ защиты своей позиции, но каждый вариант несёт риски эскалации конфликта или потери доверия.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Конфликт переходит на уровень администрации. Учитель теряет контроль над ситуацией. Родители занимают оборонительную позицию. Начинаются бюрократические разбирательства.$next$ LIMIT 1),
  $desc$Если не согласны — идите к завучу$desc$,
  -0.2,
  0.4,
  -0.3,
  -0.3,
  0,
  0.4
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Если не согласны — идите к завучу$desc$
);

-- Решение для выбора ch_5
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$ТактическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Компромисс$strat$ LIMIT 1),
  4,
  6
RETURNING id;

INSERT INTO resource (name) SELECT 'Образовательный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Образовательный');
INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
);

-- Выбор ch_5
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель предложил открытый диалог. Дмитрий немного успокоился, но всё ещё напряжён. Класс внимательно слушает. Теперь важно выбрать формат, который покажет объективность оценивания, не унизив ученика и сохранив учебное время.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Класс видит единые правила. Обвинение теряет почву. Есть риск восприятия как оправдания, но в целом ситуация стабилизируется. Учитель показывает системный подход.$next$ LIMIT 1),
  $desc$Напомнить всем критерии оценки данной работы$desc$,
  0.2,
  -0.2,
  0.3,
  0.2,
  0.2,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Напомнить всем критерии оценки данной работы$desc$
);

-- Решение для выбора ch_6
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$СтратегическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Сотрудничество$strat$ LIMIT 1),
  5,
  9
RETURNING id;

INSERT INTO resource (name) SELECT 'Образовательный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Образовательный');
INSERT INTO resource (name) SELECT 'Временной' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Временной');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Образовательный$res$ LIMIT 1)
);

-- Выбор ch_6
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель предложил открытый диалог. Дмитрий немного успокоился, но всё ещё напряжён. Класс внимательно слушает. Теперь важно выбрать формат, который покажет объективность оценивания, не унизив ученика и сохранив учебное время.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Снижается острота конфликта, появляется шанс на исправление. Ученик чувствует гибкость учителя. Мотивация растёт, но есть риск восприятия как «подачки».$next$ LIMIT 1),
  $desc$Ученик может улучшить оценку, выполнив работу повторно$desc$,
  0.4,
  -0.3,
  0.3,
  0.3,
  0.1,
  0.1
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Ученик может улучшить оценку, выполнив работу повторно$desc$
);

-- Решение для выбора ch_7
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$СтратегическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Компромисс$strat$ LIMIT 1),
  6,
  7
RETURNING id;

INSERT INTO resource (name) SELECT 'Человеческий' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Человеческий');
INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO resource (name) SELECT 'Временной' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Временной');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Человеческий$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Человеческий$res$ LIMIT 1)
);

-- Выбор ch_7
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель выбрал формальный подход к решению конфликта. Дмитрий ожидает конкретных действий. Класс наблюдает, насколько серьёзно учитель относится к процедуре оценивания. Необходимо выбрать способ документирования, который покажет прозрачность без излишней бюрократизации.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Максимальная объективность, но признание сомнений в своей оценке. Есть риск подрыва собственного авторитета. Ученик видит открытость к проверке.$next$ LIMIT 1),
  $desc$Предложить проверить работу другим преподавателем$desc$,
  0.1,
  -0.2,
  0.2,
  0.1,
  -0.1,
  0.1
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Предложить проверить работу другим преподавателем$desc$
);

-- Решение для выбора ch_8
INSERT INTO solution (sol_type_id, resp_strat_id, risk, student_autonomy)
SELECT
  (SELECT id FROM solution_type WHERE name = $type$ТактическоеРешение$type$ LIMIT 1),
  (SELECT id FROM response_strategy WHERE name = $strat$Избегание$strat$ LIMIT 1),
  5,
  5
RETURNING id;

INSERT INTO resource (name) SELECT 'Информационный' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Информационный');
INSERT INTO resource (name) SELECT 'Временной' WHERE NOT EXISTS (SELECT 1 FROM resource WHERE name = 'Временной');
INSERT INTO solution_resource (solution_id, resource_id)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM solution_resource
  WHERE solution_id = (SELECT id FROM solution ORDER BY id DESC LIMIT 1)
  AND resource_id = (SELECT id FROM resource WHERE name = $res$Информационный$res$ LIMIT 1)
);

-- Выбор ch_8
INSERT INTO choice (
  solution_id, from_script_node_id, next_script_node_id, description,
  delta_motivation, delta_stress, delta_trust,
  delta_class_climate, delta_teacher_authority, delta_teacher_burnout
)
SELECT
  (SELECT id FROM solution ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$Учитель выбрал формальный подход к решению конфликта. Дмитрий ожидает конкретных действий. Класс наблюдает, насколько серьёзно учитель относится к процедуре оценивания. Необходимо выбрать способ документирования, который покажет прозрачность без излишней бюрократизации.$node$ LIMIT 1),
  (SELECT id FROM script_node WHERE description = $next$Многие обвинения снимаются при необходимости документирования. Конфликт переводится в официальное русло. Снижается эмоциональность, но процесс формализуется.$next$ LIMIT 1),
  $desc$Попросить оформить претензию официально с подписью$desc$,
  0,
  -0.1,
  0.1,
  0,
  0.1,
  -0.1
WHERE NOT EXISTS (
  SELECT 1 FROM choice WHERE description = $desc$Попросить оформить претензию официально с подписью$desc$
);


-- 7. ПОСЛЕДСТВИЯ
-- Последствие для out_5
INSERT INTO type_consequence (name) SELECT 'Неудача' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'Неудача');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0,
  0.1,
  -0.1,
  0,
  0.5,
  0.7
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$Неудача$type$ LIMIT 1),
  $text$Ученик замолкает, но чувствует бессилие. Родители могут воспринять отказ от объяснений как неуважение. Конфликт не решён, напряжение сохраняется. Учитель сохраняет формальный авторитет, но доверие подорвано.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Ученик замолкает, но чувствует бессилие. Родители могут воспринять отказ от объяснений как неуважение. Конфликт не решён, напряжение сохраняется. Учитель сохраняет формальный авторитет, но доверие подорвано.$text$
);

-- Последствие для out_6
INSERT INTO type_consequence (name) SELECT 'Неудача' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'Неудача');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  -0.1,
  0.9,
  -0.2,
  -0.1,
  -0.1,
  0.8
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$Неудача$type$ LIMIT 1),
  $text$Обвиняемый чувствует унижение, класс видит «любимчиков». Риск нарушения конфиденциальности оценок. Атмосфера в классе ухудшается, учитель воспринимается учениками как непонимающий.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Обвиняемый чувствует унижение, класс видит «любимчиков». Риск нарушения конфиденциальности оценок. Атмосфера в классе ухудшается, учитель воспринимается учениками как непонимающий.$text$
);

-- Последствие для out_7
INSERT INTO type_consequence (name) SELECT 'Неудача' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'Неудача');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.1,
  0.9,
  0,
  -0.1,
  0.1,
  0.9
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$Неудача$type$ LIMIT 1),
  $text$Конфликт переходит на уровень администрации. Учитель теряет контроль над ситуацией. Родители занимают оборонительную позицию. Начинаются бюрократические разбирательства.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Конфликт переходит на уровень администрации. Учитель теряет контроль над ситуацией. Родители занимают оборонительную позицию. Начинаются бюрократические разбирательства.$text$
);

-- Последствие для out_8
INSERT INTO type_consequence (name) SELECT 'Успех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'Успех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.6,
  -0.4,
  0.7,
  0.5,
  0.6,
  -0.4
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$Успех$type$ LIMIT 1),
  $text$Ученик видит конкретные ошибки, чувствует внимание к себе. Конфликт переводится в конструктивное русло. Личный контакт укрепляет доверие. Учитель демонстрирует профессионализм.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Ученик видит конкретные ошибки, чувствует внимание к себе. Конфликт переводится в конструктивное русло. Личный контакт укрепляет доверие. Учитель демонстрирует профессионализм.$text$
);

-- Последствие для out_9
INSERT INTO type_consequence (name) SELECT 'ЧастичныйУспех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'ЧастичныйУспех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.5,
  -0.3,
  0.6,
  0.3,
  0.3,
  -0.4
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$ЧастичныйУспех$type$ LIMIT 1),
  $text$Класс видит единые правила. Обвинение теряет почву. Есть риск восприятия как оправдания, но в целом ситуация стабилизируется. Учитель показывает системный подход.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Класс видит единые правила. Обвинение теряет почву. Есть риск восприятия как оправдания, но в целом ситуация стабилизируется. Учитель показывает системный подход.$text$
);

-- Последствие для out_10
INSERT INTO type_consequence (name) SELECT 'Успех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'Успех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.7,
  -0.5,
  0.6,
  0.5,
  0.3,
  0.1
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$Успех$type$ LIMIT 1),
  $text$Снижается острота конфликта, появляется шанс на исправление. Ученик чувствует гибкость учителя. Мотивация растёт, но есть риск восприятия как «подачки».$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Снижается острота конфликта, появляется шанс на исправление. Ученик чувствует гибкость учителя. Мотивация растёт, но есть риск восприятия как «подачки».$text$
);

-- Последствие для out_11
INSERT INTO type_consequence (name) SELECT 'ЧастичныйУспех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'ЧастичныйУспех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.5,
  -0.5,
  0.4,
  0.2,
  0.2,
  0.2
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$ЧастичныйУспех$type$ LIMIT 1),
  $text$Оценка становится объективной и проверяемой. Снижается пространство для субъективных обвинений. Учитель демонстрирует профессиональную подготовку.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Оценка становится объективной и проверяемой. Снижается пространство для субъективных обвинений. Учитель демонстрирует профессиональную подготовку.$text$
);

-- Последствие для out_12
INSERT INTO type_consequence (name) SELECT 'ЧастичныйУспех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'ЧастичныйУспех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.4,
  0.2,
  0.1,
  0.1,
  0.2,
  -0.1
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$ЧастичныйУспех$type$ LIMIT 1),
  $text$Максимальная объективность, но признание сомнений в своей оценке. Есть риск подрыва собственного авторитета. Ученик видит открытость к проверке.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Максимальная объективность, но признание сомнений в своей оценке. Есть риск подрыва собственного авторитета. Ученик видит открытость к проверке.$text$
);

-- Последствие для out_13
INSERT INTO type_consequence (name) SELECT 'ЧастичныйУспех' WHERE NOT EXISTS (SELECT 1 FROM type_consequence WHERE name = 'ЧастичныйУспех');

INSERT INTO change_metrics (
  motivation, stress, trust, class_climate, teacher_authority, teacher_burnout
) VALUES (
  0.3,
  -0.4,
  0.1,
  0.1,
  0,
  0.1
) RETURNING id;

INSERT INTO consequence (
  change_metrics_id, type_conseq_id, text, long_term, reversible, intensity
)
SELECT
  (SELECT id FROM change_metrics ORDER BY id DESC LIMIT 1),
  (SELECT id FROM type_consequence WHERE name = $type$ЧастичныйУспех$type$ LIMIT 1),
  $text$Многие обвинения снимаются при необходимости документирования. Конфликт переводится в официальное русло. Снижается эмоциональность, но процесс формализуется.$text$,
  true,
  true,
  0.5
WHERE NOT EXISTS (
  SELECT 1 FROM consequence WHERE text = $text$Многие обвинения снимаются при необходимости документирования. Конфликт переводится в официальное русло. Снижается эмоциональность, но процесс формализуется.$text$
);


-- 8. СИТУАЦИЯ
INSERT INTO situation (context_id, problem_id, script_node_id, name)
SELECT
  (SELECT id FROM context ORDER BY id DESC LIMIT 1),
  (SELECT id FROM problem ORDER BY id DESC LIMIT 1),
  (SELECT id FROM script_node WHERE description = $node$После объявления оценок за контрольную работу Дмитрий резко встаёт и заявляет: «Это несправедливо! Вы всегда занижаете мне оценки!». Класс затихает, все смотрят на учителя. Лицо Дмитрия покраснело от возмущения, несколько учеников переглядываются. Учитель чувствует, как нарастает напряжение — от её реакции зависит, перерастёт ли это в открытый конфликт или удастся перевести ситуацию в конструктивное русло.$node$ LIMIT 1),
  $name$Обвинение ученика в предвзятости оценивания$name$
WHERE NOT EXISTS (
  SELECT 1 FROM situation WHERE name = $name$Обвинение ученика в предвзятости оценивания$name$
);

INSERT INTO situation_participants (situation_id, participant_id)
SELECT s.id, p.id
FROM situation s, participant p
WHERE s.name = $name$Обвинение ученика в предвзятости оценивания$name$
  AND p.full_name IN ($name$Мария Петровна$name$, $name$Дмитрий Волков$name$)
ON CONFLICT (situation_id, participant_id) DO NOTHING;


COMMIT;