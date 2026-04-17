// Добавьте этот хук в начало файла или в отдельный файл hooks/useFirstRender.js
import { useEffect, useRef } from 'react';

export const useFirstEffect = (callback, dependencies) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Не выполняем при первом рендере
    }
    return callback();
  }, dependencies);
};