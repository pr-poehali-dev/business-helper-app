import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
}

const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';

const AdminPanel = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: 'Package',
    features: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки услуг');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Ошибка при загрузке услуг:', error);
      alert('Не удалось загрузить услуги');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      icon: 'Package',
      features: ''
    });
    setEditingService(null);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          icon: formData.icon,
          features: formData.features.split('\n').filter(f => f.trim())
        })
      });
      
      if (!response.ok) throw new Error('Ошибка при добавлении услуги');
      
      await loadServices();
      setAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка при добавлении услуги:', error);
      alert('Не удалось добавить услугу');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingService.id,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          icon: formData.icon,
          features: formData.features.split('\n').filter(f => f.trim())
        })
      });
      
      if (!response.ok) throw new Error('Ошибка при обновлении услуги');
      
      await loadServices();
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error('Ошибка при обновлении услуги:', error);
      alert('Не удалось обновить услугу');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return;
    
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Ошибка при удалении услуги');
      
      await loadServices();
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      alert('Не удалось удалить услугу');
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      icon: service.icon,
      features: service.features.join('\n')
    });
  };

  const iconOptions = ['Wifi', 'Tv', 'Phone', 'Shield', 'Smartphone', 'Package', 'Zap', 'Globe', 'Video', 'Music'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
              <p className="text-gray-600">Управление услугами платформы</p>
            </div>
            
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                  <Icon name="Plus" className="mr-2" size={18} />
                  Добавить услугу
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Добавить новую услугу</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о новой услуге
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddService} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название услуги</Label>
                    <Input 
                      id="title" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Интернет" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Input 
                      id="description" 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Высокоскоростной интернет" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена</Label>
                    <Input 
                      id="price" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="500 ₽/мес" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Иконка</Label>
                    <select
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="features">Особенности (каждая с новой строки)</Label>
                    <textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      placeholder="До 1 Гбит/с&#10;Безлимитный трафик&#10;Статический IP"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Icon name="Plus" className="mr-2" size={18} />
                    Добавить услугу
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
              <p className="text-gray-600">Загрузка услуг...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="relative hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <Icon name={service.icon} className="text-blue-600" size={24} />
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={editingService?.id === service.id} onOpenChange={(open) => !open && setEditingService(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditDialog(service)}
                              >
                                <Icon name="Edit" size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Редактировать услугу</DialogTitle>
                                <DialogDescription>
                                  Внесите изменения в информацию об услуге
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditService} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-title">Название услуги</Label>
                                  <Input 
                                    id="edit-title" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Описание</Label>
                                  <Input 
                                    id="edit-description" 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-price">Цена</Label>
                                  <Input 
                                    id="edit-price" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-icon">Иконка</Label>
                                  <select
                                    id="edit-icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    {iconOptions.map(icon => (
                                      <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-features">Особенности (каждая с новой строки)</Label>
                                  <textarea
                                    id="edit-features"
                                    value={formData.features}
                                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                  />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                  <Icon name="Save" className="mr-2" size={18} />
                                  Сохранить изменения
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-600">
                              <Icon name="Check" className="text-green-500 mr-2 flex-shrink-0" size={16} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {services.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="Package" className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет услуг</h3>
                  <p className="text-gray-500 mb-4">Добавьте первую услугу для отображения</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
