import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600 text-white border-0 text-sm px-4 py-1">
                Агрегатор бизнес-услуг
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Все услуги для бизнеса в одной платформе
              </h2>
              <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                Расчётные счета, телефония, CRM-системы, корпоративная связь — подключайте проверенные сервисы с выгодными условиями
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  <Icon name="Search" className="mr-2" size={20} />
                  Подобрать решение
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  <Icon name="Phone" className="mr-2" size={20} />
                  Получить консультацию
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold mb-1">150+</div>
                <div className="text-sm text-blue-100">Партнёров</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold mb-1">50 000+</div>
                <div className="text-sm text-blue-100">Клиентов</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold mb-1">15 000+</div>
                <div className="text-sm text-blue-100">Подключений</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-sm text-blue-100">Поддержка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;