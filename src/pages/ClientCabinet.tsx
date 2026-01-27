import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  company_name?: string;
}

interface Order {
  id: number;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name?: string;
  message?: string;
  status: string;
  created_at: string;
}

const USERS_API_URL = 'https://functions.poehali.dev/df46525d-1ee2-4702-a96b-e11ccf536b4c';
const ORDERS_API_URL = 'https://functions.poehali.dev/db6d5c9a-9db1-4c85-b0c9-e45c46cc49e9';
const ANALYTICS_API_URL = 'https://functions.poehali.dev/c0c4c918-900a-4c3e-b840-213d3cb7b459';

const ClientCabinet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    company_name: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('clientUser');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadOrders(parsedUser.email);
    }
  }, []);

  const logAction = async (actionType: string, description: string, metadata?: any) => {
    if (!user) return;
    
    try {
      await fetch(ANALYTICS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action_type: actionType,
          action_description: description,
          page_url: window.location.pathname,
          metadata: metadata || {}
        })
      });
    } catch (error) {
      console.error('Ошибка логирования действия:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(USERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginData.email,
          password: loginData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        setUser(data.user);
        loadOrders(data.user.email);
        
        await logAction('login', 'Вход в личный кабинет');
      } else {
        alert(data.error || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Не удалось войти в систему');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(USERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          ...registerData
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        setUser(data.user);
        alert('Регистрация успешна!');
      } else {
        alert('Ошибка регистрации');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Не удалось зарегистрироваться');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (email: string) => {
    try {
      const response = await fetch(ORDERS_API_URL);
      const data = await response.json();
      const userOrders = data.filter((order: Order) => order.client_email === email);
      setOrders(userOrders);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    setUser(null);
    setOrders([]);
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      new: { variant: 'default', label: 'Новая' },
      in_progress: { variant: 'secondary', label: 'В работе' },
      completed: { variant: 'outline', label: 'Выполнена' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Вход в личный кабинет' : 'Регистрация'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin ? 'Войдите, чтобы отслеживать свои заявки' : 'Создайте аккаунт для управления заявками'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setIsLogin(false)}
                  >
                    Нет аккаунта? Зарегистрироваться
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name">ФИО *</Label>
                    <Input
                      id="reg-name"
                      value={registerData.full_name}
                      onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email *</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Пароль *</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-phone">Телефон</Label>
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-company">Название компании</Label>
                    <Input
                      id="reg-company"
                      value={registerData.company_name}
                      onChange={(e) => setRegisterData({ ...registerData, company_name: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setIsLogin(true)}
                  >
                    Уже есть аккаунт? Войти
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
              <p className="text-gray-600">Добро пожаловать, {user.full_name}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Mail" size={20} />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{user.email}</p>
              </CardContent>
            </Card>
            {user.phone && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Phone" size={20} />
                    Телефон
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{user.phone}</p>
                </CardContent>
              </Card>
            )}
            {user.company_name && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Building2" size={20} />
                    Компания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{user.company_name}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ClipboardList" size={24} />
                Мои заявки ({orders.length})
              </CardTitle>
              <CardDescription>История всех отправленных заявок</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{order.service_name}</h3>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      {order.message && (
                        <div className="bg-gray-50 rounded p-3 mb-2">
                          <p className="text-sm text-gray-700">{order.message}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>Телефон: {order.client_phone}</div>
                        {order.company_name && <div>Компания: {order.company_name}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Inbox" className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет заявок</h3>
                  <p className="text-gray-500 mb-4">Вы ещё не отправляли заявки</p>
                  <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                    Посмотреть услуги
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientCabinet;
