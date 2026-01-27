import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import PartnerOfferCard from '@/components/admin/PartnerOfferCard';
import PartnerOfferFormDialog from '@/components/admin/PartnerOfferFormDialog';

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

interface PartnersManagementProps {
  partnerOffers: PartnerOffer[];
  onReload: () => Promise<void>;
  addPartnerDialogOpen: boolean;
  setAddPartnerDialogOpen: (open: boolean) => void;
}

const PARTNER_OFFERS_API_URL = 'https://functions.poehali.dev/9b132aca-4d30-44b8-a681-725b7d71264d';

const PartnersManagement = ({
  partnerOffers,
  onReload,
  addPartnerDialogOpen,
  setAddPartnerDialogOpen
}: PartnersManagementProps) => {
  const [editingPartnerOffer, setEditingPartnerOffer] = useState<PartnerOffer | null>(null);
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
      
      await onReload();
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
      
      await onReload();
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
      
      await onReload();
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

  return (
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

      <Dialog open={addPartnerDialogOpen} onOpenChange={setAddPartnerDialogOpen}>
        <PartnerOfferFormDialog
          open={addPartnerDialogOpen}
          onOpenChange={setAddPartnerDialogOpen}
          formData={partnerFormData}
          setFormData={setPartnerFormData}
          onSubmit={handleAddPartnerOffer}
          editingOffer={null}
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
  );
};

export default PartnersManagement;
