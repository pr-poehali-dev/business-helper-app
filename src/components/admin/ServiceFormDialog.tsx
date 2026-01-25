import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  icon: string;
  features: string;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingService: Service | null;
  iconOptions: string[];
}

const ServiceFormDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  editingService,
  iconOptions
}: ServiceFormDialogProps) => {
  const isEditing = editingService !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать услугу' : 'Добавить новую услугу'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Внесите изменения в информацию об услуге' : 'Заполните информацию о новой услуге'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor={isEditing ? 'edit-title' : 'title'}>Название услуги</Label>
            <Input 
              id={isEditing ? 'edit-title' : 'title'}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Интернет" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={isEditing ? 'edit-description' : 'description'}>Описание</Label>
            <Input 
              id={isEditing ? 'edit-description' : 'description'}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Высокоскоростной интернет" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={isEditing ? 'edit-price' : 'price'}>Цена</Label>
            <Input 
              id={isEditing ? 'edit-price' : 'price'}
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="500 ₽/мес" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={isEditing ? 'edit-icon' : 'icon'}>Иконка</Label>
            <select
              id={isEditing ? 'edit-icon' : 'icon'}
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
            <Label htmlFor={isEditing ? 'edit-features' : 'features'}>Особенности (каждая с новой строки)</Label>
            <textarea
              id={isEditing ? 'edit-features' : 'features'}
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="До 1 Гбит/с&#10;Безлимитный трафик&#10;Статический IP"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Icon name={isEditing ? 'Save' : 'Plus'} className="mr-2" size={18} />
            {isEditing ? 'Сохранить изменения' : 'Добавить услугу'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormDialog;
