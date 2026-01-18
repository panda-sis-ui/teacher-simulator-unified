import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import situationsData from '../data/situations';
import libraryData from '../data/library';

export const useSituation = () => {
  const { sitId, nodeId } = useParams();
  const navigate = useNavigate();
  const [situation, setSituation] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Добавлено: Логирование при инициализации хука
  console.log('=== useSituation HOOK STARTED ===');
  console.log('sitId from URL:', sitId);
  console.log('nodeId from URL:', nodeId);
  console.log('typeof sitId:', typeof sitId);
  console.log('sitId length:', sitId?.length);

  // Функция для поиска ситуации по разным критериям
  const findSituation = (id) => {
    if (!id) {
      console.log('findSituation: id is null or undefined');
      console.log('id value:', id);
      return null;
    }

    console.log(`=== findSituation START ===`);
    console.log(`findSituation: searching for "${id}"`);
    console.log('id type:', typeof id);
    console.log('id trimmed:', `"${id.trim()}"`);
    console.log('Available keys:', Object.keys(situationsData));

    // Проверяем каждую ситуацию
    console.log('=== Checking all situations ===');
    Object.entries(situationsData).forEach(([key, sit]) => {
      console.log(`Checking: key="${key}", sit.id="${sit.id}", title="${sit.title}"`);
      console.log(`  key === id? ${key === id}`);
      console.log(`  key === id.trim()? ${key === id.trim()}`);
      console.log(`  sit.id === id? ${sit.id === id}`);
      console.log(`  sit.id === id.trim()? ${sit.id === id.trim()}`);
    });

    // 1. Прямое совпадение (с триммингом)
    const trimmedId = id.trim();
    if (situationsData[trimmedId]) {
      console.log(`✓ Found by direct match: "${trimmedId}"`);
      return { key: trimmedId, data: situationsData[trimmedId] };
    }

    // 2. Ищем по внутреннему ID (с триммингом)
    for (const [key, sit] of Object.entries(situationsData)) {
      if (sit.id === trimmedId) {
        console.log(`✓ Found by internal id match: key="${key}", sit.id="${sit.id}"`);
        return { key, data: sit };
      }
    }

    // 3. Ищем по заголовку (частичное совпадение) - без учета регистра
    for (const [key, sit] of Object.entries(situationsData)) {
      if (sit.title?.toLowerCase().includes(trimmedId.toLowerCase())) {
        console.log(`✓ Found by title match: "${sit.title}" includes "${trimmedId}"`);
        return { key, data: sit };
      }
    }

    // 4. Ищем любые совпадения в ключе или ID
    for (const [key, sit] of Object.entries(situationsData)) {
      if (key.toLowerCase().includes(trimmedId.toLowerCase())) {
        console.log(`✓ Found by key partial match: key "${key}" includes "${trimmedId}"`);
        return { key, data: sit };
      }
    }

    // 5. Берем первую доступную ситуацию (только для отладки)
    const firstKey = Object.keys(situationsData)[0];
    if (firstKey && trimmedId === 'debug') {
      console.log('⚠️ Using first available situation for debugging');
      return { key: firstKey, data: situationsData[firstKey] };
    }

    console.log(`✗ No situation found for "${id}"`);
    console.log(`=== findSituation END ===`);
    return null;
  };

  useEffect(() => {
    const loadSituation = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('=== LOADING SITUATION START ===');
        console.log('URL parameters - sitId:', sitId);
        console.log('URL parameters - nodeId:', nodeId);
        console.log('sitId type:', typeof sitId);
        console.log('Available situations:', Object.keys(situationsData));

        // Детальный лог всех ситуаций
        if (Object.keys(situationsData).length === 0) {
          console.error('ERROR: situationsData is EMPTY!');
        } else {
          console.log('=== All available situations ===');
          Object.entries(situationsData).forEach(([key, sit], index) => {
            console.log(`${index + 1}. Key: "${key}"`);
            console.log(`   ID: "${sit.id}"`);
            console.log(`   Title: "${sit.title}"`);
            console.log(`   Initial node: "${sit.initialNode}"`);
          });
        }

        if (!sitId) {
          console.error('ERROR: sitId is not provided');
          console.error('Current URL:', window.location.href);
          setError('ID ситуации не указан. Пожалуйста, выберите ситуацию из каталога.');
          setLoading(false);
          return;
        }

        if (sitId === 'undefined' || sitId === 'null') {
          console.error(`ERROR: Invalid sitId value: "${sitId}"`);
          setError(`Некорректный ID ситуации: "${sitId}". Вернитесь в каталог и выберите ситуацию заново.`);
          setLoading(false);
          return;
        }

        // Ищем ситуацию
        const found = findSituation(sitId);

        if (!found) {
          console.error('ERROR: Situation not found for ID:', sitId);
          console.error('Searched ID:', sitId);
          console.error('Available IDs:', Object.keys(situationsData));

          // Предлагаем возможные варианты
          const suggestions = Object.keys(situationsData).filter(key =>
            key.toLowerCase().includes(sitId.toLowerCase()) ||
            situationsData[key].title.toLowerCase().includes(sitId.toLowerCase())
          );

          if (suggestions.length > 0) {
            console.log('Did you mean one of these?', suggestions);
            setError(`Ситуация "${sitId}" не найдена. Возможно, вы имели в виду: ${suggestions.map(s => `"${s}"`).join(', ')}`);
          } else {
            setError(`Ситуация "${sitId}" не найдена. Доступные ситуации: ${Object.keys(situationsData).join(', ')}`);
          }

          setLoading(false);
          return;
        }

        const { key, data } = found;
        console.log('✅ Found situation:', key);
        console.log('   Title:', data.title);
        console.log('   ID:', data.id);
        console.log('   Initial node:', data.initialNode);
        console.log('   Available nodes:', Object.keys(data.nodes || {}));

        setSituation(data);

        // Определяем текущий узел
        const initialNode = nodeId || data.initialNode;
        console.log('Selected node:', initialNode);

        const node = data.nodes[initialNode];

        if (!node) {
          console.error(`ERROR: Node "${initialNode}" not found in situation "${key}"`);
          console.error('Available nodes:', Object.keys(data.nodes));
          setError(`Узел "${initialNode}" не найден. Доступные узлы: ${Object.keys(data.nodes).join(', ')}`);
          setLoading(false);
          return;
        }

        console.log('✅ Loaded node:', initialNode);
        console.log('   Node description length:', node.description?.length || 0);
        console.log('   Has choices?', !!node.choices);
        console.log('   Has outcome?', !!node.outcomeRef);

        if (node.choices) {
          console.log('   Choices:', node.choices.map(c => `${c.id}: ${c.text || c.description}`));
        }

        setCurrentNode(node);
        setChoiceHistory([initialNode]);

        console.log('=== SITUATION LOADED SUCCESSFULLY ===');
      } catch (err) {
        console.error('ERROR loading situation:', err);
        console.error('Error stack:', err.stack);
        setError(`Ошибка загрузки: ${err.message}. Пожалуйста, попробуйте снова или выберите другую ситуацию.`);
      } finally {
        setLoading(false);
      }
    };

    loadSituation();
  }, [sitId, nodeId]);

  const getContext = useCallback(() => {
    if (!situation || !libraryData.contexts) {
      console.log('getContext: situation or contexts not available');
      return null;
    }

    const context = libraryData.contexts[situation.contextRef];
    console.log('getContext: ref=', situation.contextRef, 'found=', !!context);
    return context || null;
  }, [situation]);

  const getProblem = useCallback(() => {
    if (!situation || !libraryData.problems) {
      console.log('getProblem: situation or problems not available');
      return null;
    }

    const problem = libraryData.problems[situation.problemRef];
    console.log('getProblem: ref=', situation.problemRef, 'found=', !!problem);
    return problem || null;
  }, [situation]);

  const getParticipants = useCallback(() => {
    if (!situation || !libraryData.participants) {
      console.log('getParticipants: situation or participants not available');
      return [];
    }

    const participants = situation.participantsRef
      .map(ref => {
        const participant = libraryData.participants[ref];
        console.log('getParticipants: ref=', ref, 'found=', !!participant);
        return participant;
      })
      .filter(Boolean);

    console.log('getParticipants: total found=', participants.length);
    return participants;
  }, [situation]);

  const getOutcome = useCallback((outcomeRef) => {
    if (!libraryData.outcomes) {
      console.log('getOutcome: outcomes not available');
      return null;
    }

    const outcome = libraryData.outcomes[outcomeRef];
    console.log('getOutcome: ref=', outcomeRef, 'found=', !!outcome);
    return outcome || null;
  }, []);

  const getSolution = useCallback((solutionRef) => {
    if (!libraryData.solutions) {
      console.log('getSolution: solutions not available');
      return null;
    }

    const solution = libraryData.solutions[solutionRef];
    console.log('getSolution: ref=', solutionRef, 'found=', !!solution);
    return solution || null;
  }, []);

  const makeChoice = useCallback((choice) => {
    if (!choice || !situation) {
      console.error('makeChoice: choice or situation not available');
      return;
    }

    console.log('=== MAKING CHOICE ===');
    console.log('Choice ID:', choice.id);
    console.log('Choice text:', choice.text || choice.description);
    console.log('Next node:', choice.next);
    console.log('Available nodes:', Object.keys(situation.nodes));

    const nextNode = situation.nodes[choice.next];
    if (!nextNode) {
      console.error(`ERROR: Узел "${choice.next}" не найден`);
      console.error('Available nodes:', Object.keys(situation.nodes));
      return;
    }

    console.log('✅ Next node found');
    setCurrentNode(nextNode);
    setChoiceHistory(prev => [...prev, choice.next]);

    // Обновляем URL
    navigate(`/situation/${sitId}/${choice.next}`, { replace: false });
    console.log('Navigated to:', `/situation/${sitId}/${choice.next}`);
  }, [situation, sitId, navigate]);

  const restartSituation = useCallback(() => {
    if (!situation) {
      console.error('restartSituation: situation not available');
      return;
    }

    console.log('=== RESTARTING SITUATION ===');
    const initialNode = situation.initialNode;
    const node = situation.nodes[initialNode];

    if (node) {
      console.log('Restarting to initial node:', initialNode);
      setCurrentNode(node);
      setChoiceHistory([initialNode]);
      navigate(`/situation/${sitId}/${initialNode}`);
    } else {
      console.error('Cannot restart: initial node not found', initialNode);
    }
  }, [situation, sitId, navigate]);

  const goBack = useCallback(() => {
    if (choiceHistory.length <= 1) {
      console.log('goBack: cannot go back, history length <= 1');
      return;
    }

    console.log('=== GOING BACK ===');
    const newHistory = [...choiceHistory];
    newHistory.pop();
    const prevNodeId = newHistory[newHistory.length - 1];

    console.log('Previous history:', choiceHistory);
    console.log('New history:', newHistory);
    console.log('Previous node ID:', prevNodeId);

    const prevNode = situation.nodes[prevNodeId];
    if (prevNode) {
      console.log('✅ Previous node found');
      setCurrentNode(prevNode);
      setChoiceHistory(newHistory);
      navigate(`/situation/${sitId}/${prevNodeId}`);
    } else {
      console.error('Cannot go back: previous node not found', prevNodeId);
    }
  }, [choiceHistory, situation, sitId, navigate]);

  // Добавлено: Логирование состояния при возврате
  console.log('=== useSituation HOOK STATE ===');
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('situation:', situation ? situation.title : 'null');
  console.log('currentNode:', currentNode ? currentNode.id : 'null');
  console.log('choiceHistory:', choiceHistory);
  console.log('canGoBack:', choiceHistory.length > 1);
  console.log('sitId:', sitId);

  return {
    situation,
    currentNode,
    history: choiceHistory,
    loading,
    error,
    getContext,
    getProblem,
    getParticipants,
    getOutcome,
    getSolution,
    makeChoice,
    restartSituation,
    goBack,
    canGoBack: choiceHistory.length > 1,
    sitId
  };
};
