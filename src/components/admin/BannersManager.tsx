import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  startDate: string;
  endDate: string;
  priority: number;
  active: boolean;
  clicks: number;
  impressions: number;
}

const BannersManager = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Баннер Альфа-Банк',
      imageUrl: 'https://via.placeholder.com/1200x200',
      linkUrl: 'https://alfabank.ru',
      position: 'top',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      priority: 10,
      active: true,
      clicks: 1234,
      impressions: 45678
    }
  ]);

  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 'top' as const,
    startDate: '',
    endDate: '',
    priority: 5,
    active: true
  });

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.imageUrl || !newBanner.linkUrl) {
      alert('Заполните все обязательные поля');
      return;
    }

    const banner: Banner = {
      id: Date.now().toString(),
      ...newBanner,
      clicks: 0,
      impressions: 0
    };

    setBanners([...banners, banner]);
    setNewBanner({
      title: '',
      imageUrl: '',
      linkUrl: '',
      position: 'top',
      startDate: '',
      endDate: '',
      priority: 5,
      active: true
    });
    setIsAddingBanner(false);
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ));
  };

  const deleteBanner = (id: string) => {
    if (confirm('Удалить этот баннер?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление баннерами</h2>
          <p className="text-gray-600">Создавайте и управляйте рекламными баннерами</p>
        </div>
        <Button onClick={() => setIsAddingBanner(!isAddingBanner)}>
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить баннер
        </Button>
      </div>

      {isAddingBanner && (
        <Card>
          <CardHeader>
            <CardTitle>Новый баннер</CardTitle>
            <CardDescription>Заполните информацию о баннере</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  placeholder="Баннер Альфа-Банк"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Позиция</Label>
                <Select
                  value={newBanner.position}
                  onValueChange={(value: 'top' | 'middle' | 'bottom' | 'sidebar') => setNewBanner({ ...newBanner, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Верх страницы</SelectItem>
                    <SelectItem value="middle">Середина страницы</SelectItem>
                    <SelectItem value="bottom">Низ страницы</SelectItem>
                    <SelectItem value="sidebar">Боковая панель</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL изображения *</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/banner.jpg"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL ссылки *</Label>
                <Input
                  id="linkUrl"
                  placeholder="https://partner.com"
                  value={newBanner.linkUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Дата начала</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newBanner.startDate}
                  onChange={(e) => setNewBanner({ ...newBanner, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Дата окончания</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newBanner.endDate}
                  onChange={(e) => setNewBanner({ ...newBanner, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={newBanner.priority}
                  onChange={(e) => setNewBanner({ ...newBanner, priority: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newBanner.active}
                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, active: checked })}
                />
                <Label htmlFor="active">Активен</Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddingBanner(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddBanner}>
                Сохранить баннер
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-48 h-24 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{banner.title}</h3>
                      <p className="text-sm text-gray-600">{banner.linkUrl}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleBannerStatus(banner.id)}
                      >
                        {banner.active ? 'Отключить' : 'Включить'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBanner(banner.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Позиция:</span>
                      <p className="font-medium">
                        {banner.position === 'top' && 'Верх'}
                        {banner.position === 'middle' && 'Середина'}
                        {banner.position === 'bottom' && 'Низ'}
                        {banner.position === 'sidebar' && 'Боковая панель'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Показы:</span>
                      <p className="font-medium">{banner.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Клики:</span>
                      <p className="font-medium">{banner.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">CTR:</span>
                      <p className="font-medium">
                        {banner.impressions > 0 
                          ? ((banner.clicks / banner.impressions) * 100).toFixed(2) 
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {banner.startDate && banner.endDate && (
                    <p className="text-sm text-gray-600 mt-2">
                      Период: {banner.startDate} — {banner.endDate}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && !isAddingBanner && (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Нет баннеров</h3>
            <p className="text-gray-600 mb-4">Создайте первый баннер для размещения рекламы</p>
            <Button onClick={() => setIsAddingBanner(true)}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить баннер
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BannersManager;