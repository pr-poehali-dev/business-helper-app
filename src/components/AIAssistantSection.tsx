import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const AIAssistantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
              <Icon name="Sparkles" size={20} />
              <span className="font-semibold">Новая возможность</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-ассистент в личном кабинете
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Получайте мгновенные ответы на вопросы о наших услугах, консультации по подбору решений 
              и помощь в оформлении заявок — всё это 24/7 от умного помощника на базе ChatGPT
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="MessageSquare" className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Моментальные ответы</h3>
                  <p className="text-gray-600">Не ждите ответа от менеджера — получите консультацию прямо сейчас</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Brain" className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Умный подбор</h3>
                  <p className="text-gray-600">AI анализирует ваши потребности и предлагает оптимальные решения</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Доступен 24/7</h3>
                  <p className="text-gray-600">Работает круглосуточно, без выходных и праздников</p>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              onClick={() => navigate('/cabinet')}
            >
              <Icon name="Sparkles" className="mr-2" size={20} />
              Попробовать AI-ассистента
            </Button>
          </div>
          
          <div className="relative">
            <Card className="border-2 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="Bot" size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-white">AI-ассистент</CardTitle>
                    <CardDescription className="text-white/80">Готов ответить на ваши вопросы</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                  <p className="text-gray-800">Привет! Я AI-помощник. Чем могу помочь?</p>
                </div>
                <div className="bg-purple-600 text-white rounded-2xl rounded-tr-none p-4 ml-12">
                  <p>Какие у вас есть решения для телефонии?</p>
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                  <p className="text-gray-800">
                    У нас есть несколько решений для бизнес-телефонии: виртуальная АТС от Манго Телеком, 
                    IP-телефония Телфин и облачная АТС Ростелеком. Все с бесплатным подключением! 
                    Какое направление вас интересует?
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Icon name="Sparkles" size={16} />
                  <span>AI печатает...</span>
                </div>
              </CardContent>
            </Card>
            <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;
