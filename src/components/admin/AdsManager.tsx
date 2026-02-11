import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Ad {
  id: string;
  partner: string;
  title: string;
  description: string;
  category: 'bank' | 'phone' | 'crm' | 'mobile' | 'other';
  price: string;
  oldPrice: string;
  features: string[];
  linkUrl: string;
  featured: boolean;
  active: boolean;
}

const AdsManager = () => {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: '1',
      partner: 'Альфа-Банк',
      title: 'Расчётный счёт для ООО и ИП',
      description: 'Открытие расчётного счёта онлайн. Бесплатное обслуживание 3 месяца',
      category: 'bank',
      price: '0 ₽',
      oldPrice: '1 990 ₽/мес',
      features: ['Открытие за 1 день', 'Бесплатный интернет-банк', 'До 50 платежей без комиссии'],
      linkUrl: 'https://alfabank.ru/rko',
      featured: true,
      active: true
    }
  ]);

  const [isAddingAd, setIsAddingAd] = useState(false);
  const [newAd, setNewAd] = useState({
    partner: '',
    title: '',
    description: '',
    category: 'bank' as const,
    price: '',
    oldPrice: '',
    features: '',
    linkUrl: '',
    featured: false,
    active: true
  });

  const handleAddAd = () => {
    if (!newAd.partner || !newAd.title || !newAd.description) {
      alert('Заполните обязательные поля');
      return;
    }

    const ad: Ad = {
      id: Date.now().toString(),
      partner: newAd.partner,
      title: newAd.title,
      description: newAd.description,
      category: newAd.category,
      price: newAd.price,
      oldPrice: newAd.oldPrice,
      features: newAd.features.split('\n').filter(f => f.trim()),
      linkUrl: newAd.linkUrl,
      featured: newAd.featured,
      active: newAd.active
    };

    setAds([...ads, ad]);
    setNewAd({
      partner: '',
      title: '',
      description: '',
      category: 'bank',
      price: '',
      oldPrice: '',
      features: '',
      linkUrl: '',
      featured: false,
      active: true
    });
    setIsAddingAd(false);
  };

  const toggleAdStatus = (id: string) => {
    setAds(ads.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const toggleFeatured = (id: string) => {
    setAds(ads.map(a => 
      a.id === id ? { ...a, featured: !a.featured } : a
    ));
  };

  const deleteAd = (id: string) => {
    if (confirm('Удалить это объявление?')) {
      setAds(ads.filter(a => a.id !== id));
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      bank: 'Банки',
      phone: 'Телефония',
      crm: 'CRM-системы',
      mobile: 'Мобильная связь',
      other: 'Другое'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление объявлениями</h2>
          <p className="text-gray-600">Создавайте рекламные предложения для каталога</p>
        </div>
        <Button onClick={() => setIsAddingAd(!isAddingAd)}>
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить объявление
        </Button>
      </div>

      {isAddingAd && (
        <Card>
          <CardHeader>
            <CardTitle>Новое объявление</CardTitle>
            <CardDescription>Заполните информацию о предложении</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner">Партнер *</Label>
                <Input
                  id="partner"
                  placeholder="Альфа-Банк"
                  value={newAd.partner}
                  onChange={(e) => setNewAd({ ...newAd, partner: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={newAd.category}
                  onValueChange={(value: 'bank' | 'phone' | 'crm' | 'mobile' | 'other') => setNewAd({ ...newAd, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Банки</SelectItem>
                    <SelectItem value="phone">Телефония</SelectItem>
                    <SelectItem value="crm">CRM-системы</SelectItem>
                    <SelectItem value="mobile">Мобильная связь</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Название предложения *</Label>
                <Input
                  id="title"
                  placeholder="Расчётный счёт для ООО и ИП"
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  placeholder="Открытие расчётного счёта онлайн. Бесплатное обслуживание 3 месяца"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  placeholder="0 ₽"
                  value={newAd.price}
                  onChange={(e) => setNewAd({ ...newAd, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oldPrice">Старая цена</Label>
                <Input
                  id="oldPrice"
                  placeholder="1 990 ₽/мес"
                  value={newAd.oldPrice}
                  onChange={(e) => setNewAd({ ...newAd, oldPrice: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="features">Особенности (каждая с новой строки)</Label>
                <Textarea
                  id="features"
                  placeholder="Открытие за 1 день&#10;Бесплатный интернет-банк&#10;До 50 платежей без комиссии"
                  rows={4}
                  value={newAd.features}
                  onChange={(e) => setNewAd({ ...newAd, features: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="linkUrl">URL ссылки</Label>
                <Input
                  id="linkUrl"
                  placeholder="https://partner.com/offer"
                  value={newAd.linkUrl}
                  onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newAd.featured}
                  onCheckedChange={(checked) => setNewAd({ ...newAd, featured: checked })}
                />
                <Label htmlFor="featured">Показывать на главной</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newAd.active}
                  onCheckedChange={(checked) => setNewAd({ ...newAd, active: checked })}
                />
                <Label htmlFor="active">Активно</Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddingAd(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddAd}>
                Сохранить объявление
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{ad.title}</h3>
                    {ad.featured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        На главной
                      </span>
                    )}
                    {!ad.active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Неактивно
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {ad.partner} · {getCategoryLabel(ad.category)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatured(ad.id)}
                  >
                    {ad.featured ? 'Скрыть' : 'На главную'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAdStatus(ad.id)}
                  >
                    {ad.active ? 'Отключить' : 'Включить'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAd(ad.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{ad.description}</p>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-blue-600">{ad.price}</span>
                {ad.oldPrice && (
                  <span className="text-gray-500 line-through">{ad.oldPrice}</span>
                )}
              </div>

              {ad.features.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {ad.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{feature}</li>
                  ))}
                </ul>
              )}

              {ad.linkUrl && (
                <a
                  href={ad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {ad.linkUrl}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {ads.length === 0 && !isAddingAd && (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Нет объявлений</h3>
            <p className="text-gray-600 mb-4">Создайте первое рекламное объявление</p>
            <Button onClick={() => setIsAddingAd(true)}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить объявление
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdsManager;
