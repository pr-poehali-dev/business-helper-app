import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AdvantagesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Почему выбирают нашу платформу</h3>
          <p className="text-xl text-gray-600">Мы упрощаем подключение бизнес-услуг</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
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
          <Card className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
            <CardHeader>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                <Icon name="MessageSquare" className="text-white" size={32} />
              </div>
              <CardTitle className="text-2xl">AI-ассистент</CardTitle>
              <CardDescription className="text-base">
                В личном кабинете доступен умный помощник на базе ChatGPT для консультации по услугам 24/7
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;