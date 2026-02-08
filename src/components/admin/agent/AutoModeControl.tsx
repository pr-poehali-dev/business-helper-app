import React from 'react';
import Icon from '@/components/ui/icon';

interface AutoModeControlProps {
  autoMode: boolean;
  intervalMinutes: number;
  loading: boolean;
  onToggle: (enabled: boolean) => void;
  onIntervalChange: (minutes: number) => void;
}

export default function AutoModeControl({
  autoMode,
  intervalMinutes,
  loading,
  onToggle,
  onIntervalChange
}: AutoModeControlProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative inline-block">
            <input
              type="checkbox"
              id="autoMode"
              checked={autoMode}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
              disabled={loading}
            />
            <label
              htmlFor="autoMode"
              className="block w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full cursor-pointer transition-colors peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
            >
              <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
            </label>
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon name="Zap" size={20} className={autoMode ? 'text-green-600' : 'text-gray-400'} />
              Автоматический режим
            </div>
            <div className="text-sm text-gray-600">
              {autoMode ? '🟢 Работает' : 'Выключен'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="interval" className="text-sm text-gray-600">Интервал:</label>
          <select
            id="interval"
            value={intervalMinutes}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            <option value={15}>15 минут</option>
            <option value={30}>30 минут</option>
            <option value={60}>1 час</option>
            <option value={120}>2 часа</option>
            <option value={180}>3 часа</option>
          </select>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-gray-600">
        <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
        <div>
          <strong>Браузерный режим:</strong> работает только при открытой вкладке. 
          <a 
            href="https://cron-job.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline ml-1"
          >
            Настройте серверный триггер →
          </a>
        </div>
      </div>
    </div>
  );
}
