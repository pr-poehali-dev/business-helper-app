import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  company_name?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

interface UserAnalytics {
  id: number;
  email: string;
  full_name: string;
  company_name?: string;
  created_at: string;
  last_login?: string;
  total_actions: number;
  orders_count: number;
  last_activity?: string;
}

interface UserProfile {
  profile: {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    company_name?: string;
    total_actions: number;
    viewed_services: number;
    viewed_offers: number;
    orders_count: number;
    last_activity?: string;
  };
  action_stats: Array<{ action_type: string; count: number }>;
  top_services: Array<{ service_name: string; views: number }>;
  top_offers: Array<{ offer_name: string; partner: string; views: number }>;
}

const USERS_API_URL = 'https://functions.poehali.dev/df46525d-1ee2-4702-a96b-e11ccf536b4c';
const ANALYTICS_API_URL = 'https://functions.poehali.dev/c0c4c918-900a-4c3e-b840-213d3cb7b459';

const ClientsManagement = () => {
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ANALYTICS_API_URL}?report=all_users`);
      if (!response.ok) throw new Error('Ошибка загрузки клиентов');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: number) => {
    try {
      const response = await fetch(`${ANALYTICS_API_URL}?report=user_profile&user_id=${userId}`);
      if (!response.ok) throw new Error('Ошибка загрузки профиля');
      const data = await response.json();
      setSelectedUser(data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      alert('Не удалось загрузить профиль пользователя');
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'view_service': 'Просмотр услуг',
      'view_offer': 'Просмотр предложений',
      'submit_order': 'Отправка заявок',
      'login': 'Вход в систему',
      'search': 'Поиск',
      'filter': 'Фильтрация'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
        <p className="text-gray-600">Загрузка клиентов...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon name="User" className="text-blue-600" size={20} />
                  <CardTitle className="text-lg">{user.full_name}</CardTitle>
                </div>
                {user.orders_count > 0 && (
                  <Badge variant="default" className="bg-green-600">
                    {user.orders_count} заявок
                  </Badge>
                )}
              </div>
              <CardDescription>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Mail" size={14} />
                    {user.email}
                  </div>
                  {user.company_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Building2" size={14} />
                      {user.company_name}
                    </div>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-blue-600 font-semibold text-xl">{user.total_actions}</div>
                    <div className="text-gray-600 text-xs">всего действий</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-purple-600 font-semibold text-xl">{user.orders_count}</div>
                    <div className="text-gray-600 text-xs">заявок</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Регистрация: {formatDate(user.created_at)}</div>
                  {user.last_activity && (
                    <div>Последняя активность: {formatDate(user.last_activity)}</div>
                  )}
                </div>

                <Button 
                  onClick={() => loadUserProfile(user.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Icon name="BarChart3" className="mr-2" size={16} />
                  Подробная аналитика
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-16">
          <Icon name="Users" className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет клиентов</h3>
          <p className="text-gray-500">Клиенты появятся после регистрации</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="UserCircle" size={24} />
              Аналитика клиента: {selectedUser?.profile.full_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-600 font-bold text-2xl">{selectedUser.profile.total_actions}</div>
                  <div className="text-gray-600 text-sm">Всего действий</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 font-bold text-2xl">{selectedUser.profile.viewed_services}</div>
                  <div className="text-gray-600 text-sm">Просмотров услуг</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-purple-600 font-bold text-2xl">{selectedUser.profile.viewed_offers}</div>
                  <div className="text-gray-600 text-sm">Просмотров предложений</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-orange-600 font-bold text-2xl">{selectedUser.profile.orders_count}</div>
                  <div className="text-gray-600 text-sm">Заявок отправлено</div>
                </div>
              </div>

              {selectedUser.action_stats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Типы активности</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedUser.action_stats.map((stat) => (
                        <div key={stat.action_type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{getActionTypeLabel(stat.action_type)}</span>
                          <Badge>{stat.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedUser.top_services.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Icon name="TrendingUp" className="inline mr-2" size={20} />
                      Интересующие услуги
                    </CardTitle>
                    <CardDescription>Услуги, которые клиент смотрел чаще всего</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedUser.top_services.map((service, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                          <span className="font-medium">{service.service_name}</span>
                          <Badge variant="outline" className="bg-white">
                            {service.views} {service.views === 1 ? 'просмотр' : 'просмотров'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedUser.top_offers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Icon name="Star" className="inline mr-2" size={20} />
                      Интересующие партнёрские предложения
                    </CardTitle>
                    <CardDescription>Предложения партнёров, которые привлекли внимание</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedUser.top_offers.map((offer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded">
                          <div>
                            <div className="font-medium">{offer.offer_name}</div>
                            <div className="text-sm text-gray-600">{offer.partner}</div>
                          </div>
                          <Badge variant="outline" className="bg-white">
                            {offer.views} {offer.views === 1 ? 'просмотр' : 'просмотров'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Icon name="Lightbulb" className="text-yellow-600 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Рекомендации для работы с клиентом</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {selectedUser.profile.orders_count === 0 && selectedUser.profile.total_actions > 5 && (
                        <li>• Клиент активно изучает предложения, но ещё не оставил заявку — свяжитесь с ним для консультации</li>
                      )}
                      {selectedUser.top_services.length > 0 && (
                        <li>• Основной интерес: {selectedUser.top_services[0].service_name} — подготовьте персональное предложение по этой услуге</li>
                      )}
                      {selectedUser.top_offers.length > 0 && (
                        <li>• Привлекает внимание предложение от {selectedUser.top_offers[0].partner} — можно предложить дополнительную скидку</li>
                      )}
                      {selectedUser.profile.orders_count > 2 && (
                        <li>• Активный клиент с {selectedUser.profile.orders_count} заявками — предложите программу лояльности</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientsManagement;
