import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  specialization: string;
  website: string;
  advantages: string[];
  caseStudy: string;
  featured: boolean;
}

const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Альфа-Банк',
      logo: '🏦',
      description: 'Крупнейший частный банк России',
      specialization: 'Банковские услуги для бизнеса',
      website: 'https://alfabank.ru',
      advantages: ['Онлайн-открытие счёта', '0₽ комиссии первые месяцы', 'Бесплатная бухгалтерия'],
      caseStudy: 'Помогли открыть 10 000+ счетов за месяц',
      featured: true
    }
  ]);

  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    logo: '',
    description: '',
    specialization: '',
    website: '',
    advantages: '',
    caseStudy: '',
    featured: false
  });

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.description) {
      alert('Заполните обязательные поля');
      return;
    }

    const partner: Partner = {
      id: Date.now().toString(),
      name: newPartner.name,
      logo: newPartner.logo || '🏢',
      description: newPartner.description,
      specialization: newPartner.specialization,
      website: newPartner.website,
      advantages: newPartner.advantages.split('\n').filter(a => a.trim()),
      caseStudy: newPartner.caseStudy,
      featured: newPartner.featured
    };

    setPartners([...partners, partner]);
    setNewPartner({
      name: '',
      logo: '',
      description: '',
      specialization: '',
      website: '',
      advantages: '',
      caseStudy: '',
      featured: false
    });
    setIsAddingPartner(false);
  };

  const toggleFeatured = (id: string) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  const deletePartner = (id: string) => {
    if (confirm('Удалить этого партнера?')) {
      setPartners(partners.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление партнерами</h2>
          <p className="text-gray-600">Добавляйте и редактируйте информацию о партнерах</p>
        </div>
        <Button onClick={() => setIsAddingPartner(!isAddingPartner)}>
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить партнера
        </Button>
      </div>

      {isAddingPartner && (
        <Card>
          <CardHeader>
            <CardTitle>Новый партнер</CardTitle>
            <CardDescription>Заполните информацию о партнере</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название компании *</Label>
                <Input
                  id="name"
                  placeholder="Альфа-Банк"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Логотип (emoji или URL)</Label>
                <Input
                  id="logo"
                  placeholder="🏦"
                  value={newPartner.logo}
                  onChange={(e) => setNewPartner({ ...newPartner, logo: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  placeholder="Крупнейший частный банк России"
                  value={newPartner.description}
                  onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Специализация</Label>
                <Input
                  id="specialization"
                  placeholder="Банковские услуги для бизнеса"
                  value={newPartner.specialization}
                  onChange={(e) => setNewPartner({ ...newPartner, specialization: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Веб-сайт</Label>
                <Input
                  id="website"
                  placeholder="https://partner.com"
                  value={newPartner.website}
                  onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="advantages">Преимущества (каждое с новой строки)</Label>
                <Textarea
                  id="advantages"
                  placeholder="Быстрое открытие счета&#10;Низкие комиссии&#10;Поддержка 24/7"
                  rows={4}
                  value={newPartner.advantages}
                  onChange={(e) => setNewPartner({ ...newPartner, advantages: e.target.value })}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="caseStudy">Кейс / Статистика</Label>
                <Input
                  id="caseStudy"
                  placeholder="Помогли открыть 10 000+ счетов за месяц"
                  value={newPartner.caseStudy}
                  onChange={(e) => setNewPartner({ ...newPartner, caseStudy: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newPartner.featured}
                  onCheckedChange={(checked) => setNewPartner({ ...newPartner, featured: checked })}
                />
                <Label htmlFor="featured">Показывать на главной</Label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddingPartner(false)}>
                Отмена
              </Button>
              <Button onClick={handleAddPartner}>
                Сохранить партнера
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="text-6xl">{partner.logo}</div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{partner.name}</h3>
                      <p className="text-gray-600">{partner.specialization}</p>
                    </div>
                    <div className="flex gap-2">
                      {partner.featured && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          На главной
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFeatured(partner.id)}
                      >
                        {partner.featured ? 'Скрыть' : 'На главную'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePartner(partner.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{partner.description}</p>

                  {partner.advantages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Преимущества:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {partner.advantages.map((adv, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{adv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {partner.caseStudy && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Кейс:</strong> {partner.caseStudy}
                    </p>
                  )}

                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {partner.website}
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && !isAddingPartner && (
        <Card>
          <CardContent className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Нет партнеров</h3>
            <p className="text-gray-600 mb-4">Добавьте первого партнера в систему</p>
            <Button onClick={() => setIsAddingPartner(true)}>
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить партнера
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartnersManager;
