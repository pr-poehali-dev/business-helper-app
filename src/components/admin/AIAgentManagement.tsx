import React, { useState, useEffect } from 'react';
import AgentStats from './agent/AgentStats';
import AutoModeControl from './agent/AutoModeControl';
import ConfigurationPanels from './agent/ConfigurationPanels';
import AgentControls from './agent/AgentControls';

const AI_AGENT_URL = 'https://functions.poehali.dev/c42f2362-0697-4b7f-acd6-202c45772cba';
const NEWS_SCRAPER_URL = 'https://functions.poehali.dev/80bcda15-af32-4342-a690-bc57930219a7';
const SCHEDULER_URL = 'https://functions.poehali.dev/38107b77-1b0c-4bb7-b18b-f5164553c08b';

interface AgentStatsData {
  drafts: number;
  ready: number;
  published: number;
  total: number;
}

export default function AIAgentManagement() {
  const [stats, setStats] = useState<AgentStatsData>({ drafts: 0, ready: 0, published: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (autoMode) {
      addLog(`🤖 Автоматический режим включен (каждые ${intervalMinutes} мин)`);
      runAutoPipeline();
      intervalRef.current = setInterval(() => {
        runAutoPipeline();
      }, intervalMinutes * 60 * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        addLog('⏸️ Автоматический режим выключен');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoMode, intervalMinutes]);

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
        const tg = result.published_telegram || 0;
        const vk = result.published_vk || 0;
        addLog(`✅ Опубликовано: Telegram - ${tg}, VK - ${vk} (всего ${result.total_ready})`);
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
          const tg = pipeline.publish.published_telegram || 0;
          const vk = pipeline.publish.published_vk || 0;
          addLog(`✅ Публикация: TG - ${tg}, VK - ${vk}`);
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

  const testScheduler = async () => {
    setLoading(true);
    addLog('🧪 Тестирование серверного триггера...');
    
    try {
      const response = await fetch(SCHEDULER_URL, { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        addLog('✅ Серверный триггер работает!');
        addLog(`📊 Время выполнения: ${result.timestamp}`);
      } else {
        addLog(`❌ Ошибка триггера: ${result.error}`);
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
      <AgentStats 
        stats={stats} 
        loading={loading} 
        onRefresh={loadStats}
      />

      <AutoModeControl
        autoMode={autoMode}
        intervalMinutes={intervalMinutes}
        loading={loading}
        onToggle={setAutoMode}
        onIntervalChange={setIntervalMinutes}
      />

      <ConfigurationPanels
        schedulerUrl={SCHEDULER_URL}
        loading={loading}
        onTestScheduler={testScheduler}
        onRunMigration={runMigration}
      />

      <AgentControls
        loading={loading}
        logs={logs}
        onRunScraper={runScraper}
        onProcessNews={processNews}
        onPublishNews={publishNews}
        onRunAutoPipeline={runAutoPipeline}
        onClearLogs={() => setLogs([])}
      />
    </div>
  );
}
