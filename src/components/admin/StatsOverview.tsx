import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Активные баннеры',
      value: '12',
      change: '+2 за неделю',
      icon: 'Image',
      color: 'text-blue-600'
    },
    {
      title: 'Партнеры',
      value: '45',
      change: '+5 за месяц',
      icon: 'Users',
      color: 'text-green-600'
    },
    {
      title: 'Объявления',
      value: '128',
      change: '+18 за месяц',
      icon: 'FileText',
      color: 'text-purple-600'
    },
    {
      title: 'Клики',
      value: '15.2K',
      change: '+12% за неделю',
      icon: 'MousePointer',
      color: 'text-orange-600'
    }
  ];

  const recentActivity = [
    {
      action: 'Добавлен новый баннер',
      description: 'Баннер Альфа-Банк активирован',
      time: '2 часа назад',
      icon: 'Image'
    },
    {
      action: 'Новый партнер',
      description: 'Тинькофф Банк добавлен в систему',
      time: '5 часов назад',
      icon: 'Users'
    },
    {
      action: 'Объявление обновлено',
      description: 'Изменены условия РКО для малого бизнеса',
      time: '1 день назад',
      icon: 'FileText'
    },
    {
      action: 'Баннер отключен',
      description: 'Сезонная акция завершена',
      time: '2 дня назад',
      icon: 'AlertCircle'
    }
  ];

  const topPerformers = [
    {
      title: 'Альфа-Банк РКО',
      clicks: 2456,
      impressions: 45678,
      ctr: 5.38
    },
    {
      title: 'Тинькофф Эквайринг',
      clicks: 1879,
      impressions: 38901,
      ctr: 4.83
    },
    {
      title: 'Битрикс24 CRM',
      clicks: 1634,
      impressions: 34567,
      ctr: 4.73
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Обзор системы</h2>
        <p className="text-gray-600">Общая статистика рекламных материалов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name={stat.icon} size={24} className={stat.color} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.title}</div>
              <div className="text-xs text-green-600">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Недавние изменения в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon name={activity.icon} size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ объявлений</CardTitle>
            <CardDescription>Лучшие по кликабельности</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{performer.title}</p>
                    <span className="text-sm font-semibold text-blue-600">
                      {performer.ctr}% CTR
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{performer.clicks.toLocaleString()} кликов</span>
                    <span>{performer.impressions.toLocaleString()} показов</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(performer.ctr * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>Часто используемые функции</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Icon name="Image" size={24} className="mb-2 text-blue-600" />
              <p className="font-medium text-sm">Добавить баннер</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Icon name="Users" size={24} className="mb-2 text-green-600" />
              <p className="font-medium text-sm">Новый партнер</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Icon name="FileText" size={24} className="mb-2 text-purple-600" />
              <p className="font-medium text-sm">Создать объявление</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Icon name="BarChart3" size={24} className="mb-2 text-orange-600" />
              <p className="font-medium text-sm">Отчеты</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
