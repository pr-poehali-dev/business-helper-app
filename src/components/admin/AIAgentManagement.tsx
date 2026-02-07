import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const AI_AGENT_URL = 'https://functions.poehali.dev/c42f2362-0697-4b7f-acd6-202c45772cba';
const NEWS_SCRAPER_URL = 'https://functions.poehali.dev/80bcda15-af32-4342-a690-bc57930219a7';
const SCHEDULER_URL = 'https://functions.poehali.dev/38107b77-1b0c-4bb7-b18b-f5164553c08b';

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
        addLog(`❌ Ошибка обработки: ${result.error || JSON.stringify(result)}`);
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
        addLog(`❌ Ошибка публикации: ${result.error || JSON.stringify(result)}`);
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
        } else if (pipeline.scrape?.error) {
          addLog(`❌ Парсинг: ${pipeline.scrape.error}`);
        }
        if (pipeline.process?.success) {
          addLog(`✅ Обработка: ${pipeline.process.processed} статей`);
        } else if (pipeline.process?.error) {
          addLog(`❌ Обработка: ${pipeline.process.error}`);
        }
        if (pipeline.publish?.success) {
          addLog(`✅ Публикация: ${pipeline.publish.published} постов`);
        } else if (pipeline.publish?.error) {
          addLog(`❌ Публикация: ${pipeline.publish.error}`);
        }
      } else {
        addLog(`❌ Ошибка автоцикла: ${result.error || JSON.stringify(result)}`);
      }
      
      await loadStats();
    } catch (error) {
      addLog(`❌ Ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    setLoading(true);
    addLog('🔧 Применение миграции базы данных...');
    
    try {
      const response = await fetch(AI_AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate' })
      });
      const result = await response.json();
      
      if (result.success) {
        addLog(`✅ ${result.message}`);
        addLog(`📊 Схема: ${result.schema}`);
        await loadStats();
      } else {
        addLog(`❌ Ошибка миграции: ${result.error}`);
      }
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-2">Требуется настройка базы данных</h3>
            <p className="text-sm text-yellow-800 mb-3">
              Если вы видите ошибку "object not found" или "InsufficientPrivilege", нужно применить миграцию для создания таблицы news_articles.
            </p>
            <div className="flex gap-2">
              <button
                onClick={runMigration}
                disabled={loading}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                <Icon name="Database" size={16} className="inline mr-2" />
                🔧 Применить миграцию БД
              </button>
              <a
                href="https://functions.poehali.dev/db-migrate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium inline-flex items-center"
              >
                <Icon name="ExternalLink" size={16} className="inline mr-2" />
                Открыть в новой вкладке
              </a>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              💡 Если кнопка не работает, откройте ссылку в новой вкладке — увидите результат миграции
            </p>
          </div>
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

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Icon name="Clock" size={20} />
          Автоматический запуск по расписанию
        </h3>
        <p className="text-sm text-purple-800 mb-4">
          Для автоматического запуска агента каждый день используйте один из бесплатных сервисов планировщиков:
        </p>
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-500 mb-2">Webhook URL для автозапуска:</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={SCHEDULER_URL}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(SCHEDULER_URL);
                addLog('📋 URL скопирован в буфер обмена');
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              <Icon name="Copy" size={16} className="inline mr-1" />
              Копировать
            </button>
          </div>
        </div>
        <div className="text-xs text-purple-700 space-y-3">
          <div>
            <p className="font-semibold mb-1">🇷🇺 Вариант 1: UptimeRobot (рекомендую, работает из РФ)</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Зайдите на <a href="https://uptimerobot.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">uptimerobot.com</a> и зарегистрируйтесь</li>
              <li>Создайте новый монитор: Add New Monitor → HTTP(s)</li>
              <li>URL: вставьте URL выше</li>
              <li>Monitoring Interval: каждые <strong>24 часа</strong> (или любой интервал)</li>
              <li>Monitor Type: HTTP(s) - Keyword</li>
              <li>Keyword: <code className="bg-purple-100 px-1 rounded">success</code></li>
              <li>Сохраните — UptimeRobot будет автоматически дергать URL!</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold mb-1">🇷🇺 Вариант 2: Yandex Cloud Functions Triggers (подробно)</p>
            <ol className="list-decimal ml-4 space-y-1 text-xs">
              <li>Откройте <a href="https://console.cloud.yandex.ru/folders" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Yandex Cloud Console</a></li>
              <li>Выберите ваш каталог (folder) где развёрнуты функции</li>
              <li>В меню слева найдите <strong>Serverless Containers</strong> → <strong>Triggers</strong></li>
              <li>Нажмите <strong>"Создать триггер"</strong></li>
              <li>Тип триггера: выберите <strong>"Таймер"</strong></li>
              <li>Имя: <code className="bg-purple-100 px-1">ai-agent-daily-trigger</code></li>
              <li>Cron-выражение: <code className="bg-purple-100 px-1 rounded">0 10 * * ? *</code> (каждый день в 10:00 МСК)</li>
              <li>Тип вызова: выберите <strong>"HTTP"</strong></li>
              <li>URL: вставьте <strong>Webhook URL</strong> выше (SCHEDULER_URL)</li>
              <li>Метод: <strong>POST</strong></li>
              <li>Заголовки (необязательно): <code className="bg-purple-100 px-1">Content-Type: application/json</code></li>
              <li>Тело запроса (необязательно): оставьте пустым или <code className="bg-purple-100 px-1">{'{}'}</code></li>
              <li>Нажмите <strong>"Создать триггер"</strong> — готово! ✅</li>
            </ol>
            <p className="mt-2 text-purple-600 italic">💡 Триггер будет автоматически вызывать ваш агент каждый день в 10:00 по МСК</p>
          </div>
          <div>
            <p className="font-semibold mb-1">🔹 Вариант 3: EasyCron.com (международный)</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Зайдите на <a href="https://www.easycron.com" target="_blank" rel="noopener noreferrer" className="underline">easycron.com</a></li>
              <li>URL: вставьте URL выше, Method: POST</li>
              <li>Cron: <code className="bg-purple-100 px-1 rounded">0 10 * * *</code> (10:00 каждый день)</li>
            </ol>
          </div>
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
            <p className="font-semibold text-green-800">💡 Самый простой: UptimeRobot</p>
            <p className="text-green-700">Работает из России, бесплатный, надёжный. Просто создаёте "монитор" который будет проверять ваш URL каждые 24 часа.</p>
          </div>
        </div>
      </div>
    </div>
  );
}