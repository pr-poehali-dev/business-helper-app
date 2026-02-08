import React from 'react';
import Icon from '@/components/ui/icon';

interface AgentControlsProps {
  loading: boolean;
  logs: string[];
  onRunScraper: () => void;
  onProcessNews: () => void;
  onPublishNews: () => void;
  onRunAutoPipeline: () => void;
  onClearLogs: () => void;
}

export default function AgentControls({
  loading,
  logs,
  onRunScraper,
  onProcessNews,
  onPublishNews,
  onRunAutoPipeline,
  onClearLogs
}: AgentControlsProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onRunScraper}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            <Icon name="Globe" size={18} className="inline mr-2" />
            1. Собрать новости с сайта
          </button>
          <button
            onClick={onProcessNews}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            <Icon name="Sparkles" size={18} className="inline mr-2" />
            2. Обработать через ИИ
          </button>
          <button
            onClick={onPublishNews}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            <Icon name="Send" size={18} className="inline mr-2" />
            3. Опубликовать (TG + VK)
          </button>
        </div>
        <button
          onClick={onRunAutoPipeline}
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
        >
          <Icon name="Zap" size={18} className="inline mr-2" />
          ⚡ Запустить полный автоцикл (1→2→3)
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Логи работы агента</h3>
          <button
            onClick={onClearLogs}
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
          <li>• <strong>Шаг 2:</strong> ИИ переписывает описания в интересные новости</li>
          <li>• <strong>Шаг 3:</strong> Публикует готовые новости в Telegram (@kupetzvplyuse) и VK (vk.com/kupetzvplyuse)</li>
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
        <div className="space-y-3">
          <a
            href="https://cron-job.org"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-purple-900">Cron-job.org</div>
                <div className="text-sm text-purple-700">Бесплатно до 50 заданий</div>
              </div>
              <Icon name="ExternalLink" size={20} className="text-purple-600" />
            </div>
          </a>
          <a
            href="https://easycron.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-purple-900">EasyCron</div>
                <div className="text-sm text-purple-700">Бесплатно до 15 заданий</div>
              </div>
              <Icon name="ExternalLink" size={20} className="text-purple-600" />
            </div>
          </a>
        </div>
        <div className="mt-4 p-4 bg-purple-100 rounded-lg">
          <div className="text-sm font-semibold text-purple-900 mb-2">Настройка расписания:</div>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>1. Зарегистрируйтесь на одном из сервисов</li>
            <li>2. Создайте новое задание с URL из панели выше</li>
            <li>3. Установите расписание (например: каждые 30 минут)</li>
            <li>4. Агент будет работать автоматически без открытого браузера</li>
          </ul>
        </div>
      </div>
    </>
  );
}
