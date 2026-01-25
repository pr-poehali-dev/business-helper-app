import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
