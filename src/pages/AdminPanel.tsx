import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminHeader from '@/components/admin/AdminHeader';
import ServicesManagement from '@/components/admin/ServicesManagement';
import PartnersManagement from '@/components/admin/PartnersManagement';
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

  const resetServiceForm = () => {
    // Логика сброса формы услуг вынесена в ServicesManagement
  };

  const resetPartnerForm = () => {
    // Логика сброса формы партнёров вынесена в PartnersManagement
  };

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
          <AdminHeader
            activeTab={activeTab}
            onLogout={handleLogout}
            onResetServiceForm={resetServiceForm}
            onResetPartnerForm={resetPartnerForm}
            setAddDialogOpen={setAddDialogOpen}
            setAddPartnerDialogOpen={setAddPartnerDialogOpen}
          />

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

          {activeTab === 'services' ? (
            <ServicesManagement
              services={services}
              loading={loading}
              onReload={loadServices}
              addDialogOpen={addDialogOpen}
              setAddDialogOpen={setAddDialogOpen}
            />
          ) : activeTab === 'partners' ? (
            <PartnersManagement
              partnerOffers={partnerOffers}
              onReload={loadPartnerOffers}
              addPartnerDialogOpen={addPartnerDialogOpen}
              setAddPartnerDialogOpen={setAddPartnerDialogOpen}
            />
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
