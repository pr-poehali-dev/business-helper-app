import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      id: 1,
      category: 'phone',
      title: 'Виртуальная АТС',
      description: 'Современная облачная телефония для бизнеса любого масштаба',
      price: 'Бесплатно',
      features: ['Неограниченные номера', 'Запись звонков', 'Интеграция с CRM', 'Мобильное приложение'],
      icon: 'Phone',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 2,
      category: 'bank',
      title: 'Расчётный счёт',
      description: 'Открытие счёта за 10 минут с выгодными условиями обслуживания',
      price: 'Бесплатно',
      features: ['0₽ за открытие', 'Бесплатные платежи', 'Интернет-банкинг', 'Корпоративные карты'],
      icon: 'Wallet',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      category: 'partner',
      title: 'CRM-система',
      description: 'Управление продажами и клиентской базой в одном интерфейсе',
      price: 'Бесплатно',
      features: ['Воронка продаж', 'Email-маркетинг', 'Аналитика', 'Автоматизация'],
      icon: 'BarChart3',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 4,
      category: 'phone',
      title: 'Колл-центр',
      description: 'Профессиональное решение для обработки входящих звонков',
      price: 'Бесплатно',
      features: ['Распределение звонков', 'Статистика операторов', 'IVR-меню', 'Контроль качества'],
      icon: 'Headphones',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 5,
      category: 'bank',
      title: 'Эквайринг',
      description: 'Приём платежей по картам онлайн и офлайн',
      price: 'Бесплатно',
      features: ['Низкие комиссии', 'Быстрые выплаты', 'Защита 3D-Secure', 'API интеграция'],
      icon: 'CreditCard',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 6,
      category: 'partner',
      title: 'Бухгалтерия',
      description: 'Автоматизация учёта и отчётности для малого бизнеса',
      price: 'Бесплатно',
      features: ['Налоговая отчётность', 'Зарплата сотрудников', 'Интеграция с банком', 'Консультации'],
      icon: 'Calculator',
      gradient: 'from-green-500 to-emerald-600'
    }
  ];

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Icon name="Zap" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Купец в плюсе
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Главная</a>
              <a href="#products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Продукты</a>
              <a href="#profile" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Профиль</a>
              <a href="#support" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Поддержка</a>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90">
              Войти
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 text-sm px-4 py-2">
            🚀 Всё для бизнеса в одном месте
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Купец в плюсе —<br />ваш надёжный партнёр в бизнесе
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Наше приложение объединяет лучшие решения: надежная телефония, выгодные банковские продукты, 
            специальные предложения от проверенных партнеров. Всё бесплатно!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 text-lg px-8 py-6">
              <Icon name="Sparkles" className="mr-2" size={20} />
              Начать бесплатно
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-300 hover:bg-purple-50">
              <Icon name="PlayCircle" className="mr-2" size={20} />
              Смотреть демо
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-lg animate-slide-up">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                  <Icon name="Phone" className="text-white" size={28} />
                </div>
                <CardTitle className="text-2xl">Телефония</CardTitle>
                <CardDescription>Виртуальная АТС и колл-центр для вашего бизнеса</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Icon name="Wallet" className="text-white" size={28} />
                </div>
                <CardTitle className="text-2xl">Банковские услуги</CardTitle>
                <CardDescription>Счета, карты и эквайринг с выгодными условиями</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                  <Icon name="Gift" className="text-white" size={28} />
                </div>
                <CardTitle className="text-2xl">Партнёрские предложения</CardTitle>
                <CardDescription>Эксклюзивные условия от проверенных партнёров</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Каталог продуктов
            </h2>
            <p className="text-xl text-gray-600">Все инструменты для эффективного развития вашего дела</p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 h-14">
              <TabsTrigger value="all" className="text-base">
                <Icon name="Grid3x3" className="mr-2" size={18} />
                Все
              </TabsTrigger>
              <TabsTrigger value="phone" className="text-base">
                <Icon name="Phone" className="mr-2" size={18} />
                Телефония
              </TabsTrigger>
              <TabsTrigger value="bank" className="text-base">
                <Icon name="Wallet" className="mr-2" size={18} />
                Банки
              </TabsTrigger>
              <TabsTrigger value="partner" className="text-base">
                <Icon name="Gift" className="mr-2" size={18} />
                Партнёры
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, idx) => (
                  <Card 
                    key={product.id} 
                    className="border-2 hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4`}>
                        <Icon name={product.icon as any} className="text-white" size={32} />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-2xl">{product.title}</CardTitle>
                        <Badge className="bg-green-100 text-green-700 border-0 font-semibold">
                          {product.price}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                              <Icon name="Check" className="text-white" size={14} />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full bg-gradient-to-r ${product.gradient} text-white hover:opacity-90`}>
                        Подключить
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="profile" className="py-20 px-4 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Личный профиль
              </h2>
              <p className="text-xl text-gray-600">Управляйте своими услугами и подписками</p>
            </div>
            
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Icon name="User" size={40} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Иван Петров</CardTitle>
                    <CardDescription className="text-purple-100">ivan@business.ru</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon name="Package" size={20} />
                        Активных услуг
                      </CardTitle>
                      <div className="text-4xl font-bold text-purple-600">3</div>
                    </CardHeader>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon name="TrendingUp" size={20} />
                        Экономия
                      </CardTitle>
                      <div className="text-4xl font-bold text-blue-600">15%</div>
                    </CardHeader>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon name="Award" size={20} />
                        Статус
                      </CardTitle>
                      <div className="text-2xl font-bold text-orange-600">Premium</div>
                    </CardHeader>
                  </Card>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90">
                  <Icon name="Settings" className="mr-2" size={20} />
                  Настроить профиль
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="support" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Центр поддержки
            </h2>
            <p className="text-xl text-gray-600 mb-12">Мы всегда на связи и готовы помочь</p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                    <Icon name="MessageCircle" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-xl">Онлайн-чат</CardTitle>
                  <CardDescription>Ответим за 2 минуты</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Mail" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-xl">Email поддержка</CardTitle>
                  <CardDescription>support@bizassist.ru</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-orange-300 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Phone" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-xl">Телефон</CardTitle>
                  <CardDescription>8 800 555-35-35</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="border-2 text-left">
              <CardHeader>
                <CardTitle className="text-2xl">Часто задаваемые вопросы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="HelpCircle" size={20} className="text-purple-600" />
                    Все услуги действительно бесплатны?
                  </h3>
                  <p className="text-gray-600">Да, базовые версии всех продуктов доступны бесплатно с возможностью расширения.</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="HelpCircle" size={20} className="text-blue-600" />
                    Как быстро можно начать пользоваться?
                  </h3>
                  <p className="text-gray-600">Регистрация занимает 5 минут, после чего сразу можно подключать нужные сервисы.</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="HelpCircle" size={20} className="text-orange-600" />
                    Есть ли интеграция с другими сервисами?
                  </h3>
                  <p className="text-gray-600">Да, все продукты имеют API и готовые интеграции с популярными CRM и 1С.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon name="Zap" size={24} />
                </div>
                <span className="text-2xl font-bold">Купец в плюсе</span>
              </div>
              <p className="text-purple-200">Всё необходимое для эффективного развития вашего дела</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Продукты</h3>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Телефония</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Банковские услуги</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Партнёры</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Компания</h3>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Вакансии</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Поддержка</h3>
              <ul className="space-y-2 text-purple-200">
                <li><a href="#" className="hover:text-white transition-colors">Помощь</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-purple-200">
            <p>&copy; 2024 Купец в плюсе. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;