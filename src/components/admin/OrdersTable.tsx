import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  service: string;
  price: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
  status: string;
  created_at: string;
}

const ORDERS_API_URL = 'https://functions.poehali.dev/db6a1031-1511-4209-ae28-f4b4844c20dc';

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(ORDERS_API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки заявок');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
        <p className="text-gray-600">Загрузка заявок...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Icon name="ClipboardList" className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет заявок</h3>
        <p className="text-gray-500">Заявки от клиентов появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl">{order.service}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Icon name="Calendar" size={14} />
                  {formatDate(order.created_at)}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{order.price}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="User" size={16} className="text-gray-400" />
                  <span className="font-medium">Имя:</span>
                  <span>{order.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="Phone" size={16} className="text-gray-400" />
                  <span className="font-medium">Телефон:</span>
                  <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                    {order.phone}
                  </a>
                </div>
                {order.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Mail" size={16} className="text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${order.email}`} className="text-blue-600 hover:underline">
                      {order.email}
                    </a>
                  </div>
                )}
                {order.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Building2" size={16} className="text-gray-400" />
                    <span className="font-medium">Компания:</span>
                    <span>{order.company}</span>
                  </div>
                )}
              </div>
              {order.comment && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Icon name="MessageSquare" size={16} className="text-gray-400" />
                    Комментарий:
                  </div>
                  <p className="text-sm text-gray-600 pl-6">{order.comment}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersTable;