import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center">
                <Icon name="Building2" size={24} />
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
  );
};

export default Footer;