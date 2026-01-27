import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import ServiceFormDialog from '@/components/admin/ServiceFormDialog';
import ServiceCard from '@/components/admin/ServiceCard';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  iconUrl?: string;
  features: string[];
}

interface ServicesManagementProps {
  services: Service[];
  loading: boolean;
  onReload: () => Promise<void>;
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
}

const API_URL = 'https://functions.poehali.dev/8ac2f869-dcd9-4b3c-93cd-a81c3c14c86e';

const ServicesManagement = ({ 
  services, 
  loading, 
  onReload,
  addDialogOpen,
  setAddDialogOpen
}: ServicesManagementProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    icon: 'Package',
    iconUrl: undefined as string | undefined,
    features: ''
  });

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
      
      await onReload();
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
      
      await onReload();
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
      
      await onReload();
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

  if (loading) {
    return (
      <div className="text-center py-16">
        <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
        <p className="text-gray-600">Загрузка услуг...</p>
      </div>
    );
  }

  return (
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

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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

      {services.length === 0 && (
        <div className="text-center py-16">
          <Icon name="Package" className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет услуг</h3>
          <p className="text-gray-500 mb-4">Добавьте первую услугу для отображения</p>
        </div>
      )}
    </>
  );
};

export default ServicesManagement;
