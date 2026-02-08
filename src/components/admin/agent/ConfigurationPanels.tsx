import React from 'react';
import Icon from '@/components/ui/icon';

interface ConfigurationPanelsProps {
  schedulerUrl: string;
  loading: boolean;
  onTestScheduler: () => void;
  onRunMigration: () => void;
}

export default function ConfigurationPanels({
  schedulerUrl,
  loading,
  onTestScheduler,
  onRunMigration
}: ConfigurationPanelsProps) {
  return (
    <>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="MessageSquare" size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-indigo-900 mb-2">📱 Настройка публикации ВКонтакте</div>
            <div className="text-sm text-indigo-800 mb-3">
              Чтобы агент публиковал новости в VK сообщество, добавьте два ключа в секреты проекта:
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded p-3 border border-indigo-200">
                <div className="font-semibold text-indigo-900 mb-1">1. VK_ACCESS_TOKEN</div>
                <div className="text-indigo-700 mb-2">Получить токен:</div>
                <ol className="list-decimal ml-5 space-y-1 text-indigo-800">
                  <li>Откройте <a href="https://vk.com/kupetzvplyuse" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vk.com/kupetzvplyuse</a></li>
                  <li>Управление → Настройки → Работа с API</li>
                  <li>Создайте ключ доступа с правами: <code className="bg-indigo-100 px-1 py-0.5 rounded text-xs">wall</code> и <code className="bg-indigo-100 px-1 py-0.5 rounded text-xs">photos</code></li>
                  <li>Скопируйте токен и добавьте в секреты проекта</li>
                </ol>
              </div>
              <div className="bg-white rounded p-3 border border-indigo-200">
                <div className="font-semibold text-indigo-900 mb-1">2. VK_GROUP_ID</div>
                <div className="text-indigo-700 mb-2">ID сообщества (только цифры, без минуса):</div>
                <ol className="list-decimal ml-5 space-y-1 text-indigo-800">
                  <li>Откройте <a href="https://vk.com/kupetzvplyuse" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vk.com/kupetzvplyuse</a></li>
                  <li>Управление → Настройки</li>
                  <li>Найдите "Идентификатор сообщества" (например: 123456789)</li>
                  <li>Добавьте это число в секреты</li>
                </ol>
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-600 bg-white rounded p-2 border border-indigo-200">
              💡 Если секреты не добавлены, публикация будет идти только в Telegram
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Clock" size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900 mb-2">⚡ Серверное расписание (24/7)</div>
            <div className="text-sm text-yellow-800 mb-3">
              Настройте автоматический запуск через внешний триггер — работает независимо от браузера:
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-900 min-w-[80px]">URL:</span>
                <code className="bg-yellow-100 px-2 py-1 rounded text-xs flex-1 break-all">{schedulerUrl}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-900 min-w-[80px]">Метод:</span>
                <code className="bg-yellow-100 px-2 py-1 rounded text-xs">POST</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-900 min-w-[80px]">Сервисы:</span>
                <div className="flex-1 text-yellow-800">
                  <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cron-job.org</a>
                  {' • '}
                  <a href="https://easycron.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">easycron.com</a>
                  {' • '}
                  <span className="text-yellow-700">Yandex Cloud Triggers</span>
                </div>
              </div>
            </div>
            <button
              onClick={onTestScheduler}
              disabled={loading}
              className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <Icon name="TestTube" size={16} className="inline mr-2" />
              Протестировать триггер
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 mb-2">Требуется настройка базы данных</h3>
            <p className="text-sm text-orange-800 mb-3">
              Если вы видите ошибку "object not found" или "InsufficientPrivilege", нужно применить миграцию для создания таблицы news_articles.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onRunMigration}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
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
            <p className="text-xs text-orange-700 mt-2">
              💡 Если кнопка не работает, откройте ссылку в новой вкладке — увидите результат миграции
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
