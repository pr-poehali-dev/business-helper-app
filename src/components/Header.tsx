import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-orange-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Icon name="Store" className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-600">Купец в плюсе</h1>
              <p className="text-xs text-gray-600">Агрегатор бизнес-услуг</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <a href="#categories" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Категории</a>
            <a href="#partners" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Партнёры</a>
            <a href="#news" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Новости</a>
            <a href="#faq" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">FAQ</a>
            <a href="#contacts" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:flex border-orange-300 text-orange-600 hover:bg-orange-50">
              <Icon name="User" className="mr-2" size={18} />
              Войти
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 shadow-lg">
              <Icon name="UserPlus" className="mr-2" size={18} />
              Регистрация
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
