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
import PartnerOfferCard from '@/components/admin/PartnerOfferCard';
import PartnerOfferFormDialog from '@/components/admin/PartnerOfferFormDialog';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  iconUrl?: string;
  features: string[];
}

interface PartnerOffer {
  id: number;
  category: string;
  partner: string;
  partnerLogo: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  features: string[];
  rating: number;
  reviews: number;
}

const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';
const PARTNER_OFFERS_API_URL = 'https://functions.poehali.dev/9b132aca-4d30-44b8-a681-725b7d71264d';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'orders' | 'partners'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [partnerOffers, setPartnerOffers] = useState<PartnerOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addPartnerDialogOpen, setAddPartnerDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPartnerOffer, setEditingPartnerOffer] = useState<PartnerOffer | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: 'Package',
    iconUrl: undefined as string | undefined,
    features: ''
  });

  const [partnerFormData, setPartnerFormData] = useState({
    category: '',
    partner: '',
    partnerLogo: '🏢',
    title: '',
    description: '',
    price: '',
    oldPrice: '',
    features: '',
    rating: '4.5',
    reviews: '0'
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadServices();
      loadPartnerOffers();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadServices();
    loadPartnerOffers();
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

  const loadPartnerOffers = async () => {
    try {
      const response = await fetch(PARTNER_OFFERS_API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки предложений');
      const data = await response.json();
      setPartnerOffers(data);
    } catch (error) {
      console.error('Ошибка при загрузке предложений:', error);
    }
  };

  const resetPartnerForm = () => {
    setPartnerFormData({
      category: '',
      partner: '',
      partnerLogo: '🏢',
      title: '',
      description: '',
      price: '',
      oldPrice: '',
      features: '',
      rating: '4.5',
      reviews: '0'
    });
    setEditingPartnerOffer(null);
  };

  const handleAddPartnerOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(PARTNER_OFFERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: partnerFormData.category,
          partner: partnerFormData.partner,
          partnerLogo: partnerFormData.partnerLogo,
          title: partnerFormData.title,
          description: partnerFormData.description,
          price: partnerFormData.price,
          oldPrice: partnerFormData.oldPrice || undefined,
          features: partnerFormData.features.split('\n').filter(f => f.trim()),
          rating: parseFloat(partnerFormData.rating),
          reviews: parseInt(partnerFormData.reviews)
        })
      });
      
      if (!response.ok) throw new Error('Ошибка при добавлении предложения');
      
      await loadPartnerOffers();
      setAddPartnerDialogOpen(false);
      resetPartnerForm();
    } catch (error) {
      console.error('Ошибка при добавлении предложения:', error);
      alert('Не удалось добавить предложение');
    }
  };

  const handleEditPartnerOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartnerOffer) return;
    
    try {
      const response = await fetch(PARTNER_OFFERS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPartnerOffer.id,
          category: partnerFormData.category,
          partner: partnerFormData.partner,
          partnerLogo: partnerFormData.partnerLogo,
          title: partnerFormData.title,
          description: partnerFormData.description,
          price: partnerFormData.price,
          oldPrice: partnerFormData.oldPrice || undefined,
          features: partnerFormData.features.split('\n').filter(f => f.trim()),
          rating: parseFloat(partnerFormData.rating),
          reviews: parseInt(partnerFormData.reviews)
        })
      });
      
      if (!response.ok) throw new Error('Ошибка при обновлении предложения');
      
      await loadPartnerOffers();
      setEditingPartnerOffer(null);
      resetPartnerForm();
    } catch (error) {
      console.error('Ошибка при обновлении предложения:', error);
      alert('Не удалось обновить предложение');
    }
  };

  const handleDeletePartnerOffer = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это предложение?')) return;
    
    try {
      const response = await fetch(`${PARTNER_OFFERS_API_URL}?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Ошибка при удалении предложения');
      
      await loadPartnerOffers();
    } catch (error) {
      console.error('Ошибка при удалении предложения:', error);
      alert('Не удалось удалить предложение');
    }
  };

  const openEditPartnerDialog = (offer: PartnerOffer) => {
    setEditingPartnerOffer(offer);
    setPartnerFormData({
      category: offer.category,
      partner: offer.partner,
      partnerLogo: offer.partnerLogo,
      title: offer.title,
      description: offer.description,
      price: offer.price,
      oldPrice: offer.oldPrice || '',
      features: offer.features.join('\n'),
      rating: offer.rating.toString(),
      reviews: offer.reviews.toString()
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
              {activeTab === 'services' && (
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
              )}
              {activeTab === 'partners' && (
                <Dialog open={addPartnerDialogOpen} onOpenChange={setAddPartnerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={resetPartnerForm}>
                      <Icon name="Plus" className="mr-2" size={18} />
                      Добавить предложение
                    </Button>
                  </DialogTrigger>
                  <PartnerOfferFormDialog
                    open={addPartnerDialogOpen}
                    onOpenChange={setAddPartnerDialogOpen}
                    formData={partnerFormData}
                    setFormData={setPartnerFormData}
                    onSubmit={handleAddPartnerOffer}
                    editingOffer={null}
                  />
                </Dialog>
              )}
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
                onClick={() => setActiveTab('partners')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'partners'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon name="Handshake" className="inline mr-2" size={18} />
                Партнёрские предложения ({partnerOffers.length})
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
          ) : activeTab === 'partners' ? (
            <>
              <Dialog open={editingPartnerOffer !== null} onOpenChange={(open) => !open && setEditingPartnerOffer(null)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnerOffers.map((offer) => (
                    <PartnerOfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={openEditPartnerDialog}
                      onDelete={handleDeletePartnerOffer}
                    />
                  ))}
                </div>
                <PartnerOfferFormDialog
                  open={editingPartnerOffer !== null}
                  onOpenChange={(open) => !open && setEditingPartnerOffer(null)}
                  formData={partnerFormData}
                  setFormData={setPartnerFormData}
                  onSubmit={handleEditPartnerOffer}
                  editingOffer={editingPartnerOffer}
                />
              </Dialog>

              {partnerOffers.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="Handshake" className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет предложений</h3>
                  <p className="text-gray-500 mb-4">Добавьте первое предложение от партнёра</p>
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