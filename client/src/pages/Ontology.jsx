import React, { useEffect, useRef, useState } from 'react';
import './Ontology.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Button from '../components/Button/Button';
import { OntologyGraph } from '../utils/ontologyGraph';

const Ontology = () => {
  const canvasRef = useRef(null);
  const [graph, setGraph] = useState(null);
  const [scale, setScale] = useState(100);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isLegendExpanded, setIsLegendExpanded] = useState(true);

  // Инициализация графа
  useEffect(() => {
    if (canvasRef.current && !graph) {
      const ontologyGraph = new OntologyGraph(canvasRef.current);

      // Настраиваем колбек для подсказок
      ontologyGraph.onHoverChange = (node) => {
        setHoveredNode(node);
      };

      setGraph(ontologyGraph);
      ontologyGraph.load();
    }
  }, [graph]);

  // Обработчики управления
  const handleResetView = () => {
    if (graph) {
      graph.offset = { x: 0, y: 0 };
      graph.scale = 1;
      setScale(100);
      graph.render();
    }
  };

  const handleFitToScreen = () => {
    if (graph) {
      graph.fitToView();
      setScale(Math.round(graph.scale * 100));
      graph.render();
    }
  };

  const handleZoomIn = () => {
    if (graph) {
      graph.scale = Math.min(graph.scale * 1.2, 3);
      setScale(Math.round(graph.scale * 100));
      graph.render();
    }
  };

  const handleZoomOut = () => {
    if (graph) {
      graph.scale = Math.max(graph.scale * 0.8, 0.2);
      setScale(Math.round(graph.scale * 100));
      graph.render();
    }
  };

  const handleDownload = async () => {
    if (graph) {
      try {
        const blob = await graph.toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `онтология_ped_sim_Гофман_Е_С.png`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        alert('❌ Не удалось сохранить изображение');
        console.error(e);
      }
    }
  };

  return (
    <div className="ontology-page">
      <Header />

      <section className="ontology-header">
        <div className="container">
          <h1>Онтологическая модель педагогических ситуаций</h1>
          <p>
            Структура знаний, лежащая в основе симулятора: классы, связи и атрибуты,
            систематизирующие сложные педагогические явления для повышения качества принятия решений
          </p>
        </div>
      </section>

      <section className="container ontology-content">
        <div className="card">
          <h2 className="section-title">Об онтологии</h2>
          <p className="section-subtitle">
            Онтология — формальная спецификация совместно используемых концептуальных моделей предметной области.
            В приложении она служит основой для структурирования педагогических ситуаций и обеспечивает семантическую точность при моделировании решений.
          </p>

          <div className="example-note">
            <strong>ℹ️ Примечание:</strong> Это <strong>динамическая визуализация</strong> онтологической модели.
            Схема содержит: классы (ситуации, участники, решения), иерархию наследования (<code>⊑</code>),
            семантические связи и атрибуты.
          </div>

          {/* Легенда */}
          <div className="section legend-section">
            <h3 className="section-title">
              <i className="fas fa-map-signs"></i> Легенда схемы
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                className="toggle-legend-btn"
              >
                <i className={`fas fa-chevron-${isLegendExpanded ? 'down' : 'right'}`}></i>
                {isLegendExpanded ? ' Свернуть' : ' Развернуть'}
              </Button>
            </h3>

            {isLegendExpanded && (
              <div className="legend-grid">
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#e3f2fd', borderColor: '#1976d2'}}></div>
                  <div className="legend-text">
                    <strong>Синие прямоугольники</strong> — корневые/абстрактные классы
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#c8e6c9', borderColor: '#388e3c'}}></div>
                  <div className="legend-text">
                    <strong>Зелёные прямоугольники</strong> — подклассы (наследование)
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: '#f3e5f5', borderColor: '#7b1fa2'}}></div>
                  <div className="legend-text">
                    <strong>Фиолетовые прямоугольники</strong> — перечисления (enums)
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-symbol">⊑</div>
                  <div className="legend-text">
                    <strong>Фиолетовые стрелки "⊑"</strong> — отношение наследования
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-symbol">➡️</div>
                  <div className="legend-text">
                    <strong>Серые стрелки</strong> — семантические связи
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-symbol">📝</div>
                  <div className="legend-text">
                    <strong>Внутри прямоугольников</strong> — атрибуты с типами
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Контейнер для схемы */}
          <div className="diagram-container" id="diagramContainer">
            <canvas
              ref={canvasRef}
              id="ontologyCanvas"
              width="1200"
              height="700"
            />
            <div className="diagram-controls">
              <div className="scale-indicator">Масштаб: {scale}%</div>
              <div className="diagram-hint">
                <i className="fas fa-arrows-alt"></i> Перетаскивайте мышью |
                <i className="fas fa-search-plus"></i> Колёсико — масштаб
              </div>
            </div>
          </div>

          {/* Панель инструментов */}
          <div className="toolbar">
            <Button variant="primary" onClick={handleDownload}>
              <i className="fas fa-download"></i> Скачать PNG
            </Button>
            <Button variant="outline" onClick={handleResetView}>
              <i className="fas fa-sync-alt"></i> Сбросить вид
            </Button>
            <Button variant="outline" onClick={handleFitToScreen}>
              <i className="fas fa-expand-alt"></i> Вместить в экран
            </Button>
            <Button variant="outline" onClick={handleZoomIn}>
              <i className="fas fa-search-plus"></i> Приблизить
            </Button>
            <Button variant="outline" onClick={handleZoomOut}>
              <i className="fas fa-search-minus"></i> Отдалить
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Ontology;
