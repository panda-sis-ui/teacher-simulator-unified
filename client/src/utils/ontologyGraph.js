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
    if (this.nodes.length > 0) {
      this.fitToView();
    }
    this.render();
  }

  fitToView() {
    if (this.nodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    this.nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.width / 2);
      maxX = Math.max(maxX, node.x + node.width / 2);
      minY = Math.min(minY, node.y - node.height / 2);
      maxY = Math.max(maxY, node.y + node.height / 2);
    });

    const w = this.canvas.width;
    const h = this.canvas.height;
    const padding = 80;

    const scaleX = (w - padding) / (maxX - minX);
    const scaleY = (h - padding) / (maxY - minY);
    this.scale = Math.min(scaleX, scaleY, 1.0);

    this.offset.x = -(minX + maxX) / 2;
    this.offset.y = -(minY + maxY) / 2;
  }

  load() {
    // === ТОЧНО ТАКИЕ ЖЕ ДАННЫЕ КАК В ОРИГИНАЛЬНОМ HTML ===
    this.nodes = [
      // === Корневые классы ===
      { id: "ПедагогическаяСитуация", label: "ПедагогическаяСитуация", isSubclass: false, x: 0, y: -50,
        attrs: ["id: xsd:string", "title: xsd:string", "contextRef: xsd:string", "participantsRef: xsd:string[]", "problemRef: xsd:string", "initialNode: xsd:string"] },

      { id: "КонтекстСитуации", label: "КонтекстСитуации", isSubclass: false, x: 0, y: -300,
        attrs: ["subject: Предмет", "grade: УчебныйКласс", "lessonPhase: ЭтапУрока", "format: ФорматОбучения", "duration: xsd:string", "techEquipment: ТехОснащённость"] },

      { id: "Участник", label: "Участник", isSubclass: false, x: 500, y: 0,
        attrs: ["id: xsd:string", "type: УчастникТип", "name: xsd:string?"] },

      { id: "Проблема", label: "Проблема", isSubclass: false, x: -400, y: -200,
        attrs: ["type: ТипПроблемы", "source: ИсточникПроблемы", "intensity: ОстротаПроблемы", "emotions: Эмоция[]", "tensionFactor: xsd:number"] },

      { id: "УзелСценария", label: "УзелСценария", isSubclass: false, x: -550, y: 200,
        attrs: ["description: xsd:string", "image: xsd:anyURI?", "choices: Выбор[] | undefined", "outcomeRef: xsd:string | undefined"] },

      { id: "Выбор", label: "Выбор", isSubclass: false, x: -700, y: 500,
        attrs: ["id: xsd:string", "description: xsd:string", "solutionRef: xsd:string", "next: xsd:string | null"] },

      // === Участники ===
      { id: "Учитель", label: "Учитель", isSubclass: true, x: 800, y: -200,
        attrs: [
          "id: xsd:string",
          "type: \"Учитель\"",
          "name: xsd:string",
          "experience: xsd:integer",
          "ei: УровеньЭмоциональногоИнтеллекта",
          "style: СтильПедагогики",
          "role: ПрофессиональнаяРоль",
          "age: xsd:integer?"
        ] },

      { id: "Ученик", label: "Ученик", isSubclass: true, x: 1000, y: 400,
        attrs: [
          "id: xsd:string",
          "type: \"Ученик\"",
          "name: xsd:string",
          "age: xsd:integer",
          "motivation: xsd:number",
          "preparation: УровеньПодготовки",
          "style: СтильОбучения",
          "socialStatus: СоциальныйСтатус",
          "homeTech: ТехОснащённость"
        ] },

      // === Решения и педагогика ===
      { id: "Решение", label: "Решение", isSubclass: false, x: -900, y: 50,
        attrs: ["type: ТипРешения", "method: МетодОбучения", "strategy: СтратегияРеагирования", "risk: xsd:integer", "autonomy: xsd:integer", "resources: ТипРесурса[]", "strengthens: Фактор[]", "weakens: Фактор[]", "principles: ПедагогическийПринцип[]", "duration: xsd:string", "frequency: xsd:string?"] },

      { id: "ТактическоеРешение", label: "ТактическоеРешение", isSubclass: true, x: -1300, y: 50, attrs: [] },
      { id: "СтратегическоеРешение", label: "СтратегическоеРешение", isSubclass: true, x: -1300, y: 120, attrs: [] },
      { id: "МетодОбучения", label: "МетодОбучения", isSubclass: false, x: -1300, y: 550, attrs: [] },

      // === Последствия и метрики ===
      { id: "Последствие", label: "Последствие", isSubclass: false, x: 0, y: 300,
        attrs: ["type: xsd:string", "text: xsd:string?", "longTerm: xsd:boolean", "reversible: xsd:boolean", "intensity: xsd:integer", "metrics: МетрикиИзменения"] },

      { id: "ПоследствиеДляУченика", label: "ПоследствиеДляУченика", isSubclass: true, x: 250, y: 300, attrs: [] },
      { id: "ПоследствиеДляУчителя", label: "ПоследствиеДляУчителя", isSubclass: true, x: -250, y: 350, attrs: [] },
      { id: "ФакторИзменения", label: "ФакторИзменения", isSubclass: false, x: 250, y: 450, attrs: [] },

      // === Перечисления (enums) ===
      { id: "Предмет", label: "Предмет", isEnum: true, x: -130, y: -550, attrs: [] },
      { id: "УчебныйКласс", label: "УчебныйКласс", isEnum: true, x: -50, y: -650, attrs: [] },
      { id: "ЭтапУрока", label: "ЭтапУрока", isEnum: true, x: -300, y: -550, attrs: [] },
      { id: "ФорматОбучения", label: "ФорматОбучения", isEnum: true, x: 100, y: -550, attrs: [] },
      { id: "ТехОснащённость", label: "ТехОснащённость", isEnum: true, x: 1500, y: -800, attrs: [] },
      { id: "УчастникТип", label: "УчастникТип", isEnum: true, x: 350, y: 600, attrs: [] },
      { id: "УровеньЭмоциональногоИнтеллекта", label: "УровеньЭИ", isEnum: true, x: 900, y: -500, attrs: [] },
      { id: "СтильПедагогики", label: "СтильПедагогики", isEnum: true, x: 1200, y: -300, attrs: [] },
      { id: "СтильОбучения", label: "СтильОбучения", isEnum: true, x: 1000, y: 700, attrs: [] },
      { id: "УровеньПодготовки", label: "УровеньПодготовки", isEnum: true, x: 800, y: 800, attrs: [] },
      { id: "СоциальныйСтатус", label: "СоциальныйСтатус", isEnum: true, x: 1300, y: 650, attrs: [] },
      { id: "ПрофессиональнаяРоль", label: "ПрофессиональнаяРоль", isEnum: true, x: 1100, y: -450, attrs: [] },
      { id: "ТипПроблемы", label: "ТипПроблемы", isEnum: true, x: -250, y: -350, attrs: [] },
      { id: "ИсточникПроблемы", label: "ИсточникПроблемы", isEnum: true, x: -500, y: -550, attrs: [] },
      { id: "ОстротаПроблемы", label: "ОстротаПроблемы", isEnum: true, x: -600, y: -450, attrs: [] },
      { id: "Эмоция", label: "Эмоция", isEnum: true, x: -700, y: -150, attrs: [] },
      { id: "ТипРешения", label: "ТипРешения", isEnum: true, x: -1300, y: 300, attrs: [] },
      { id: "СтратегияРеагирования", label: "СтратегияРеагирования", isEnum: true, x: -1000, y: -500, attrs: [] },
      { id: "ТипРесурса", label: "ТипРесурса", isEnum: true, x: -1300, y: -25, attrs: [] },
      { id: "Фактор", label: "Фактор", isEnum: true, x: -1300, y: -200, attrs: [] },
      { id: "ПедагогическийПринцип", label: "ПедагогическийПринцип", isEnum: true, x: -1300, y: -100, attrs: [] },
      { id: "ТипИсхода", label: "ТипИсхода", isEnum: true, x: -300, y: 550, attrs: [] },

      // === Вспомогательные ===
      { id: "МетрикиИзменения", label: "МетрикиИзменения", isSubclass: false, x: 0, y: 550,
        attrs: ["motivationChange: ФакторИзменения", "stressChange: ФакторИзменения", "trustChange: ФакторИзменения", "classClimateChange: ФакторИзменения", "teacherAuthorityChange: ФакторИзменения", "burnoutChange: ФакторИзменения"] }
    ];

    this.edges = [
      { from: "Учитель", to: "Участник", label: "⊑" },
      { from: "Ученик", to: "Участник", label: "⊑" },
      { from: "ТактическоеРешение", to: "Решение", label: "⊑" },
      { from: "СтратегическоеРешение", to: "Решение", label: "⊑" },
      { from: "ПоследствиеДляУченика", to: "Последствие", label: "⊑" },
      { from: "ПоследствиеДляУчителя", to: "Последствие", label: "⊑" },
      { from: "ПедагогическаяСитуация", to: "КонтекстСитуации", label: "имеетКонтекст" },
      { from: "ПедагогическаяСитуация", to: "Участник", label: "включаетУчастника" },
      { from: "ПедагогическаяСитуация", to: "Проблема", label: "имеетПроблему" },
      { from: "ПедагогическаяСитуация", to: "Решение", label: "предлагаетРешение" },
      { from: "КонтекстСитуации", to: "Предмет", label: "предметОбучения" },
      { from: "КонтекстСитуации", to: "УчебныйКласс", label: "классУчебнойГруппы" },
      { from: "КонтекстСитуации", to: "ФорматОбучения", label: "форматОбучения" },
      { from: "КонтекстСитуации", to: "ЭтапУрока", label: "этапУрока" },
      { from: "КонтекстСитуации", to: "ТехОснащённость", label: "техОснащённостьКласса" },
      { from: "Учитель", to: "СтильПедагогики", label: "педагогическийСтиль" },
      { from: "Учитель", to: "УровеньЭмоциональногоИнтеллекта", label: "уровеньЭИ" },
      { from: "Учитель", to: "ПрофессиональнаяРоль", label: "профессиональнаяРоль" },
      { from: "Ученик", to: "УровеньПодготовки", label: "уровеньПодготовки" },
      { from: "Ученик", to: "СтильОбучения", label: "стильОбучения" },
      { from: "Ученик", to: "СоциальныйСтатус", label: "социальныйСтатус" },
      { from: "Ученик", to: "ТехОснащённость", label: "техОснащённостьДома" },
      { from: "Проблема", to: "ОстротаПроблемы", label: "острота" },
      { from: "Проблема", to: "ТипПроблемы", label: "тип" },
      { from: "Проблема", to: "ИсточникПроблемы", label: "источник" },
      { from: "Проблема", to: "Эмоция", label: "вызываетЭмоцию" },
      { from: "Решение", to: "Фактор", label: "усиливает" },
      { from: "Решение", to: "Фактор", label: "ослабляет" },
      { from: "Решение", to: "СтратегияРеагирования", label: "имеетСтратегию" },
      { from: "Решение", to: "ТипРешения", label: "имеетТип" },
      { from: "Решение", to: "МетодОбучения", label: "основаноНаМетоде" },
      { from: "Решение", to: "ПедагогическийПринцип", label: "соответствуетПринципу" },
      { from: "Решение", to: "ТипРесурса", label: "требуетРесурсТип" },
      { from: "Последствие", to: "МетрикиИзменения", label: "включаетМетрики" },
      { from: "Последствие", to: "ТипИсхода", label: "имеетТип" },

      { from: "Участник", to: "УчастникТип", label: "имеетТип" },

      { from: "ПедагогическаяСитуация", to: "УзелСценария", label: "начинаетсяС" },
      { from: "УзелСценария", to: "Выбор", label: "включаетВыбор" },
      { from: "УзелСценария", to: "Последствие", label: "завершаетсяИсходом" },
      { from: "Выбор", to: "Решение", label: "ссылаетсяНаРешение" },
    ];

    this.calculateNodeSizes();
    this.fitToView();
    this.render();
  }

  calculateNodeSizes() {
    this.nodes.forEach(node => {
      const ctx = this.ctx;

      // Ширина заголовка
      ctx.font = 'bold 14px Segoe UI';
      const labelWidth = ctx.measureText(node.label).width;
      let maxWidth = Math.max(labelWidth + 24, 160);

      // Ширина атрибутов
      ctx.font = '12px Segoe UI';
      const attrLines = [];
      let maxAttrLines = 0;

      if (node.attrs && node.attrs.length > 0) {
        for (let attr of node.attrs) {
          let clean = attr
            .replace(/ \[.*?\]$/, '')
            .replace(/: /g, ': ')
            .replace(/"/g, '″');

          const words = clean.split(' ');
          let line = '• ';
          let width;

          for (let word of words) {
            const testLine = line + (line === '• ' ? '' : ' ') + word;
            width = ctx.measureText(testLine).width + 12;
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

    // Отрисовка стрелок
    this.edges.forEach(edge => {
      const from = this.nodes.find(n => n.id === edge.from);
      const to = this.nodes.find(n => n.id === edge.to);
      if (!from || !to) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 1) return;

      const nx = dx / dist;
      const ny = dy / dist;
      const offsetX = -ny * 20;
      const offsetY = nx * 20;

      ctx.beginPath();
      ctx.moveTo(from.x + offsetX, from.y + offsetY);
      ctx.lineTo(to.x + offsetX, to.y + offsetY);
      ctx.strokeStyle = edge.label === '⊑' ? '#7b1fa2' : '#546e7a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const headlen = 8;
      const angle = Math.atan2(ny, nx);
      ctx.beginPath();
      ctx.moveTo(to.x + offsetX, to.y + offsetY);
      ctx.lineTo(to.x + offsetX - headlen * Math.cos(angle - Math.PI/6), to.y + offsetY - headlen * Math.sin(angle - Math.PI/6));
      ctx.lineTo(to.x + offsetX, to.y + offsetY);
      ctx.lineTo(to.x + offsetX - headlen * Math.cos(angle + Math.PI/6), to.y + offsetY - headlen * Math.sin(angle + Math.PI/6));
      ctx.stroke();

      ctx.font = '13px Segoe UI';
      const text = edge.label;
      const textWidth = ctx.measureText(text).width;
      const midX = (from.x + to.x)/2 + offsetX;
      const midY = (from.y + to.y)/2 + offsetY - 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(midX - textWidth/2 - 4, midY - 12, textWidth + 8, 18);
      ctx.strokeStyle = '#e0e0e0';
      ctx.strokeRect(midX - textWidth/2 - 4, midY - 12, textWidth + 8, 18);
      ctx.fillStyle = '#212121';
      ctx.textAlign = 'center';
      ctx.fillText(text, midX, midY);
    });

    // Отрисовка узлов
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

      // Атрибуты
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

  toBlob() {
    return new Promise(resolve => {
      this.canvas.toBlob(blob => resolve(blob), 'image/png', 0.95);
    });
  }
}
