export class OntologyGraph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.edges = [];
    this.offset = { x: 0, y: 0 };
    this.scale = 1;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.hoveredNode = null;
    this.onHoverChange = null;

    this.initEvents();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredNode = null;
      if (this.onHoverChange) this.onHoverChange(null);
      this.render();
    });
  }

  onMouseDown(e) {
    this.isDragging = true;
    this.dragStart = { x: e.clientX, y: e.clientY };
    const moveHandler = (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.offset.x += dx / this.scale;
      this.offset.y += dy / this.scale;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.render();
    };
    const upHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - this.canvas.width / 2) / this.scale - this.offset.x;
    const worldY = (mouseY - this.canvas.height / 2) / this.scale - this.offset.y;
    let newNode = null;
    for (let node of this.nodes) {
      if (worldX >= node.x - node.width/2 &&
          worldX <= node.x + node.width/2 &&
          worldY >= node.y - node.height/2 &&
          worldY <= node.y + node.height/2) {
        newNode = node;
        break;
      }
    }
    if (newNode !== this.hoveredNode) {
      this.hoveredNode = newNode;
      if (this.onHoverChange) this.onHoverChange(newNode);
      this.canvas.style.cursor = newNode ? 'pointer' : 'move';
      this.render();
    }
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(this.scale * delta, 0.2), 3);
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - this.canvas.width / 2) / this.scale - this.offset.x;
    const worldY = (mouseY - this.canvas.height / 2) / this.scale - this.offset.y;
    this.scale = newScale;
    this.offset.x = (mouseX - this.canvas.width / 2) / this.scale - worldX;
    this.offset.y = (mouseY - this.canvas.height / 2) / this.scale - worldY;
    this.render();
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    if (this.nodes.length > 0) this.fitToView();
    this.render();
  }

  fitToView() {
    if (this.nodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.width / 2);
      maxX = Math.max(maxX, node.x + node.width / 2);
      minY = Math.min(minY, node.y - node.height / 2);
      maxY = Math.max(maxY, node.y + node.height / 2);
    });
    const w = this.canvas.width, h = this.canvas.height, padding = 80;
    const scaleX = (w - padding) / (maxX - minX);
    const scaleY = (h - padding) / (maxY - minY);
    this.scale = Math.min(scaleX, scaleY, 1.0);
    this.offset.x = -(minX + maxX) / 2;
    this.offset.y = -(minY + maxY) / 2;
  }

  applyForceLayout(iterations = 200) {
    const adjacency = new Map();
    for (let node of this.nodes) adjacency.set(node.id, []);
    for (let edge of this.edges) {
      adjacency.get(edge.from).push(edge.to);
      adjacency.get(edge.to).push(edge.from);
    }
    const attractionStrength = 0.03;
    const repulsionStrength = 1.2;
    const damping = 0.9;
    const minDistance = 180;
    let velocities = new Map();
    for (let node of this.nodes) velocities.set(node.id, { x: 0, y: 0 });
    for (let iter = 0; iter < iterations; iter++) {
      // Отталкивание
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i], b = this.nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.1) continue;
          const force = repulsionStrength * (minDistance * minDistance) / (dist * dist);
          const fx = (dx / dist) * force, fy = (dy / dist) * force;
          velocities.get(a.id).x += fx;
          velocities.get(a.id).y += fy;
          velocities.get(b.id).x -= fx;
          velocities.get(b.id).y -= fy;
        }
      }
      // Притяжение
      for (let edge of this.edges) {
        const a = this.nodes.find(n => n.id === edge.from);
        const b = this.nodes.find(n => n.id === edge.to);
        if (!a || !b) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.1) continue;
        const force = attractionStrength * dist;
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        velocities.get(a.id).x -= fx;
        velocities.get(a.id).y -= fy;
        velocities.get(b.id).x += fx;
        velocities.get(b.id).y += fy;
      }
      // Применение скоростей
      for (let node of this.nodes) {
        const v = velocities.get(node.id);
        node.x += v.x;
        node.y += v.y;
        v.x *= damping;
        v.y *= damping;
      }
    }
    let centerX = 0, centerY = 0;
    for (let node of this.nodes) {
      centerX += node.x;
      centerY += node.y;
    }
    centerX /= this.nodes.length;
    centerY /= this.nodes.length;
    for (let node of this.nodes) {
      node.x -= centerX;
      node.y -= centerY;
    }
  }

  resolveOverlaps() {
    const padding = 15;
    let moved = true;
    let iterations = 0;
    const maxIterations = 50;
    while (moved && iterations < maxIterations) {
      moved = false;
      iterations++;
      for (let i = 0; i < this.nodes.length; i++) {
        const a = this.nodes[i];
        const aLeft = a.x - a.width / 2, aRight = a.x + a.width / 2;
        const aTop = a.y - a.height / 2, aBottom = a.y + a.height / 2;
        for (let j = i + 1; j < this.nodes.length; j++) {
          const b = this.nodes[j];
          const bLeft = b.x - b.width / 2, bRight = b.x + b.width / 2;
          const bTop = b.y - b.height / 2, bBottom = b.y + b.height / 2;
          if (aRight + padding > bLeft && aLeft < bRight + padding &&
              aBottom + padding > bTop && aTop < bBottom + padding) {
            moved = true;
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist === 0) {
              a.x += 10;
              a.y += 10;
              continue;
            }
            const requiredX = (a.width + b.width) / 2 + padding;
            const requiredY = (a.height + b.height) / 2 + padding;
            const requiredDist = Math.hypot(requiredX, requiredY);
            const overlap = requiredDist - dist;
            if (overlap <= 0) continue;
            const nx = dx / dist, ny = dy / dist;
            const shift = overlap / 2;
            a.x += nx * shift;
            a.y += ny * shift;
            b.x -= nx * shift;
            b.y -= ny * shift;
          }
        }
      }
    }
  }

  load() {
    const ontologyData = {
      "nodes": [
  // ========== КЛАСТЕР "СИТУАЦИЯ И КОНТЕКСТ" ==========
  { "id": "1", "name": "ПедагогическаяСитуация", "attributes": { "id": "xsd:string", "initialNode": "xsd:string", "title": "xsd:string" }, "position_x": 200, "position_y": 150 },
  { "id": "2", "name": "КонтекстСитуации", "attributes": { "duration": "xsd:int", "format": "ФорматОбучения", "grade": "УчебныйКласс", "lessonPhase": "ЭтапУрока", "subject": "Предмет", "techEquipment": "ТехОснащённость" }, "position_x": 520, "position_y": 150 },
  { "id": "3", "name": "Участник", "attributes": { "id": "xsd:string", "name": "xsd:string", "type": "УчастникТип" }, "position_x": 840, "position_y": 150 },
  { "id": "6", "name": "Проблема", "attributes": { "description": "xsd:string", "emotions": "Эмоция[]", "intensity": "ОстротаПроблемы", "source": "ИсточникПроблемы", "startMetrics": "МетрикиСостояния", "type": "ТипПроблемы" }, "position_x": 1160, "position_y": 150 },
  { "id": "7", "name": "УзелСценария", "attributes": { "description": "xsd:string", "image": "xsd:anyURI" }, "position_x": 1480, "position_y": 150 },

  // ========== КЛАСТЕР "УЧИТЕЛЬ" ==========
  { "id": "4", "name": "Учитель", "attributes": { "emotionalIntelligence": "УровеньЭмоциональногоИнтеллекта", "experience": "xsd:int", "professionalRole": "ПрофессиональнаяРоль", "teachingStyle": "СтильПедагогики" }, "position_x": 200, "position_y": 370 },
  { "id": "29", "name": "УровеньЭмоциональногоИнтеллекта", "attributes": {}, "position_x": 520, "position_y": 370 },
  { "id": "30", "name": "СтильПедагогики", "attributes": {}, "position_x": 840, "position_y": 370 },
  { "id": "31", "name": "ПрофессиональнаяРоль", "attributes": {}, "position_x": 1160, "position_y": 370 },

  // ========== КЛАСТЕР "УЧЕНИК" ==========
  { "id": "5", "name": "Ученик", "attributes": { "age": "xsd:int", "commStyle": "СтильОбучения", "motivation": "xsd:float", "preparation": "УровеньПодготовки", "socialStatus": "СоциальныйСтатус", "techEquip": "ТехОснащённость" }, "position_x": 200, "position_y": 590 },
  { "id": "32", "name": "СтильОбучения", "attributes": {}, "position_x": 520, "position_y": 590 },
  { "id": "33", "name": "УровеньПодготовки", "attributes": {}, "position_x": 840, "position_y": 590 },
  { "id": "34", "name": "СоциальныйСтатус", "attributes": {}, "position_x": 1160, "position_y": 590 },
  { "id": "27", "name": "ТехОснащённость", "attributes": {}, "position_x": 1480, "position_y": 590 },
  { "id": "47", "name": "СтильОбщения", "attributes": {}, "position_x": 1800, "position_y": 590 },

  // ========== АТРИБУТЫ ПРОБЛЕМЫ (под проблемой) ==========
  { "id": "35", "name": "ТипПроблемы", "attributes": {}, "position_x": 200, "position_y": 810 },
  { "id": "36", "name": "ИсточникПроблемы", "attributes": {}, "position_x": 520, "position_y": 810 },
  { "id": "37", "name": "ОстротаПроблемы", "attributes": {}, "position_x": 840, "position_y": 810 },
  { "id": "38", "name": "Эмоция", "attributes": {}, "position_x": 1160, "position_y": 810 },
  { "id": "16", "name": "МетрикиСостояния", "attributes": { "classClimate": "xsd:float", "motivation": "xsd:float", "stress": "xsd:float", "teacherAuthority": "xsd:float", "teacherBurnout": "xsd:float", "trust": "xsd:float" }, "position_x": 1480, "position_y": 810 },

  // ========== СЦЕНАРИЙ, ВЫБОР, РЕШЕНИЕ, ИСХОД ==========
  { "id": "8", "name": "ВыборДействия", "attributes": { "description": "xsd:string", "id": "xsd:string" }, "position_x": 200, "position_y": 1030 },
  { "id": "9", "name": "Решение", "attributes": { "autonomy": "xsd:int", "resources": "ТипРесурса[]", "risk": "xsd:int", "strategy": "СтратегияРеагирования", "type": "ТипРешения" }, "position_x": 520, "position_y": 1030 },
  { "id": "12", "name": "Исход", "attributes": { "description": "xsd:string", "longTerm": "xsd:boolean", "reversible": "xsd:boolean", "type": "ТипИсхода" }, "position_x": 840, "position_y": 1030 },
  { "id": "41", "name": "СтратегияРеагирования", "attributes": {}, "position_x": 1160, "position_y": 1030 },
  { "id": "17", "name": "ТипРесурса", "attributes": {}, "position_x": 1480, "position_y": 1030 },
  { "id": "46", "name": "ТипРешения", "attributes": {}, "position_x": 1800, "position_y": 1030 },
  { "id": "45", "name": "ТипИсхода", "attributes": {}, "position_x": 2120, "position_y": 1030 },
  { "id": "15", "name": "МетрикиИзменения", "attributes": { "burnoutChange": "xsd:float", "classClimateChange": "xsd:float", "motivationChange": "xsd:float", "stressChange": "xsd:float", "teacherAuthorityChange": "xsd:float", "trustChange": "xsd:float" }, "position_x": 2440, "position_y": 1030 },

  // ========== ПЕРЕЧИСЛЕНИЯ (классы и экземпляры) ==========
  // --- Предмет (23) и его экземпляры (49-56) ---
  { "id": "23", "name": "Предмет", "attributes": {}, "position_x": 200, "position_y": 1300 },
  { "id": "49", "name": "Информатика", "attributes": {}, "position_x": 520, "position_y": 1300 },
  { "id": "50", "name": "Математика", "attributes": {}, "position_x": 800, "position_y": 1300 },
  { "id": "51", "name": "Физика", "attributes": {}, "position_x": 1080, "position_y": 1300 },
  { "id": "52", "name": "Химия", "attributes": {}, "position_x": 1360, "position_y": 1300 },
  { "id": "53", "name": "Биология", "attributes": {}, "position_x": 1640, "position_y": 1300 },
  { "id": "54", "name": "История", "attributes": {}, "position_x": 1920, "position_y": 1300 },
  { "id": "55", "name": "Литература", "attributes": {}, "position_x": 2200, "position_y": 1300 },
  { "id": "56", "name": "Иностранный язык", "attributes": {}, "position_x": 2480, "position_y": 1300 },

  // --- УчебныйКласс (24) и экземпляры (57-63) ---
  { "id": "24", "name": "УчебныйКласс", "attributes": {}, "position_x": 200, "position_y": 1520 },
  { "id": "57", "name": "5 класс", "attributes": {}, "position_x": 520, "position_y": 1520 },
  { "id": "58", "name": "6 класс", "attributes": {}, "position_x": 800, "position_y": 1520 },
  { "id": "59", "name": "7 класс", "attributes": {}, "position_x": 1080, "position_y": 1520 },
  { "id": "60", "name": "8 класс", "attributes": {}, "position_x": 1360, "position_y": 1520 },
  { "id": "61", "name": "9 класс", "attributes": {}, "position_x": 1640, "position_y": 1520 },
  { "id": "62", "name": "10 класс", "attributes": {}, "position_x": 1920, "position_y": 1520 },
  { "id": "63", "name": "11 класс", "attributes": {}, "position_x": 2200, "position_y": 1520 },

  // --- ЭтапУрока (25) и экземпляры (64-70) ---
  { "id": "25", "name": "ЭтапУрока", "attributes": {}, "position_x": 200, "position_y": 1740 },
  { "id": "64", "name": "Организационный момент", "attributes": {}, "position_x": 520, "position_y": 1740 },
  { "id": "65", "name": "Актуализация знаний", "attributes": {}, "position_x": 840, "position_y": 1740 },
  { "id": "66", "name": "Постановка учебной задачи", "attributes": {}, "position_x": 1160, "position_y": 1740 },
  { "id": "67", "name": "Открытие нового знания", "attributes": {}, "position_x": 1480, "position_y": 1740 },
  { "id": "68", "name": "Первичное закрепление", "attributes": {}, "position_x": 1800, "position_y": 1740 },
  { "id": "69", "name": "Самостоятельная работа с самопроверкой", "attributes": {}, "position_x": 2120, "position_y": 1740 },
  { "id": "70", "name": "Рефлексия", "attributes": {}, "position_x": 2440, "position_y": 1740 },

  // --- ФорматОбучения (26) и экземпляры (71-73) ---
  { "id": "26", "name": "ФорматОбучения", "attributes": {}, "position_x": 200, "position_y": 1960 },
  { "id": "71", "name": "Очный", "attributes": {}, "position_x": 520, "position_y": 1960 },
  { "id": "72", "name": "Онлайн", "attributes": {}, "position_x": 800, "position_y": 1960 },
  { "id": "73", "name": "Гибридный", "attributes": {}, "position_x": 1080, "position_y": 1960 },

  // --- ТехОснащённость (27 уже есть выше, но его экземпляры (74-78) разместим здесь ---
  { "id": "74", "name": "НетПК", "attributes": {}, "position_x": 520, "position_y": 2180 },
  { "id": "75", "name": "ТолькоТелефон", "attributes": {}, "position_x": 800, "position_y": 2180 },
  { "id": "76", "name": "ПК+Интернет", "attributes": {}, "position_x": 1080, "position_y": 2180 },
  { "id": "77", "name": "Смарткласс", "attributes": {}, "position_x": 1360, "position_y": 2180 },
  { "id": "78", "name": "ИнтерактивнаяДоска", "attributes": {}, "position_x": 1640, "position_y": 2180 },

  // --- УчастникТип (28) и экземпляры (79,80) ---
  { "id": "28", "name": "УчастникТип", "attributes": {}, "position_x": 200, "position_y": 2400 },
  { "id": "79", "name": "Учитель", "attributes": {}, "position_x": 520, "position_y": 2400 },
  { "id": "80", "name": "Ученик", "attributes": {}, "position_x": 800, "position_y": 2400 },

  // --- УровеньЭмоциональногоИнтеллекта (29 уже есть) и его экземпляры (81-83) ---
  { "id": "81", "name": "Низкий", "attributes": {}, "position_x": 520, "position_y": 2620 },
  { "id": "82", "name": "Средний", "attributes": {}, "position_x": 800, "position_y": 2620 },
  { "id": "83", "name": "Высокий", "attributes": {}, "position_x": 1080, "position_y": 2620 },

  // --- СтильПедагогики (30 уже есть) и экземпляры (84-86) ---
  { "id": "84", "name": "Авторитарный", "attributes": {}, "position_x": 520, "position_y": 2840 },
  { "id": "85", "name": "Либеральный", "attributes": {}, "position_x": 800, "position_y": 2840 },
  { "id": "86", "name": "Демократический", "attributes": {}, "position_x": 1080, "position_y": 2840 },

  // --- ПрофессиональнаяРоль (31 уже есть) и экземпляры (87,88) ---
  { "id": "87", "name": "Предметник", "attributes": {}, "position_x": 520, "position_y": 3060 },
  { "id": "88", "name": "КлассныйРуководитель", "attributes": {}, "position_x": 800, "position_y": 3060 },

  // --- СтильОбучения (32 уже есть) и экземпляры (89-92) ---
  { "id": "89", "name": "Визуал", "attributes": {}, "position_x": 520, "position_y": 3280 },
  { "id": "90", "name": "Аудиал", "attributes": {}, "position_x": 800, "position_y": 3280 },
  { "id": "91", "name": "Кинестетик", "attributes": {}, "position_x": 1080, "position_y": 3280 },
  { "id": "92", "name": "Дигитал", "attributes": {}, "position_x": 1360, "position_y": 3280 },

  // --- УровеньПодготовки (33 уже есть) и экземпляры (93-95) ---
  { "id": "93", "name": "Слабый", "attributes": {}, "position_x": 520, "position_y": 3500 },
  { "id": "94", "name": "Средний", "attributes": {}, "position_x": 800, "position_y": 3500 },
  { "id": "95", "name": "Сильный", "attributes": {}, "position_x": 1080, "position_y": 3500 },

  // --- СоциальныйСтатус (34 уже есть) и экземпляры (96-100) ---
  { "id": "96", "name": "Звёзды", "attributes": {}, "position_x": 520, "position_y": 3720 },
  { "id": "97", "name": "Предпочитаемые", "attributes": {}, "position_x": 800, "position_y": 3720 },
  { "id": "98", "name": "Принятые", "attributes": {}, "position_x": 1080, "position_y": 3720 },
  { "id": "99", "name": "Изолированные", "attributes": {}, "position_x": 1360, "position_y": 3720 },
  { "id": "100", "name": "Отвергаемые", "attributes": {}, "position_x": 1640, "position_y": 3720 },

  // --- СтильОбщения (47 уже есть) и экземпляры (101-104) ---
  { "id": "101", "name": "Активный", "attributes": {}, "position_x": 520, "position_y": 3940 },
  { "id": "102", "name": "Пассивный", "attributes": {}, "position_x": 800, "position_y": 3940 },
  { "id": "103", "name": "Конфликтный", "attributes": {}, "position_x": 1080, "position_y": 3940 },
  { "id": "104", "name": "Компромиссный", "attributes": {}, "position_x": 1360, "position_y": 3940 },

  // --- ТипПроблемы (35 уже есть) и экземпляры (105-107) ---
  { "id": "105", "name": "Мотивационные кризисы", "attributes": {}, "position_x": 520, "position_y": 4160 },
  { "id": "106", "name": "Организационные конфликты", "attributes": {}, "position_x": 840, "position_y": 4160 },
  { "id": "107", "name": "Конфликты взаимодействия", "attributes": {}, "position_x": 1160, "position_y": 4160 },

  // --- ИсточникПроблемы (36 уже есть) и экземпляры (108-110) ---
  { "id": "108", "name": "Внутренний", "attributes": {}, "position_x": 520, "position_y": 4380 },
  { "id": "109", "name": "Внешний", "attributes": {}, "position_x": 800, "position_y": 4380 },
  { "id": "110", "name": "Системный", "attributes": {}, "position_x": 1080, "position_y": 4380 },

  // --- ОстротаПроблемы (37 уже есть) и экземпляры (111-114) ---
  { "id": "111", "name": "Низкая", "attributes": {}, "position_x": 520, "position_y": 4600 },
  { "id": "112", "name": "Средняя", "attributes": {}, "position_x": 800, "position_y": 4600 },
  { "id": "113", "name": "Высокая", "attributes": {}, "position_x": 1080, "position_y": 4600 },
  { "id": "114", "name": "Кризисная", "attributes": {}, "position_x": 1360, "position_y": 4600 },

  // --- Эмоция (38 уже есть) и экземпляры (115-122) ---
  { "id": "115", "name": "Апатия", "attributes": {}, "position_x": 520, "position_y": 4820 },
  { "id": "116", "name": "Раздражение", "attributes": {}, "position_x": 800, "position_y": 4820 },
  { "id": "117", "name": "Стыд", "attributes": {}, "position_x": 1080, "position_y": 4820 },
  { "id": "118", "name": "Страх", "attributes": {}, "position_x": 1360, "position_y": 4820 },
  { "id": "119", "name": "Тревога", "attributes": {}, "position_x": 1640, "position_y": 4820 },
  { "id": "120", "name": "Доверие", "attributes": {}, "position_x": 1920, "position_y": 4820 },
  { "id": "121", "name": "Гнев", "attributes": {}, "position_x": 2200, "position_y": 4820 },
  { "id": "122", "name": "Обида", "attributes": {}, "position_x": 2480, "position_y": 4820 },

  // --- СтратегияРеагирования (41 уже есть) и экземпляры (123-127) ---
  { "id": "123", "name": "Сотрудничество", "attributes": {}, "position_x": 520, "position_y": 5040 },
  { "id": "124", "name": "Соперничество", "attributes": {}, "position_x": 800, "position_y": 5040 },
  { "id": "125", "name": "Компромисс", "attributes": {}, "position_x": 1080, "position_y": 5040 },
  { "id": "126", "name": "Приспособление", "attributes": {}, "position_x": 1360, "position_y": 5040 },
  { "id": "127", "name": "Избегание", "attributes": {}, "position_x": 1640, "position_y": 5040 },

  // --- ТипИсхода (45 уже есть) и экземпляры (128-130) ---
  { "id": "128", "name": "Успех", "attributes": {}, "position_x": 520, "position_y": 5260 },
  { "id": "129", "name": "ЧастичныйУспех", "attributes": {}, "position_x": 800, "position_y": 5260 },
  { "id": "130", "name": "Неудача", "attributes": {}, "position_x": 1080, "position_y": 5260 },

  // --- ТипРешения (46 уже есть) и экземпляры (131,132) ---
  { "id": "131", "name": "ТактическоеРешение", "attributes": {}, "position_x": 520, "position_y": 5480 },
  { "id": "132", "name": "СтратегическоеРешение", "attributes": {}, "position_x": 800, "position_y": 5480 },

  // --- ТипРесурса (17 уже есть) и экземпляры (133-138) ---
  { "id": "133", "name": "Образовательный", "attributes": {}, "position_x": 520, "position_y": 5700 },
  { "id": "134", "name": "Аппаратный", "attributes": {}, "position_x": 800, "position_y": 5700 },
  { "id": "135", "name": "Человеческий", "attributes": {}, "position_x": 1080, "position_y": 5700 },
  { "id": "136", "name": "Информационный", "attributes": {}, "position_x": 1360, "position_y": 5700 },
  { "id": "137", "name": "Временной", "attributes": {}, "position_x": 1640, "position_y": 5700 },
  { "id": "138", "name": "Материальный", "attributes": {}, "position_x": 1920, "position_y": 5700 }
],
      "relations": [
        // Оригинальные связи из e.txt (без instanceOf)
        { "source_node_id": "5", "destination_node_id": "3", "name": "subClassOf" },
        { "source_node_id": "1", "destination_node_id": "2", "name": "hasContext" },
        { "source_node_id": "1", "destination_node_id": "3", "name": "hasParticipant" },
        { "source_node_id": "1", "destination_node_id": "6", "name": "hasProblem" },
        { "source_node_id": "1", "destination_node_id": "7", "name": "hasInitialNode" },
        { "source_node_id": "7", "destination_node_id": "8", "name": "hasChoice" },
        { "source_node_id": "7", "destination_node_id": "12", "name": "hasOutcome" },
        { "source_node_id": "8", "destination_node_id": "9", "name": "implementsSolution" },
        { "source_node_id": "2", "destination_node_id": "23", "name": "hasSubject" },
        { "source_node_id": "2", "destination_node_id": "24", "name": "hasGrade" },
        { "source_node_id": "2", "destination_node_id": "25", "name": "hasLessonPhase" },
        { "source_node_id": "2", "destination_node_id": "26", "name": "hasFormat" },
        { "source_node_id": "2", "destination_node_id": "27", "name": "hasTechEquipment" },
        { "source_node_id": "3", "destination_node_id": "28", "name": "hasParticipantType" },
        { "source_node_id": "4", "destination_node_id": "29", "name": "hasEI" },
        { "source_node_id": "4", "destination_node_id": "30", "name": "hasTeachingStyle" },
        { "source_node_id": "4", "destination_node_id": "31", "name": "hasProfessionalRole" },
        { "source_node_id": "5", "destination_node_id": "33", "name": "hasPreparation" },
        { "source_node_id": "5", "destination_node_id": "32", "name": "hasLearningStyle" },
        { "source_node_id": "5", "destination_node_id": "34", "name": "hasSocialStatus" },
        { "source_node_id": "5", "destination_node_id": "27", "name": "hasTechEquip" },
        { "source_node_id": "6", "destination_node_id": "35", "name": "hasProblemType" },
        { "source_node_id": "6", "destination_node_id": "36", "name": "hasSource" },
        { "source_node_id": "6", "destination_node_id": "37", "name": "hasIntensity" },
        { "source_node_id": "6", "destination_node_id": "38", "name": "hasEmotion" },
        { "source_node_id": "9", "destination_node_id": "41", "name": "hasStrategy" },
        { "source_node_id": "9", "destination_node_id": "17", "name": "hasResource" },
        { "source_node_id": "12", "destination_node_id": "45", "name": "hasOutcomeType" },
        { "source_node_id": "12", "destination_node_id": "15", "name": "hasMetricsChange" },
        { "source_node_id": "6", "destination_node_id": "16", "name": "hasStartMetrics" },
        { "source_node_id": "8", "destination_node_id": "15", "name": "hasDeltaMetrics" },
        { "source_node_id": "9", "destination_node_id": "46", "name": "hasSolutionType" },
        { "source_node_id": "4", "destination_node_id": "3", "name": "" },
        { "source_node_id": "5", "destination_node_id": "47", "name": "" },

        // Добавленные связи instanceOf для всех экземпляров перечислений
        { "source_node_id": "49", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "50", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "51", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "52", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "53", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "54", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "55", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "56", "destination_node_id": "23", "name": "instanceOf" },
        { "source_node_id": "57", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "58", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "59", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "60", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "61", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "62", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "63", "destination_node_id": "24", "name": "instanceOf" },
        { "source_node_id": "64", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "65", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "66", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "67", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "68", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "69", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "70", "destination_node_id": "25", "name": "instanceOf" },
        { "source_node_id": "71", "destination_node_id": "26", "name": "instanceOf" },
        { "source_node_id": "72", "destination_node_id": "26", "name": "instanceOf" },
        { "source_node_id": "73", "destination_node_id": "26", "name": "instanceOf" },
        { "source_node_id": "74", "destination_node_id": "27", "name": "instanceOf" },
        { "source_node_id": "75", "destination_node_id": "27", "name": "instanceOf" },
        { "source_node_id": "76", "destination_node_id": "27", "name": "instanceOf" },
        { "source_node_id": "77", "destination_node_id": "27", "name": "instanceOf" },
        { "source_node_id": "78", "destination_node_id": "27", "name": "instanceOf" },
        { "source_node_id": "79", "destination_node_id": "28", "name": "instanceOf" },
        { "source_node_id": "80", "destination_node_id": "28", "name": "instanceOf" },
        { "source_node_id": "81", "destination_node_id": "29", "name": "instanceOf" },
        { "source_node_id": "82", "destination_node_id": "29", "name": "instanceOf" },
        { "source_node_id": "83", "destination_node_id": "29", "name": "instanceOf" },
        { "source_node_id": "84", "destination_node_id": "30", "name": "instanceOf" },
        { "source_node_id": "85", "destination_node_id": "30", "name": "instanceOf" },
        { "source_node_id": "86", "destination_node_id": "30", "name": "instanceOf" },
        { "source_node_id": "87", "destination_node_id": "31", "name": "instanceOf" },
        { "source_node_id": "88", "destination_node_id": "31", "name": "instanceOf" },
        { "source_node_id": "89", "destination_node_id": "32", "name": "instanceOf" },
        { "source_node_id": "90", "destination_node_id": "32", "name": "instanceOf" },
        { "source_node_id": "91", "destination_node_id": "32", "name": "instanceOf" },
        { "source_node_id": "92", "destination_node_id": "32", "name": "instanceOf" },
        { "source_node_id": "93", "destination_node_id": "33", "name": "instanceOf" },
        { "source_node_id": "94", "destination_node_id": "33", "name": "instanceOf" },
        { "source_node_id": "95", "destination_node_id": "33", "name": "instanceOf" },
        { "source_node_id": "96", "destination_node_id": "34", "name": "instanceOf" },
        { "source_node_id": "97", "destination_node_id": "34", "name": "instanceOf" },
        { "source_node_id": "98", "destination_node_id": "34", "name": "instanceOf" },
        { "source_node_id": "99", "destination_node_id": "34", "name": "instanceOf" },
        { "source_node_id": "100", "destination_node_id": "34", "name": "instanceOf" },
        { "source_node_id": "101", "destination_node_id": "47", "name": "instanceOf" },
        { "source_node_id": "102", "destination_node_id": "47", "name": "instanceOf" },
        { "source_node_id": "103", "destination_node_id": "47", "name": "instanceOf" },
        { "source_node_id": "104", "destination_node_id": "47", "name": "instanceOf" },
        { "source_node_id": "105", "destination_node_id": "35", "name": "instanceOf" },
        { "source_node_id": "106", "destination_node_id": "35", "name": "instanceOf" },
        { "source_node_id": "107", "destination_node_id": "35", "name": "instanceOf" },
        { "source_node_id": "108", "destination_node_id": "36", "name": "instanceOf" },
        { "source_node_id": "109", "destination_node_id": "36", "name": "instanceOf" },
        { "source_node_id": "110", "destination_node_id": "36", "name": "instanceOf" },
        { "source_node_id": "111", "destination_node_id": "37", "name": "instanceOf" },
        { "source_node_id": "112", "destination_node_id": "37", "name": "instanceOf" },
        { "source_node_id": "113", "destination_node_id": "37", "name": "instanceOf" },
        { "source_node_id": "114", "destination_node_id": "37", "name": "instanceOf" },
        { "source_node_id": "115", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "116", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "117", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "118", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "119", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "120", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "121", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "122", "destination_node_id": "38", "name": "instanceOf" },
        { "source_node_id": "123", "destination_node_id": "41", "name": "instanceOf" },
        { "source_node_id": "124", "destination_node_id": "41", "name": "instanceOf" },
        { "source_node_id": "125", "destination_node_id": "41", "name": "instanceOf" },
        { "source_node_id": "126", "destination_node_id": "41", "name": "instanceOf" },
        { "source_node_id": "127", "destination_node_id": "41", "name": "instanceOf" },
        { "source_node_id": "128", "destination_node_id": "45", "name": "instanceOf" },
        { "source_node_id": "129", "destination_node_id": "45", "name": "instanceOf" },
        { "source_node_id": "130", "destination_node_id": "45", "name": "instanceOf" },
        { "source_node_id": "131", "destination_node_id": "46", "name": "instanceOf" },
        { "source_node_id": "132", "destination_node_id": "46", "name": "instanceOf" },
        { "source_node_id": "133", "destination_node_id": "17", "name": "instanceOf" },
        { "source_node_id": "134", "destination_node_id": "17", "name": "instanceOf" },
        { "source_node_id": "135", "destination_node_id": "17", "name": "instanceOf" },
        { "source_node_id": "136", "destination_node_id": "17", "name": "instanceOf" },
        { "source_node_id": "137", "destination_node_id": "17", "name": "instanceOf" },
        { "source_node_id": "138", "destination_node_id": "17", "name": "instanceOf" }
      ]
    };

    const instanceOfSet = new Set();
    const subClassOfSet = new Set();
    ontologyData.relations.forEach(rel => {
      if (rel.name === "instanceOf") instanceOfSet.add(rel.source_node_id);
      else if (rel.name === "subClassOf" || rel.name === "") subClassOfSet.add(rel.source_node_id);
    });

    const angleStep = (2 * Math.PI) / ontologyData.nodes.length;
    // 1. Узлы с уникальными id
    this.nodes = ontologyData.nodes.map((node, idx) => {
      const attrsArray = [];
      if (node.attributes && typeof node.attributes === 'object') {
        for (const [key, value] of Object.entries(node.attributes)) {
          attrsArray.push(`${key}: ${value}`);
        }
      }
      const uniqueId = `${node.name}_${node.id}`;
      return {
        id: uniqueId,
        label: node.name,
        isSubclass: subClassOfSet.has(node.id),
        isEnum: instanceOfSet.has(node.id),
        x: Math.cos(angleStep * idx) * 500,
        y: Math.sin(angleStep * idx) * 500,
        attrs: attrsArray,
        renderLines: []
      };
    });

    // 2. Словарь для преобразования числового id в уникальный
    const nodeIdToUniqueId = new Map();
    ontologyData.nodes.forEach(node => {
      nodeIdToUniqueId.set(node.id, `${node.name}_${node.id}`);
    });

    // 3. Рёбра с уникальными from/to
    this.edges = [];
    ontologyData.relations.forEach(rel => {
      const fromUnique = nodeIdToUniqueId.get(rel.source_node_id);
      const toUnique = nodeIdToUniqueId.get(rel.destination_node_id);
      if (!fromUnique || !toUnique) return;
      let label = rel.name;
      if (label === "subClassOf" || label === "") label = "⊑";
      this.edges.push({
        from: fromUnique,
        to: toUnique,
        label: label,
        isInstanceOf: rel.name === "instanceOf"
      });
    });

    this.calculateNodeSizes();
    this.applyForceLayout(150);
    this.resolveOverlaps();
    this.fitToView();
    this.render();
  }

  calculateNodeSizes() {
    this.nodes.forEach(node => {
      const ctx = this.ctx;
      ctx.font = 'bold 14px Segoe UI';
      const labelWidth = ctx.measureText(node.label).width;
      let maxWidth = Math.max(labelWidth + 24, 160);
      ctx.font = '12px Segoe UI';
      const attrLines = [];
      let maxAttrLines = 0;
      if (node.attrs && node.attrs.length > 0) {
        for (let attr of node.attrs) {
          let clean = attr.replace(/ \[.*?\]$/, '').replace(/: /g, ': ').replace(/"/g, '″');
          const words = clean.split(' ');
          let line = '• ';
          for (let word of words) {
            const testLine = line + (line === '• ' ? '' : ' ') + word;
            const width = ctx.measureText(testLine).width + 12;
            if (width > 380) {
              attrLines.push(line);
              line = '  ' + word;
            } else {
              line = testLine;
            }
          }
          attrLines.push(line);
        }
        maxAttrLines = Math.min(attrLines.length, 8);
        for (let line of attrLines.slice(0, maxAttrLines)) {
          const w = ctx.measureText(line).width + 24;
          if (w > maxWidth) maxWidth = Math.min(500, w);
        }
      }
      node.width = maxWidth;
      node.height = 50 + maxAttrLines * 18;
      if (node.isEnum) {
        node.width = Math.max(node.width, 150);
        node.height = Math.max(node.height, 50);
      }
      node.renderLines = attrLines.slice(0, maxAttrLines);
    });
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(this.scale, this.scale);
    ctx.translate(this.offset.x, this.offset.y);

    this.edges.forEach(edge => {
      const from = this.nodes.find(n => n.id === edge.from);
      const to = this.nodes.find(n => n.id === edge.to);
      if (!from || !to) return;
      const start = this.getEdgePoint(from, to);
      const end = this.getEdgePoint(to, from);
      if (!start || !end) return;
      const points = this.computePolyline(start, end, from, to);
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = edge.label === '⊑' ? '#7b1fa2' : (edge.isInstanceOf ? '#9c27b0' : '#546e7a');
      ctx.lineWidth = 2;
      ctx.stroke();
      const last = points[points.length - 2];
      const tip = points[points.length - 1];
      const angle = Math.atan2(tip.y - last.y, tip.x - last.x);
      const headlen = 10;
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tip.x - headlen * Math.cos(angle - Math.PI/6), tip.y - headlen * Math.sin(angle - Math.PI/6));
      ctx.lineTo(tip.x - headlen * Math.cos(angle + Math.PI/6), tip.y - headlen * Math.sin(angle + Math.PI/6));
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
      if (points.length >= 3) {
        const midIdx = Math.floor(points.length / 2);
        const mid = points[midIdx];
        const text = edge.label;
        ctx.font = '13px Segoe UI';
        const textWidth = ctx.measureText(text).width;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(mid.x - textWidth/2 - 4, mid.y - 12, textWidth + 8, 18);
        ctx.strokeStyle = '#e0e0e0';
        ctx.strokeRect(mid.x - textWidth/2 - 4, mid.y - 12, textWidth + 8, 18);
        ctx.fillStyle = '#212121';
        ctx.textAlign = 'center';
        ctx.fillText(text, mid.x, mid.y);
      }
    });

    this.nodes.forEach(node => {
      const fill = node.isEnum ? '#f3e5f5' : (node.isSubclass ? '#c8e6c9' : '#e3f2fd');
      const stroke = node.isEnum ? '#7b1fa2' : (node.isSubclass ? '#388e3c' : '#1976d2');
      const textColor = node.isEnum ? '#4a148c' : (node.isSubclass ? '#1b5e20' : '#0d47a1');
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.fillRect(node.x - node.width/2, node.y - node.height/2, node.width, node.height);
      ctx.strokeRect(node.x - node.width/2, node.y - node.height/2, node.width, node.height);
      ctx.font = 'bold 14px Segoe UI';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y - node.height/2 + 20);
      if (node.renderLines && node.renderLines.length) {
        ctx.font = '12px Segoe UI';
        ctx.fillStyle = '#424242';
        ctx.textAlign = 'left';
        const startY = node.y - node.height / 2 + 38;
        for (let i = 0; i < node.renderLines.length; i++) {
          ctx.fillText(node.renderLines[i], node.x - node.width / 2 + 12, startY + i * 18);
        }
      }
    });
    ctx.restore();
  }

  getEdgePoint(fromNode, toNode) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    const halfWidth = fromNode.width / 2;
    const halfHeight = fromNode.height / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tx = halfWidth / Math.abs(cos || 0.001);
    const ty = halfHeight / Math.abs(sin || 0.001);
    const t = Math.min(tx, ty);
    const x = fromNode.x + t * cos;
    const y = fromNode.y + t * sin;
    return { x, y };
  }

  computePolyline(start, end, fromNode, toNode) {
    const straightOk = !this.lineIntersectsOtherNodes(start, end, fromNode, toNode);
    if (straightOk) return [start, end];
    const midY = (start.y + end.y) / 2;
    const offset = 50;
    const candidates = [
      [{ x: start.x, y: start.y }, { x: start.x, y: midY - offset }, { x: end.x, y: midY - offset }, { x: end.x, y: end.y }],
      [{ x: start.x, y: start.y }, { x: start.x, y: midY + offset }, { x: end.x, y: midY + offset }, { x: end.x, y: end.y }],
      [{ x: start.x, y: start.y }, { x: (start.x + end.x)/2, y: start.y - offset }, { x: (start.x + end.x)/2, y: end.y - offset }, { x: end.x, y: end.y }],
      [{ x: start.x, y: start.y }, { x: (start.x + end.x)/2, y: start.y + offset }, { x: (start.x + end.x)/2, y: end.y + offset }, { x: end.x, y: end.y }]
    ];
    for (let poly of candidates) {
      let intersects = false;
      for (let i = 0; i < poly.length - 1; i++) {
        if (this.segmentIntersectsAnyNode(poly[i], poly[i+1], fromNode, toNode)) {
          intersects = true;
          break;
        }
      }
      if (!intersects) return poly;
    }
    return [start, end];
  }

  lineIntersectsOtherNodes(p1, p2, fromNode, toNode) {
    for (let node of this.nodes) {
      if (node === fromNode || node === toNode) continue;
      const left = node.x - node.width/2;
      const right = node.x + node.width/2;
      const top = node.y - node.height/2;
      const bottom = node.y + node.height/2;
      if (this.segmentIntersectsRect(p1, p2, left, right, top, bottom)) return true;
    }
    return false;
  }

  segmentIntersectsRect(p1, p2, left, right, top, bottom) {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    if (maxX < left || minX > right || maxY < top || minY > bottom) return false;
    const cx = (left + right)/2;
    const cy = (top + bottom)/2;
    const d = (p2.x - p1.x)*(cy - p1.y) - (p2.y - p1.y)*(cx - p1.x);
    if (Math.abs(d) > 10) return false;
    const dot = (cx - p1.x)*(p2.x - p1.x) + (cy - p1.y)*(p2.y - p1.y);
    if (dot < 0 || dot > (p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y)) return false;
    return true;
  }

  segmentIntersectsAnyNode(p1, p2, fromNode, toNode) {
    return this.lineIntersectsOtherNodes(p1, p2, fromNode, toNode);
  }

  toBlob() {
    return new Promise(resolve => {
      this.canvas.toBlob(blob => resolve(blob), 'image/png', 0.95);
    });
  }
}



