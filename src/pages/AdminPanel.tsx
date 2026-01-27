import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import ServiceFormDialog from '@/components/admin/ServiceFormDialog';
import ServiceCard from '@/components/admin/ServiceCard';
import OrdersTable from '@/components/admin/OrdersTable';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  iconUrl?: string;
  features: string[];
}

const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: 'Package',
    iconUrl: undefined as string | undefined,
    features: ''
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadServices();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadServices();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setServices([]);
  };

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
      iconUrl: undefined,
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
          iconUrl: formData.iconUrl,
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
          iconUrl: formData.iconUrl,
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
      iconUrl: service.iconUrl,
      features: service.features.join('\n')
    });
  };

  const iconOptions = ['Wifi', 'Tv', 'Phone', 'Shield', 'Smartphone', 'Package', 'Zap', 'Globe', 'Video', 'Music'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
              <p className="text-gray-600">Управление услугами и заявками</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти
              </Button>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                    <Icon name="Plus" className="mr-2" size={18} />
                    Добавить услугу
                  </Button>
                </DialogTrigger>
                <ServiceFormDialog
                  open={addDialogOpen}
                  onOpenChange={setAddDialogOpen}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleAddService}
                  editingService={null}
                  iconOptions={iconOptions}
                />
              </Dialog>
            </div>
          </div>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('services')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'services'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name="Package" className="inline mr-2" size={18} />
                Услуги ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name="ClipboardList" className="inline mr-2" size={18} />
                Заявки
              </button>
            </nav>
          </div>

          {activeTab === 'services' && loading ? (
            <div className="text-center py-16">
              <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
              <p className="text-gray-600">Загрузка услуг...</p>
            </div>
          ) : activeTab === 'services' ? (
            <>
              <Dialog open={editingService !== null} onOpenChange={(open) => !open && setEditingService(null)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onEdit={openEditDialog}
                      onDelete={handleDeleteService}
                    />
                  ))}
                </div>
                <ServiceFormDialog
                  open={editingService !== null}
                  onOpenChange={(open) => !open && setEditingService(null)}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleEditService}
                  editingService={editingService}
                  iconOptions={iconOptions}
                />
              </Dialog>

              {services.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="Package" className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет услуг</h3>
                  <p className="text-gray-500 mb-4">Добавьте первую услугу для отображения</p>
                </div>
              )}
            </>
          ) : (
            <OrdersTable />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;