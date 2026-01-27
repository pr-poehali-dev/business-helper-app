import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

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

interface PartnerOfferFormData {
  category: string;
  partner: string;
  partnerLogo: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  features: string;
  rating: string;
  reviews: string;
}

interface PartnerOfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PartnerOfferFormData;
  setFormData: (data: PartnerOfferFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingOffer: PartnerOffer | null;
}

const PartnerOfferFormDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  editingOffer
}: PartnerOfferFormDialogProps) => {
  const isEditing = editingOffer !== null;

  const categories = [
    { id: 'bank', name: 'Банковские услуги' },
    { id: 'phone', name: 'Телефония' },
    { id: 'crm', name: 'CRM и автоматизация' },
    { id: 'mobile', name: 'Мобильные операторы' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать предложение' : 'Добавить новое предложение'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Внесите изменения в информацию о предложении партнёра' : 'Заполните информацию о новом предложении'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner">Партнёр</Label>
              <Input 
                id="partner"
                value={formData.partner}
                onChange={(e) => setFormData({...formData, partner: e.target.value})}
                placeholder="Альфа-Банк" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="partnerLogo">Эмодзи логотип</Label>
            <Input 
              id="partnerLogo"
              value={formData.partnerLogo}
              onChange={(e) => setFormData({...formData, partnerLogo: e.target.value})}
              placeholder="🏦" 
              maxLength={2}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Название предложения</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Расчётный счёт для ООО и ИП" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Открытие расчётного счёта онлайн" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена</Label>
              <Input 
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0 ₽" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oldPrice">Старая цена (опционально)</Label>
              <Input 
                id="oldPrice"
                value={formData.oldPrice}
                onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                placeholder="1 990 ₽/мес" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Рейтинг (0-5)</Label>
              <Input 
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                placeholder="4.8" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviews">Количество отзывов</Label>
              <Input 
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({...formData, reviews: e.target.value})}
                placeholder="234" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Особенности (каждая с новой строки)</Label>
            <textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="Открытие за 1 день&#10;Бесплатный интернет-банк&#10;До 50 платежей без комиссии"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Icon name={isEditing ? 'Save' : 'Plus'} className="mr-2" size={18} />
            {isEditing ? 'Сохранить изменения' : 'Добавить предложение'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerOfferFormDialog;
