import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AdvantagesSection from '@/components/AdvantagesSection';
import AIAssistantSection from '@/components/AIAssistantSection';
import ServicesSection from '@/components/ServicesSection';
import CategoriesSection from '@/components/CategoriesSection';
import NewsPreviewSection from '@/components/NewsPreviewSection';
import PartnersNewsSection from '@/components/PartnersNewsSection';
import CabinetFaqContactsSection from '@/components/CabinetFaqContactsSection';
import Footer from '@/components/Footer';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  iconUrl?: string;
  features: string[];
}

interface PartnerOffer {
  id: number;
  category: string;
  partner: string;
  partnerLogo: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  features: string[];
  rating: number;
  reviews: number;
}

const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';
const PARTNER_OFFERS_API_URL = 'https://functions.poehali.dev/9b132aca-4d30-44b8-a681-725b7d71264d';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState<Service[]>([]);
  const [partnerOffers, setPartnerOffers] = useState<PartnerOffer[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    loadServices();
    loadPartnerOffers();
  }, []);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки услуг');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Ошибка при загрузке услуг:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadPartnerOffers = async () => {
    try {
      const response = await fetch(PARTNER_OFFERS_API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки предложений');
      const data = await response.json();
      setPartnerOffers(data);
    } catch (error) {
      console.error('Ошибка при загрузке предложений:', error);
    }
  };

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
      title: 'Расчётный счёт для ООО и ИП',
      description: 'Открытие расчётного счёта онлайн. Бесплатное обслуживание 3 месяца',
      price: '0 ₽',
      oldPrice: '1 990 ₽/мес',
      features: ['Открытие за 1 день', 'Бесплатный интернет-банк', 'До 50 платежей без комиссии', 'Корпоративные карты'],
      rating: 4.8,
      reviews: 234
    },
    {
      id: 2,
      category: 'bank',
      partner: 'Сбер Бизнес',
      partnerLogo: '🏦',
      title: 'РКО для малого бизнеса',
      description: 'Расчётно-кассовое обслуживание с выгодными тарифами',
      price: '0 ₽',
      oldPrice: '990 ₽/мес',
      features: ['0₽ за открытие', 'Бесплатная бухгалтерия', 'Интеграция с 1С', 'Корпоративные карты Visa'],
      rating: 4.7,
      reviews: 412
    },
    {
      id: 3,
      category: 'bank',
      partner: 'Тинькофф Банк',
      partnerLogo: '💳',
      title: 'Интернет-эквайринг',
      description: 'Приём онлайн-платежей на сайте и в соцсетях',
      price: '0 ₽',
      oldPrice: '2 500 ₽',
      features: ['Комиссия от 2,49%', 'Защита 3D-Secure', 'API для интеграции', 'Выплаты на следующий день'],
      rating: 4.9,
      reviews: 521
    },
    {
      id: 4,
      category: 'bank',
      partner: 'МТС Банк',
      partnerLogo: '🏦',
      title: 'Зарплатный проект',
      description: 'Выплата зарплаты сотрудникам на банковские карты',
      price: '0 ₽',
      oldPrice: '1 500 ₽/мес',
      features: ['Бесплатные переводы', 'Карты за 1 день', 'Кешбэк для сотрудников', 'Личный менеджер'],
      rating: 4.6,
      reviews: 189
    },
    {
      id: 5,
      category: 'phone',
      partner: 'Манго Телеком',
      partnerLogo: '📞',
      title: 'Виртуальная АТС',
      description: 'Облачная телефония для офиса и удалённых сотрудников',
      price: '0 ₽',
      oldPrice: '3 990 ₽',
      features: ['3 номера в подарок', 'Запись разговоров 90 дней', 'Интеграция с CRM', 'Статистика и аналитика'],
      rating: 4.9,
      reviews: 312
    },
    {
      id: 6,
      category: 'phone',
      partner: 'Телфин',
      partnerLogo: '📞',
      title: 'IP-телефония для бизнеса',
      description: 'Современная телефонная связь через интернет',
      price: '0 ₽',
      oldPrice: '2 490 ₽',
      features: ['Городской номер', 'Бесплатные внутренние звонки', 'Переадресация', 'Голосовое меню IVR'],
      rating: 4.7,
      reviews: 267
    },
    {
      id: 7,
      category: 'phone',
      partner: 'Ростелеком',
      partnerLogo: '📞',
      title: 'Облачная АТС',
      description: 'Корпоративная телефония от федерального оператора',
      price: '0 ₽',
      oldPrice: '4 500 ₽',
      features: ['Номер 8-800 в подарок', 'Мобильное приложение', 'Интеграция с Битрикс24', 'SIP-телефоны в аренду'],
      rating: 4.5,
      reviews: 178
    },
    {
      id: 8,
      category: 'crm',
      partner: 'Битрикс24',
      partnerLogo: '💼',
      title: 'CRM + Задачи + Диск',
      description: 'Единое рабочее пространство для команды',
      price: '0 ₽',
      oldPrice: '11 990 ₽',
      features: ['До 12 пользователей', 'Воронка продаж', 'Email-рассылки', 'Интеграция с 1С'],
      rating: 4.8,
      reviews: 456
    },
    {
      id: 9,
      category: 'crm',
      partner: 'amoCRM',
      partnerLogo: '🎯',
      title: 'Простая CRM для продаж',
      description: 'Управление сделками и клиентской базой',
      price: '0 ₽',
      oldPrice: '5 990 ₽',
      features: ['Чат-боты для соцсетей', 'Сквозная аналитика', 'Интеграция с мессенджерами', 'Автоворонки'],
      rating: 4.9,
      reviews: 678
    },
    {
      id: 10,
      category: 'crm',
      partner: 'Мегаплан',
      partnerLogo: '💼',
      title: 'CRM и управление проектами',
      description: 'Планирование задач и контроль исполнения',
      price: '0 ₽',
      oldPrice: '7 490 ₽',
      features: ['Канбан-доски', 'Учёт рабочего времени', 'Отчёты и аналитика', 'Календарь событий'],
      rating: 4.6,
      reviews: 234
    },
    {
      id: 11,
      category: 'mobile',
      partner: 'МТС',
      partnerLogo: '📱',
      title: 'Корпоративная связь МТС',
      description: 'Выгодные тарифы для сотрудников компании',
      price: '0 ₽',
      oldPrice: '450 ₽/мес',
      features: ['Безлимит внутри сети', '50 ГБ интернета', 'Единый корпоративный номер', 'Детализация онлайн'],
      rating: 4.7,
      reviews: 389
    },
    {
      id: 12,
      category: 'mobile',
      partner: 'МегаФон',
      partnerLogo: '📱',
      title: 'Бизнес-тарифы МегаФон',
      description: 'Мобильная связь для бизнеса с поддержкой 5G',
      price: '0 ₽',
      oldPrice: '500 ₽/мес',
      features: ['Безлимит на звонки', '40 ГБ интернета', 'Роуминг по России', 'Защита от спама'],
      rating: 4.6,
      reviews: 312
    },
    {
      id: 13,
      category: 'mobile',
      partner: 'Билайн Бизнес',
      partnerLogo: '📱',
      title: 'Корпоративные тарифы',
      description: 'Выгодная связь для команды от 5 номеров',
      price: '0 ₽',
      oldPrice: '390 ₽/мес',
      features: ['Безлимитные звонки', '30 ГБ трафика', 'Единый лицевой счёт', 'Персональный менеджер'],
      rating: 4.5,
      reviews: 267
    },
    {
      id: 14,
      category: 'bank',
      partner: 'ВТБ',
      partnerLogo: '🏦',
      title: 'Факторинг для бизнеса',
      description: 'Получите деньги сразу после отгрузки товара',
      price: '0 ₽',
      oldPrice: '0 ₽',
      features: ['От 8% годовых', 'До 10 млн рублей', 'Решение за 1 день', 'Без залога и поручителей'],
      rating: 4.8,
      reviews: 156
    },
    {
      id: 15,
      category: 'crm',
      partner: 'Salesforce',
      partnerLogo: '💼',
      title: 'CRM для крупного бизнеса',
      description: 'Масштабируемая система управления продажами',
      price: '0 ₽',
      oldPrice: '25 000 ₽',
      features: ['Безлимитное хранилище', 'AI-аналитика Einstein', 'Интеграция с ERP', 'Поддержка 24/7'],
      rating: 4.9,
      reviews: 89
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
    ? partnerOffers
    : partnerOffers.filter(p => p.category === selectedCategory);

  const handleProductConnect = async (product: PartnerOffer) => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Для подключения услуги необходимо авторизоваться');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/8a91a6fa-90ea-471e-a0dc-d5e8c6ba9ce0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          serviceType: 'partner_offer',
          serviceName: product.title,
          partnerName: product.partner,
          price: product.price,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Ошибка отправки заявки');

      alert(`Заявка на подключение "${product.title}" отправлена! Наш менеджер свяжется с вами в ближайшее время.`);
      
      await fetch('https://functions.poehali.dev/5a3ca6c8-d1de-42fd-8c4c-b1ad63ce1a37', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          actionType: 'partner_offer_connect',
          details: `Подключение: ${product.title} от ${product.partner}`
        })
      });
    } catch (error) {
      console.error('Ошибка при подключении:', error);
      alert('Произошла ошибка. Попробуйте позже.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <AdvantagesSection />
      <AIAssistantSection />
      <ServicesSection services={services} loading={loadingServices} />
      <CategoriesSection
        categories={categories}
        products={filteredProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onProductConnect={handleProductConnect}
      />
      <NewsPreviewSection />
      <PartnersNewsSection partners={partners} news={news} />
      <CabinetFaqContactsSection faq={faq} />
      <Footer />
    </div>
  );
};

export default Index;