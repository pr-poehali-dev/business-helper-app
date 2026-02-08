import React from 'react';
import Icon from '@/components/ui/icon';

interface AgentStats {
  drafts: number;
  ready: number;
  published: number;
  total: number;
}

interface AgentStatsProps {
  stats: AgentStats;
  loading: boolean;
  onRefresh: () => void;
}

export default function AgentStats({ stats, loading, onRefresh }: AgentStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Icon name="Bot" size={24} />
          ИИ-Агент для Новостей
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <Icon name="RefreshCw" size={16} className="inline mr-2" />
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
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
    </div>
  );
}
