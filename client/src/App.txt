import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Импорт страниц
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Ontology from './pages/Ontology';
import Converter from './pages/Converter';
import Generator from './pages/Generator';
import Situation from './pages/Situation';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Основные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/ontology" element={<Ontology />} />
        <Route path="/converter" element={<Converter />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Маршруты для ситуаций - ОЧЕНЬ ВАЖНО: правильный порядок! */}
        <Route path="/situation/:sitId/:nodeId" element={<Situation />} />
        <Route path="/situation/:sitId" element={<Situation />} />

        {/* Удаляем дубликаты */}
        {/* <Route path="/situation/:id" element={<Situation />} /> ← УДАЛИТЬ! */}

        {/* Статические страницы */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Страница 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

// Временные компоненты для статических страниц
function TermsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Условия использования</h1>
      <p>Содержимое страницы условий использования...</p>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Политика конфиденциальности</h1>
      <p>Содержимое политики конфиденциальности...</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>404 - Страница не найдена</h1>
      <p>Запрашиваемая страница не существует.</p>
      <a href="/" style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        background: '#2c6e49',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px'
      }}>
        Вернуться на главную
      </a>
    </div>
  );
}

export default App;
