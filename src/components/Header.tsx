import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Header = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('clientUser');
    setIsLoggedIn(!!userData);
  }, []);

  const handleCabinetClick = () => {
    navigate('/cabinet');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cabinet');
    setLoginOpen(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/cabinet');
    setRegisterOpen(false);
  };

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
            <a href="/news" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Новости</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">FAQ</a>
            <a href="#contacts" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">Контакты</a>
          </nav>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button onClick={handleCabinetClick} variant="outline" className="hidden md:flex border-blue-300 text-blue-700 hover:bg-blue-50">
                <Icon name="User" className="mr-2" size={18} />
                Кабинет
              </Button>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hidden md:flex border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Icon name="User" className="mr-2" size={18} />
                    Войти
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Вход в личный кабинет</DialogTitle>
                  <DialogDescription>
                    Войдите для управления подключенными услугами
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="mail@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" required />
                  </div>
                  <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-blue-600 hover:underline">Забыли пароль?</a>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Icon name="LogIn" className="mr-2" size={18} />
                    Войти
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <button
                      type="button"
                      onClick={() => { setLoginOpen(false); setRegisterOpen(true); }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Зарегистрироваться
                    </button>
                  </div>
                </form>
              </DialogContent>
              </Dialog>
            )}

            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Icon name="UserPlus" className="mr-2" size={18} />
                  Регистрация
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Регистрация</DialogTitle>
                  <DialogDescription>
                    Создайте аккаунт для доступа ко всем услугам платформы
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Имя</Label>
                    <Input id="register-name" type="text" placeholder="Иван Иванов" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-company">Компания</Label>
                    <Input id="register-company" type="text" placeholder="ООО 'Компания'" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="mail@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Телефон</Label>
                    <Input id="register-phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input id="register-password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Icon name="UserPlus" className="mr-2" size={18} />
                    Зарегистрироваться
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Уже есть аккаунт?{' '}
                    <button
                      type="button"
                      onClick={() => { setRegisterOpen(false); setLoginOpen(true); }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Войти
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;