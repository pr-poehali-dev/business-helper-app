import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'bank', name: 'Банковские услуги', icon: 'Building2', color: 'from-blue-500 to-cyan-600', count: 15 },
    { id: 'phone', name: 'Телефония', icon: 'Phone', color: 'from-purple-500 to-pink-600', count: 12 },
    { id: 'crm', name: 'CRM и автоматизация', icon: 'BarChart3', color: 'from-orange-500 to-red-600', count: 8 },
    { id: 'mobile', name: 'Мобильные операторы', icon: 'Smartphone', color: 'from-green-500 to-emerald-600', count: 6 }
  ];

  const products = [
    {
      id: 1,
      category: 'bank',
      partner: 'Альфа-Банк',
      partnerLogo: '🏦',
      title: 'Расчётный счёт для бизнеса',
      description: 'Открытие счёта онлайн за 10 минут. 0₽ за обслуживание первые 3 месяца',
      price: '0 ₽',
      oldPrice: '1 990 ₽',
      features: ['Бесплатное открытие', 'До 50 платежей без комиссии', 'Онлайн-бухгалтерия в подарок', 'Корп. карты бесплатно'],
      badge: 'Хит продаж',
      rating: 4.8,
      reviews: 234
    },
    {
      id: 2,
      category: 'phone',
      partner: 'Mango Office',
      partnerLogo: '📞',
      title: 'Виртуальная АТС',
      description: 'Профессиональная телефония для бизнеса с записью разговоров',
      price: '0 ₽',
      oldPrice: '2 990 ₽',
      features: ['3 номера в подарок', 'Запись звонков 30 дней', 'CRM-интеграция', 'Мобильное приложение'],
      badge: 'Новинка',
      rating: 4.9,
      reviews: 189
    },
    {
      id: 3,
      category: 'crm',
      partner: 'Битрикс24',
      partnerLogo: '💼',
      title: 'CRM-система для продаж',
      description: 'Полный цикл управления клиентами и сделками',
      price: '0 ₽',
      oldPrice: '5 990 ₽',
      features: ['12 пользователей', 'Email и SMS рассылки', 'Воронка продаж', 'Интеграция с 1С'],
      badge: 'Акция',
      rating: 4.7,
      reviews: 456
    },
    {
      id: 4,
      category: 'mobile',
      partner: 'МегаФон',
      partnerLogo: '📱',
      title: 'Корпоративная связь',
      description: 'Выгодные тарифы для сотрудников компании',
      price: '0 ₽',
      oldPrice: '350 ₽',
      features: ['Безлимит внутри сети', '30 ГБ интернета', 'Единый номер компании', 'Детализация звонков'],
      badge: 'Выгодно',
      rating: 4.6,
      reviews: 312
    },
    {
      id: 5,
      category: 'bank',
      partner: 'Тинькофф',
      partnerLogo: '💳',
      title: 'Эквайринг онлайн',
      description: 'Приём платежей на сайте и в соцсетях',
      price: '0 ₽',
      oldPrice: '3 500 ₽',
      features: ['Комиссия от 2,4%', 'Быстрые выплаты', 'Защита 3D-Secure', 'Готовая форма оплаты'],
      rating: 4.8,
      reviews: 521
    },
    {
      id: 6,
      category: 'crm',
      partner: 'amoCRM',
      partnerLogo: '🎯',
      title: 'Автоматизация продаж',
      description: 'Простая CRM для малого бизнеса',
      price: '0 ₽',
      oldPrice: '4 200 ₽',
      features: ['Чат-боты', 'Мессенджеры в CRM', 'Аналитика продаж', 'Воронка и задачи'],
      rating: 4.9,
      reviews: 678
    }
  ];

  const partners = [
    {
      name: 'Альфа-Банк',
      logo: '🏦',
      description: 'Крупнейший частный банк России',
      specialization: 'Банковские услуги для бизнеса',
      advantages: ['Онлайн-открытие счёта', '0₽ комиссии первые месяцы', 'Бесплатная бухгалтерия'],
      caseStudy: 'Помогли открыть 10 000+ счетов за месяц'
    },
    {
      name: 'Mango Office',
      logo: '📞',
      description: 'Лидер виртуальной телефонии',
      specialization: 'Облачные АТС и колл-центры',
      advantages: ['Запись звонков', 'Интеграция с CRM', 'Мобильные приложения'],
      caseStudy: '50 000+ подключённых компаний'
    },
    {
      name: 'Битрикс24',
      logo: '💼',
      description: 'Платформа для совместной работы',
      specialization: 'CRM и автоматизация бизнеса',
      advantages: ['Бесплатный тариф навсегда', 'Интеграция 1000+ сервисов', 'Обучение и поддержка'],
      caseStudy: '12 млн компаний по всему миру'
    },
    {
      name: 'МегаФон',
      logo: '📱',
      description: 'Федеральный оператор связи',
      specialization: 'Корпоративная мобильная связь',
      advantages: ['Единый договор', 'Детализация и контроль', 'Выгодные корп. тарифы'],
      caseStudy: 'Обслуживаем 5 000+ корпоративных клиентов'
    }
  ];

  const news = [
    {
      id: 1,
      title: 'Альфа-Банк запустил акцию: 6 месяцев бесплатного обслуживания',
      date: '20 января 2026',
      badge: 'Акция',
      description: 'Откройте расчётный счёт и получите 6 месяцев обслуживания в подарок'
    },
    {
      id: 2,
      title: 'Новый партнёр: МТС подключился к платформе',
      date: '18 января 2026',
      badge: 'Новости',
      description: 'Теперь доступны корпоративные тарифы МТС со скидкой до 30%'
    },
    {
      id: 3,
      title: 'Специальное предложение от Битрикс24: расширенный тариф бесплатно',
      date: '15 января 2026',
      badge: 'Акция',
      description: 'При подключении через нас — подарок на 50 000 рублей'
    }
  ];

  const faq = [
    {
      question: 'Как зарегистрироваться на платформе?',
      answer: 'Нажмите кнопку "Регистрация" в шапке сайта, заполните форму с контактными данными. После подтверждения email вы получите доступ в личный кабинет.'
    },
    {
      question: 'Платформа берёт комиссию за услуги?',
      answer: 'Нет, все услуги предоставляются бесплатно. Вы платите только партнёрам напрямую по их тарифам, часто со скидкой до 50%.'
    },
    {
      question: 'Как быстро подключаются услуги?',
      answer: 'Большинство услуг подключается онлайн за 5-15 минут. Расчётные счета — до 1 рабочего дня, телефония — моментально.'
    },
    {
      question: 'Можно ли отказаться от услуги?',
      answer: 'Да, вы можете отменить подключение в любой момент через личный кабинет. Без штрафов и скрытых платежей.'
    },
    {
      question: 'Какая поддержка предоставляется?',
      answer: 'Наша служба поддержки работает 24/7. Вы можете связаться по телефону 8 800 555-35-35, в чате или написать на info@kupecplus.ru'
    }
  ];

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
                <p className="text-xs text-gray-600">Агрегатор бизнес-услуг</p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#categories" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Категории</a>
              <a href="#partners" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Партнёры</a>
              <a href="#news" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Новости</a>
              <a href="#faq" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">FAQ</a>
              <a href="#contacts" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Контакты</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden md:flex border-orange-300 text-orange-600 hover:bg-orange-50">
                <Icon name="User" className="mr-2" size={18} />
                Войти
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 shadow-lg">
                <Icon name="UserPlus" className="mr-2" size={18} />
                Регистрация
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-white text-orange-600 border-0 text-base px-6 py-2 shadow-lg">
              🚀 Агрегатор лучших решений для бизнеса
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
              Купец в плюсе —<br />
              все бизнес-услуги в одном месте
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
              Банковские счета, телефония, CRM-системы, мобильная связь — подключайте лучшие сервисы от проверенных партнёров с выгодой до 100%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-10 py-7 shadow-xl">
                <Icon name="Rocket" className="mr-2" size={22} />
                Подобрать решение
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7 backdrop-blur">
                <Icon name="Play" className="mr-2" size={22} />
                Смотреть видео
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">150+</div>
                <div className="text-sm opacity-90">Партнёров</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">50К+</div>
                <div className="text-sm opacity-90">Клиентов</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Бесплатно</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-90">Поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Почему выбирают нашу платформу</h3>
            <p className="text-xl text-gray-600">Мы упрощаем подключение бизнес-услуг</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">Быстро и просто</CardTitle>
                <CardDescription className="text-base">
                  Подключение любой услуги онлайн за 5-15 минут без визитов в офис и бумажной волокиты
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <Icon name="Percent" className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">Выгодные условия</CardTitle>
                <CardDescription className="text-base">
                  Эксклюзивные скидки от партнёров до 100%. Экономия на каждой услуге от 1 000 до 50 000 рублей
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                  <Icon name="Shield" className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">Надёжность</CardTitle>
                <CardDescription className="text-base">
                  Работаем только с проверенными партнёрами. Все услуги сертифицированы и безопасны
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="categories" className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Категории услуг</h3>
            <p className="text-xl text-gray-600">Выберите нужное направление для вашего бизнеса</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="border-2 hover:border-orange-400 transition-all hover:shadow-2xl cursor-pointer group"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon name={cat.icon as any} className="text-white" size={40} />
                  </div>
                  <CardTitle className="text-xl mb-2">{cat.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{cat.count} предложений</Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mb-8">
            <h4 className="text-3xl font-bold text-gray-800 mb-6">
              {selectedCategory === 'all' ? 'Популярные предложения' : categories.find(c => c.id === selectedCategory)?.name}
            </h4>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <Card
                key={product.id}
                className="border-2 hover:border-orange-400 transition-all hover:shadow-2xl group relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {product.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className={`${
                      product.badge === 'Хит продаж' ? 'bg-red-500' :
                      product.badge === 'Новинка' ? 'bg-green-500' :
                      product.badge === 'Акция' ? 'bg-purple-500' :
                      'bg-orange-500'
                    } text-white border-0 shadow-lg font-semibold`}>
                      {product.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{product.partnerLogo}</div>
                    <div>
                      <div className="text-sm text-gray-600">Партнёр</div>
                      <div className="font-bold text-gray-800">{product.partner}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                  <CardDescription className="text-base">{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                      ))}
                      <span className="text-sm text-gray-600">({product.reviews} отзывов)</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-bold text-green-600">{product.price}</span>
                      {product.oldPrice && <span className="text-lg text-gray-400 line-through mb-2">{product.oldPrice}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <Icon name="TrendingDown" size={16} />
                      Экономия {product.oldPrice}
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

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 shadow-md">
                    <Icon name="ShoppingCart" className="mr-2" size={18} />
                    Подключить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="partners" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Наши партнёры</h3>
            <p className="text-xl text-gray-600">Работаем с лидерами рынка</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((partner, idx) => (
              <Card key={idx} className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{partner.logo}</div>
                    <div>
                      <CardTitle className="text-2xl">{partner.name}</CardTitle>
                      <CardDescription className="text-base">{partner.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="mb-4 w-fit bg-orange-100 text-orange-700 border-orange-300">
                    {partner.specialization}
                  </Badge>
                  
                  <div className="space-y-3 mb-4">
                    <div className="font-semibold text-gray-800">Преимущества:</div>
                    {partner.advantages.map((adv, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        {adv}
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start gap-2">
                      <Icon name="TrendingUp" className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="font-semibold text-gray-800 mb-1">Кейс:</div>
                        <div className="text-sm text-gray-700">{partner.caseStudy}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="py-16 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Новости и акции</h3>
            <p className="text-xl text-gray-600">Актуальные предложения от партнёров</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={item.badge === 'Акция' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
                      {item.badge}
                    </Badge>
                    <span className="text-sm text-gray-600">{item.date}</span>
                  </div>
                  <CardTitle className="text-xl mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                  <Button variant="link" className="p-0 mt-3 text-orange-600">
                    Подробнее <Icon name="ArrowRight" className="ml-1" size={16} />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cabinet" className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Icon name="LayoutDashboard" className="mx-auto mb-6" size={64} />
            <h3 className="text-4xl font-bold mb-6">Личный кабинет</h3>
            <p className="text-xl mb-10 opacity-95">
              Управляйте всеми подключёнными услугами в одном месте
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardHeader>
                  <Icon name="Package" className="mx-auto mb-3" size={40} />
                  <CardTitle className="text-white">Мои подписки</CardTitle>
                  <CardDescription className="text-white/80">Управление активными услугами</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardHeader>
                  <Icon name="CreditCard" className="mx-auto mb-3" size={40} />
                  <CardTitle className="text-white">История платежей</CardTitle>
                  <CardDescription className="text-white/80">Все транзакции и чеки</CardDescription>
                </CardHeader>
              </Card>
              <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
                <CardHeader>
                  <Icon name="Settings" className="mx-auto mb-3" size={40} />
                  <CardTitle className="text-white">Настройки</CardTitle>
                  <CardDescription className="text-white/80">Профиль и безопасность</CardDescription>
                </CardHeader>
              </Card>
            </div>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7 shadow-xl">
              <Icon name="LogIn" className="mr-2" size={22} />
              Войти в кабинет
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Часто задаваемые вопросы</h3>
            <p className="text-xl text-gray-600">Ответы на популярные вопросы</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-lg font-semibold text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12 text-center bg-orange-50 rounded-2xl p-8 border-2 border-orange-200">
            <Icon name="Headphones" className="mx-auto mb-4 text-orange-600" size={48} />
            <h4 className="text-2xl font-bold text-gray-800 mb-3">Не нашли ответ?</h4>
            <p className="text-gray-700 mb-6">Наша служба поддержки работает 24/7</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
                <Icon name="Phone" className="mr-2" size={18} />
                8 800 555-35-35
              </Button>
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                <Icon name="Mail" className="mr-2" size={18} />
                info@kupecplus.ru
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Связаться с нами</h3>
            <p className="text-xl text-gray-600">Оставьте заявку и мы поможем подобрать решение</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPin" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Адрес офиса</div>
                    <div className="text-gray-700">г. Москва, ул. Бизнесовая, д. 1, офис 101</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="Phone" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Телефон горячей линии</div>
                    <div className="text-gray-700">8 800 555-35-35 (бесплатно по России)</div>
                    <div className="text-gray-700">+7 (495) 123-45-67</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="Mail" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Email</div>
                    <div className="text-gray-700">info@kupecplus.ru</div>
                    <div className="text-gray-700">support@kupecplus.ru</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="Clock" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Режим работы</div>
                    <div className="text-gray-700">Поддержка: 24/7 без выходных</div>
                    <div className="text-gray-700">Офис: Пн-Пт 9:00 - 18:00</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Заявка на консультацию</CardTitle>
                <CardDescription>Заполните форму и мы свяжемся с вами в течение 15 минут</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Ваше имя</label>
                    <Input placeholder="Иван Иванов" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Телефон</label>
                    <Input placeholder="+7 (___) ___-__-__" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input type="email" placeholder="example@mail.ru" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Интересующая услуга</label>
                    <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                      <option>Банковские услуги</option>
                      <option>Телефония</option>
                      <option>CRM-система</option>
                      <option>Мобильная связь</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Комментарий</label>
                    <Textarea placeholder="Расскажите подробнее о вашей задаче..." rows={3} />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 shadow-md text-lg py-6">
                    <Icon name="Send" className="mr-2" size={20} />
                    Отправить заявку
                  </Button>
                  <p className="text-xs text-gray-600 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              </CardContent>
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
                  <p className="text-xs text-gray-400">Агрегатор бизнес-услуг</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">Всё необходимое для эффективного развития вашего бизнеса в одном месте</p>
              <div className="flex gap-3">
                <Button size="icon" variant="outline" className="border-gray-600 hover:bg-gray-700">
                  <Icon name="MessageCircle" size={18} />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-600 hover:bg-gray-700">
                  <Icon name="Send" size={18} />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-600 hover:bg-gray-700">
                  <Icon name="AtSign" size={18} />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Услуги</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#categories" className="hover:text-white transition-colors">Банковские услуги</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">Телефония</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">CRM и автоматизация</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">Мобильные операторы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Компания</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#partners" className="hover:text-white transition-colors">Наши партнёры</a></li>
                <li><a href="#news" className="hover:text-white transition-colors">Новости и акции</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#contacts" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Поддержка</h4>
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
                  <Icon name="Clock" size={16} />
                  24/7 онлайн
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Купец в плюсе. Все права защищены. Агрегатор бизнес-услуг для малого и среднего бизнеса.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
