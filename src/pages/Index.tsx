import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AdvantagesSection from '@/components/AdvantagesSection';
import AIAssistantSection from '@/components/AIAssistantSection';
import ServicesSection from '@/components/ServicesSection';

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



const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';


const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    loadServices();
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



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <AdvantagesSection />
      <AIAssistantSection />
      <ServicesSection services={services} loading={loadingServices} />
      <NewsPreviewSection />
      <PartnersNewsSection partners={partners} news={news} />
      <CabinetFaqContactsSection faq={faq} />
      <Footer />
    </div>
  );
};

export default Index;