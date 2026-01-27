import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface CabinetFaqContactsSectionProps {
  faq: FaqItem[];
}

const CabinetFaqContactsSection = ({ faq }: CabinetFaqContactsSectionProps) => {
  const [cabinetDialogOpen, setCabinetDialogOpen] = useState(false);

  const handleCabinetClick = () => {
    setCabinetDialogOpen(true);
  };

  return (
    <>
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
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7 shadow-xl"
              onClick={handleCabinetClick}
            >
              <Icon name="LogIn" className="mr-2" size={22} />
              Войти в кабинет
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={cabinetDialogOpen} onOpenChange={setCabinetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Личный кабинет</DialogTitle>
            <DialogDescription>
              Функционал личного кабинета находится в разработке
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="LayoutDashboard" className="text-purple-600" size={40} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Скоро будет доступно!</h3>
            <p className="text-gray-600 mb-6">
              Мы работаем над созданием удобного личного кабинета для управления вашими услугами.
            </p>
            <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Icon name="Check" className="text-green-500" size={20} />
                <span className="text-sm text-gray-700">Управление подписками</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" className="text-green-500" size={20} />
                <span className="text-sm text-gray-700">История платежей и счета</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" className="text-green-500" size={20} />
                <span className="text-sm text-gray-700">Настройки профиля</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Check" className="text-green-500" size={20} />
                <span className="text-sm text-gray-700">Техподдержка 24/7</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Чтобы узнать о запуске первыми, оставьте заявку в разделе "Связаться с нами"
            </p>
          </div>
          <Button 
            onClick={() => setCabinetDialogOpen(false)} 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Понятно
          </Button>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default CabinetFaqContactsSection;