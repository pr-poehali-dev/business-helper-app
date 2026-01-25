import { useState } from 'react';
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
  iconUrl?: string;
  features: string[];
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  icon: string;
  iconUrl?: string;
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

const UPLOAD_ICON_URL = 'https://functions.poehali.dev/f75906e6-db65-47f7-a1be-4de4c16eb2df';

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
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setUploadingIcon(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];

        const response = await fetch(UPLOAD_ICON_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            contentType: file.type
          })
        });

        if (!response.ok) throw new Error('Ошибка загрузки');

        const data = await response.json();
        setFormData({ ...formData, iconUrl: data.url });
        setIconPreview(data.url);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Не удалось загрузить изображение');
    } finally {
      setUploadingIcon(false);
    }
  };

  const removeCustomIcon = () => {
    setFormData({ ...formData, iconUrl: undefined });
    setIconPreview(null);
  };

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
            <Label>Иконка</Label>
            <div className="space-y-3">
              {(formData.iconUrl || iconPreview) ? (
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <img 
                    src={formData.iconUrl || iconPreview || ''} 
                    alt="Custom icon" 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Пользовательская иконка</p>
                    <p className="text-xs text-gray-500">Загружено из файла</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={removeCustomIcon}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ) : (
                <>
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
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-500">или</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingIcon}
                      className="cursor-pointer"
                    />
                    {uploadingIcon && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Icon name="Loader2" className="animate-spin" size={12} />
                        Загрузка...
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
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