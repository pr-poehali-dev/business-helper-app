import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const AI_AGENT_URL = 'https://functions.poehali.dev/c42f2362-0697-4b7f-acd6-202c45772cba';
const NEWS_SCRAPER_URL = 'https://functions.poehali.dev/80bcda15-af32-4342-a690-bc57930219a7';

interface AgentStats {
  drafts: number;
  ready: number;
  published: number;
  total: number;
}

export default function AIAgentManagement() {
  const [stats, setStats] = useState<AgentStats>({ drafts: 0, ready: 0, published: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch(AI_AGENT_URL);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const runScraper = async () => {
    setLoading(true);
    addLog('🔍 Запуск парсера новостей...');
    
    try {
      const response = await fetch(NEWS_SCRAPER_URL, { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ Найдено ${result.scraped} новостей, сохранено ${result.saved}`);
      } else {
        addLog(`❌ Ошибка парсинга: ${result.error}`);
      }
      
      await loadStats();
    } catch (error) {
      addLog(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const processNews = async () => {
    setLoading(true);
    addLog('🤖 Обработка черновиков через ИИ...');
    
    try {
      const response = await fetch(AI_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'process' })
      });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ Обработано ${result.processed} из ${result.total_drafts} черновиков`);
      } else {
        addLog(`❌ Ошибка обработки: ${result.error}`);
      }
      
      await loadStats();
    } catch (error) {
      addLog(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const publishNews = async () => {
    setLoading(true);
    addLog('📢 Публикация готовых новостей в Telegram...');
    
    try {
      const response = await fetch(AI_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' })
      });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ Опубликовано ${result.published} из ${result.total_ready} новостей`);
      } else {
        addLog(`❌ Ошибка публикации: ${result.error}`);
      }
      
      await loadStats();
    } catch (error) {
      addLog(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const runAutoPipeline = async () => {
    setLoading(true);
    addLog('⚡ Запуск полного автоматического цикла...');
    
    try {
      const response = await fetch(AI_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto' })
      });
      const result = await response.json();
      
      if (result.success) {
        const { pipeline } = result;
        if (pipeline.scrape?.success) {
          addLog(`✅ Парсинг: ${pipeline.scrape.scraped} новостей`);
        }
        if (pipeline.process?.success) {
          addLog(`✅ Обработка: ${pipeline.process.processed} статей`);
        }
        if (pipeline.publish?.success) {
          addLog(`✅ Публикация: ${pipeline.publish.published} постов`);
        }
      } else {
        addLog(`❌ Ошибка автоцикла`);
      }
      
      await loadStats();
    } catch (error) {
      addLog(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Icon name="Bot" size={24} />
            ИИ-Агент для Новостей
          </h2>
          <button
            onClick={loadStats}
            disabled={loading}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <Icon name="RefreshCw" size={16} className="inline mr-2" />
            Обновить
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.drafts}</div>
            <div className="text-sm text-gray-600">Черновики</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            <div className="text-sm text-gray-600">Готовые</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.published}</div>
            <div className="text-sm text-gray-600">Опубликовано</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Всего</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={runScraper}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Icon name="Globe" size={18} className="inline mr-2" />
              1. Собрать новости с сайта
            </button>
            <button
              onClick={processNews}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Icon name="Sparkles" size={18} className="inline mr-2" />
              2. Обработать через ИИ
            </button>
            <button
              onClick={publishNews}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              <Icon name="Send" size={18} className="inline mr-2" />
              3. Опубликовать в Telegram
            </button>
          </div>

          <button
            onClick={runAutoPipeline}
            disabled={loading}
            className="w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 font-semibold text-lg shadow-lg"
          >
            <Icon name="Zap" size={20} className="inline mr-2" />
            ⚡ Запустить полный цикл (1+2+3)
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Логи работы агента</h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-400 hover:text-white"
          >
            Очистить
          </button>
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">Логи появятся после запуска агента...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-xs">{log}</div>
            ))
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Icon name="Info" size={18} />
          Как работает агент
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Шаг 1:</strong> Парсит продукты с сайта СберАналитики и сохраняет как черновики</li>
          <li>• <strong>Шаг 2:</strong> ИИ переписывает описания в интересные новости для Telegram</li>
          <li>• <strong>Шаг 3:</strong> Публикует готовые новости в канал @kupetzvplyuse</li>
          <li>• <strong>Автоцикл:</strong> Выполняет все 3 шага автоматически одной кнопкой</li>
        </ul>
      </div>
    </div>
  );
}
