const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';

const services = [
  {
    title: 'Создание чат-ботов',
    description: 'Автоматизация общения с клиентами в мессенджерах и на сайте',
    price: 'от 15 000 ₽',
    icon: 'MessageSquare',
    features: [
      'Интеграция с Telegram, WhatsApp, VK',
      'Обработка заявок 24/7',
      'Подключение к CRM',
      'Аналитика диалогов'
    ]
  },
  {
    title: 'Аренда РОПа',
    description: 'Опытный руководитель для управления вашим отделом продаж',
    price: 'от 80 000 ₽/мес',
    icon: 'Users',
    features: [
      'Построение отдела продаж с нуля',
      'Обучение менеджеров',
      'Внедрение CRM и автоматизации',
      'Прозрачная отчётность'
    ]
  },
  {
    title: 'Разработка сайтов',
    description: 'Современные сайты для вашего бизнеса под ключ',
    price: 'от 25 000 ₽',
    icon: 'Globe',
    features: [
      'Адаптивный дизайн',
      'SEO-оптимизация',
      'Интеграция с аналитикой',
      'Быстрая загрузка'
    ]
  },
  {
    title: 'Контекстная реклама',
    description: 'Привлечение клиентов через Яндекс.Директ и Google Ads',
    price: 'от 20 000 ₽/мес',
    icon: 'Target',
    features: [
      'Анализ конкурентов',
      'Подбор ключевых слов',
      'Оптимизация бюджета',
      'Ежемесячные отчёты'
    ]
  },
  {
    title: 'Аутсорсинг бухгалтерии',
    description: 'Ведение бухгалтерского и налогового учёта под ключ',
    price: 'от 10 000 ₽/мес',
    icon: 'Calculator',
    features: [
      'Сдача отчётности в срок',
      'Консультации по налогам',
      'Работа с банками',
      'Учёт на УСН, ОСНО, патенте'
    ]
  },
  {
    title: 'SMM-продвижение',
    description: 'Управление социальными сетями и создание контента',
    price: 'от 30 000 ₽/мес',
    icon: 'Share2',
    features: [
      'Контент-план на месяц',
      'Дизайн постов',
      'Таргетированная реклама',
      'Анализ эффективности'
    ]
  }
];

async function deleteAllServices() {
  console.log('Удаляем существующие услуги...');
  
  const response = await fetch(API_URL);
  const existingServices = await response.json();
  
  for (const service of existingServices) {
    await fetch(`${API_URL}?id=${service.id}`, {
      method: 'DELETE'
    });
    console.log(`Удалена услуга: ${service.title}`);
  }
}

async function addServices() {
  console.log('\nДобавляем новые услуги...');
  
  for (const service of services) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(service)
    });
    
    if (response.ok) {
      console.log(`✓ Добавлена услуга: ${service.title}`);
    } else {
      console.error(`✗ Ошибка при добавлении: ${service.title}`);
    }
  }
}

async function main() {
  try {
    await deleteAllServices();
    await addServices();
    console.log('\n✓ Готово! Все услуги обновлены.');
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

main();
