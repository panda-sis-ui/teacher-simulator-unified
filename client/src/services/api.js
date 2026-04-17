// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Установка токена
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Удаление токена
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }

  // Получение заголовков с токеном
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // === АВТОРИЗАЦИЯ ===

  // Регистрация
  async register(login, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      // Сохраняем данные пользователя
      this.setToken(data.token);
      localStorage.setItem('user', JSON.stringify({
        login: data.login,
        role: data.role
      }));
      localStorage.setItem('role', data.role);

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Вход
  async login(login, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Неверный логин или пароль');
      }

      // Сохраняем данные пользователя
      this.setToken(data.token);
      localStorage.setItem('user', JSON.stringify({
        login: data.login,
        role: data.role
      }));
      localStorage.setItem('role', data.role);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Выход
  logout() {
    this.clearToken();
  }

  // Проверка аутентификации
  isAuthenticated() {
    return !!this.token;
  }

  // Получение текущего пользователя
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // === СИТУАЦИИ ===

  // Получение списка всех ситуаций
  async getSituations() {
    try {
      const response = await fetch(`${API_BASE_URL}/situations`, {
        headers: this.getHeaders(),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get situations error:', error);
      throw error;
    }
  }

  // Получение деталей конкретной ситуации
  async getSituationDetails(situationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/situations/${situationId}`, {
        headers: this.getHeaders(),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }
      if (response.status === 404) {
        const data = await response.json();
        throw new Error(data.error || 'Ситуация не найдена');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get situation details error:', error);
      throw error;
    }
  }

  // === ПРОХОЖДЕНИЕ СИТУАЦИИ ===

  // Начало прохождения ситуации
  async startSituation(situationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/play/situations/${situationId}/start`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }
      if (response.status === 404) {
        const data = await response.json();
        throw new Error(data.error || 'Ситуация не найдена');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Start situation error:', error);
      throw error;
    }
  }

  // Совершение выбора
  async makeChoice(situationId, choiceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/play/situations/${situationId}/choose`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ choiceId }),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }
      if (response.status === 404) {
        const data = await response.json();
        throw new Error(data.error || 'Вариант выбора не найден');
      }
      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.error || 'Сначала начните прохождение');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Make choice error:', error);
      throw error;
    }
  }

  // Получение результата
  async getResult(situationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/play/situations/${situationId}/result`, {
        headers: this.getHeaders(),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }
      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.error || 'Сессия прохождения не найдена');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get result error:', error);
      throw error;
    }
  }

  // Получение истории прохождений
  async getHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/play/history`, {
        headers: this.getHeaders(),
      });

      if (response.status === 403) {
        throw new Error('Требуется авторизация');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  }
}

// Экспорт singleton-инстанса
export default new ApiService();