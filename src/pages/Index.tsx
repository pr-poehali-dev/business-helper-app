import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const products = [
    {
      id: 1,
      category: 'phone',
      title: 'Виртуальная АТС',
      description: 'Современная облачная телефония для бизнеса любого масштаба',
      price: 'Бесплатно',
      oldPrice: '2 990 ₽',
      features: ['Неограниченные номера', 'Запись звонков', 'Интеграция с CRM', 'Мобильное приложение'],
      icon: 'Phone',
      gradient: 'from-purple-500 to-pink-600',
      badge: 'Хит продаж'
    },
    {
      id: 2,
      category: 'bank',
      title: 'Расчётный счёт',
      description: 'Открытие счёта за 10 минут с выгодными условиями обслуживания',
      price: 'Бесплатно',
      oldPrice: '1 500 ₽',
      features: ['0₽ за открытие', 'Бесплатные платежи', 'Интернет-банкинг', 'Корпоративные карты'],
      icon: 'Wallet',
      gradient: 'from-blue-500 to-cyan-600',
      badge: 'Новинка'
    },
    {
      id: 3,
      category: 'partner',
      title: 'CRM-система',
      description: 'Управление продажами и клиентской базой в одном интерфейсе',
      price: 'Бесплатно',
      oldPrice: '5 990 ₽',
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
      oldPrice: '7 990 ₽',
      features: ['Распределение звонков', 'Статистика операторов', 'IVR-меню', 'Контроль качества'],
      icon: 'Headphones',
      gradient: 'from-purple-500 to-indigo-600',
      badge: 'Акция'
    },
    {
      id: 5,
      category: 'bank',
      title: 'Эквайринг',
      description: 'Приём платежей по картам онлайн и офлайн',
      price: 'Бесплатно',
      oldPrice: '3 990 ₽',
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
      oldPrice: '4 990 ₽',
      features: ['Налоговая отчётность', 'Зарплата сотрудников', 'Интеграция с банком', 'Консультации'],
      icon: 'Calculator',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 7,
      category: 'phone',
      title: 'SMS-рассылки',
      description: 'Массовые SMS-уведомления для ваших клиентов',
      price: 'Бесплатно',
      oldPrice: '1 990 ₽',
      features: ['До 1000 SMS', 'Персонализация', 'Статистика доставки', 'API доступ'],
      icon: 'MessageSquare',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 8,
      category: 'partner',
      title: 'Юридическая поддержка',
      description: 'Консультации и сопровождение бизнеса',
      price: 'Бесплатно',
      oldPrice: '9 990 ₽',
      features: ['Консультации юриста', 'Проверка документов', 'Договоры', 'Споры с контрагентами'],
      icon: 'Scale',
      gradient: 'from-indigo-500 to-purple-600',
      badge: 'Эксклюзив'
    },
    {
      id: 9,
      category: 'bank',
      title: 'Кредитование бизнеса',
      description: 'Выгодные условия для развития вашей компании',
      price: 'Бесплатно',
      oldPrice: '0 ₽',
      features: ['От 9,9% годовых', 'До 5 млн рублей', 'Решение за 1 день', 'Без залога'],
      icon: 'TrendingUp',
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'Выгодно'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все товары', icon: 'Store' },
    { id: 'phone', name: 'Телефония', icon: 'Phone' },
    { id: 'bank', name: 'Финансы', icon: 'Wallet' },
    { id: 'partner', name: 'Партнёры', icon: 'Handshake' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-orange-400">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                <Icon name="Store" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-orange-600">Купец в плюсе</h1>
                <p className="text-xs text-gray-600">Магазин бизнес-услуг</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="hidden md:flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50">
                <Icon name="ShoppingCart" size={20} />
                Корзина (0)
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 shadow-lg">
                <Icon name="User" className="mr-2" size={18} />
                Войти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <Badge className="mb-6 bg-white text-orange-600 border-0 text-base px-6 py-2 shadow-lg">
            🎉 Грандиозная распродажа!
          </Badge>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Купец в плюсе —<br />
            ваш надёжный партнёр в бизнесе
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
            Все услуги для вашего бизнеса по специальным ценам! Телефония, банковские продукты, бухгалтерия — всё бесплатно!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-10 py-7 shadow-xl">
              <Icon name="ShoppingBag" className="mr-2" size={22} />
              Смотреть товары
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7 backdrop-blur">
              <Icon name="Percent" className="mr-2" size={22} />
              Акции и скидки
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 bg-white border-b-2 border-orange-200 sticky top-[73px] z-40 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Icon name="Filter" className="text-gray-600 flex-shrink-0" size={24} />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Категории:</span>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                    : 'border-orange-300 text-gray-700 hover:bg-orange-50'
                }`}
              >
                <Icon name={cat.icon as any} className="mr-2" size={18} />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                {selectedCategory === 'all' ? 'Все товары' : categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <p className="text-gray-600">Найдено товаров: {filteredProducts.length}</p>
            </div>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Icon name="SlidersHorizontal" className="mr-2" size={18} />
              Сортировка
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <Card
                key={product.id}
                className="border-2 hover:border-orange-400 transition-all hover:shadow-2xl group animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {product.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className={`${
                      product.badge === 'Хит продаж' ? 'bg-red-500' :
                      product.badge === 'Новинка' ? 'bg-green-500' :
                      product.badge === 'Акция' ? 'bg-purple-500' :
                      product.badge === 'Эксклюзив' ? 'bg-indigo-500' :
                      'bg-orange-500'
                    } text-white border-0 shadow-lg font-semibold`}>
                      {product.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon name={product.icon as any} className="text-white" size={40} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-bold text-green-600">{product.price}</span>
                      <span className="text-lg text-gray-400 line-through mb-2">{product.oldPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <Icon name="TrendingDown" size={16} />
                      Экономия до 100%
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <Button className={`flex-1 bg-gradient-to-r ${product.gradient} text-white hover:opacity-90 shadow-md`}>
                      <Icon name="ShoppingCart" className="mr-2" size={18} />
                      В корзину
                    </Button>
                    <Button variant="outline" size="icon" className="border-orange-300 hover:bg-orange-50">
                      <Icon name="Heart" size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">Почему выбирают наш магазин?</h3>
          <p className="text-xl mb-12 opacity-90">Тысячи довольных клиентов уже оценили наши преимущества</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" size={32} />
                </div>
                <CardTitle className="text-white text-xl">100% Гарантия</CardTitle>
                <CardDescription className="text-white/80">Возврат в течение 30 дней</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Zap" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Быстро</CardTitle>
                <CardDescription className="text-white/80">Подключение за 5 минут</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Headphones" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Поддержка 24/7</CardTitle>
                <CardDescription className="text-white/80">Всегда на связи</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Gift" size={32} />
                </div>
                <CardTitle className="text-white text-xl">Бонусы</CardTitle>
                <CardDescription className="text-white/80">Кэшбэк и подарки</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Icon name="Store" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Купец в плюсе</h4>
                  <p className="text-xs text-gray-400">Магазин бизнес-услуг</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Всё необходимое для эффективного развития вашего дела</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Каталог</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Телефония</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Финансовые услуги</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Партнёрские продукты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Все товары</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Покупателям</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Доставка и оплата</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат товара</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Акции и скидки</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Программа лояльности</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Контакты</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  8 800 555-35-35
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@kupecplus.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Москва, ул. Бизнесовая, 1
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Купец в плюсе. Все права защищены. Магазин бизнес-услуг.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
