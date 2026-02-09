import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

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

const PARTNER_OFFERS_API_URL = 'https://functions.poehali.dev/9b132aca-4d30-44b8-a681-725b7d71264d';

const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [partnerOffers, setPartnerOffers] = useState<PartnerOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartnerOffers();
  }, []);

  const loadPartnerOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(PARTNER_OFFERS_API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки предложений');
      const data = await response.json();
      setPartnerOffers(data);
    } catch (error) {
      console.error('Ошибка при загрузке предложений:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Все предложения', icon: 'LayoutGrid', color: 'from-gray-500 to-slate-600' },
    { id: 'bank', name: 'Банковские услуги', icon: 'Building2', color: 'from-blue-500 to-cyan-600' },
    { id: 'phone', name: 'Телефония', icon: 'Phone', color: 'from-purple-500 to-pink-600' },
    { id: 'crm', name: 'CRM и автоматизация', icon: 'BarChart3', color: 'from-orange-500 to-red-600' },
    { id: 'mobile', name: 'Мобильные операторы', icon: 'Smartphone', color: 'from-green-500 to-emerald-600' }
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? partnerOffers 
    : partnerOffers.filter(offer => offer.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Заголовок страницы */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Каталог популярных предложений</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Выберите выгодные решения для вашего бизнеса от проверенных партнёров
          </p>
        </div>

        {/* Фильтры по категориям */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white border-0`
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              } transition-all`}
            >
              <Icon name={category.icon} className="mr-2" size={18} />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Список предложений */}
        {loading ? (
          <div className="text-center py-20">
            <Icon name="Loader2" className="animate-spin mx-auto text-blue-600" size={48} />
            <p className="text-gray-600 mt-4">Загрузка предложений...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Package" className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600">Предложений не найдено</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200 flex flex-col"
              >
                {/* Шапка карточки */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{offer.partnerLogo}</div>
                    <div>
                      <p className="text-sm text-gray-500">{offer.partner}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="text-sm font-semibold text-gray-700">{offer.rating}</span>
                        <span className="text-xs text-gray-500">({offer.reviews})</span>
                      </div>
                    </div>
                  </div>
                  {offer.oldPrice && (
                    <Badge variant="destructive" className="bg-red-500">Акция</Badge>
                  )}
                </div>

                {/* Название и описание */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{offer.description}</p>

                {/* Преимущества */}
                <div className="space-y-2 mb-5">
                  {offer.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Цена и кнопка */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{offer.price}</p>
                      {offer.oldPrice && (
                        <p className="text-sm text-gray-500 line-through">{offer.oldPrice}</p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Icon name="ShoppingCart" className="mr-2" size={18} />
                    Подключить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CatalogPage;