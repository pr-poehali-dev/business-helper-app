import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-blue-600 flex items-center justify-center">
              <Icon name="Building2" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Купец в плюсе</h1>
              <p className="text-xs text-gray-500">Агрегатор бизнес-услуг</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#categories" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Услуги</a>
            <a href="#partners" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Партнёры</a>
            <a href="#news" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Новости</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQ</a>
            <a href="#contacts" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50">
              <Icon name="User" className="mr-2" size={18} />
              Войти
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
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