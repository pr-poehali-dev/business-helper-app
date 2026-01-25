import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/0a6ed630-dcfc-40e7-9cb7-7388d47c8c38';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

const AdminLoginForm = ({ onLoginSuccess }: AdminLoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Ошибка авторизации');
        return;
      }

      localStorage.setItem('adminAuth', 'true');
      onLoginSuccess();
    } catch (error) {
      setLoginError('Ошибка соединения с сервером');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Lock" className="text-blue-600" size={32} />
        </div>
        <CardTitle className="text-2xl text-center">Вход в панель администратора</CardTitle>
        <CardDescription className="text-center">
          Введите логин и пароль для доступа
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username">Логин</Label>
            <Input 
              id="admin-username" 
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              placeholder="admin" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Пароль</Label>
            <div className="relative">
              <Input 
                id="admin-password" 
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="••••••••" 
                className="pr-10"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {loginError}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" className="mr-2" size={18} />
                Войти
              </>
            )}
          </Button>
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Логин по умолчанию: <strong>admin</strong></p>
            <p>Пароль по умолчанию: <strong>admin123</strong></p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLoginForm;