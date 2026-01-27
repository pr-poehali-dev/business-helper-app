import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  activeTab: 'services' | 'orders' | 'partners';
  onLogout: () => void;
  onResetServiceForm: () => void;
  onResetPartnerForm: () => void;
  setAddDialogOpen: (open: boolean) => void;
  setAddPartnerDialogOpen: (open: boolean) => void;
}

const AdminHeader = ({
  activeTab,
  onLogout,
  onResetServiceForm,
  onResetPartnerForm,
  setAddDialogOpen,
  setAddPartnerDialogOpen
}: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление услугами и заявками</p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <Icon name="LogOut" className="mr-2" size={18} />
          Выйти
        </Button>
        {activeTab === 'services' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  onResetServiceForm();
                  setAddDialogOpen(true);
                }}
              >
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить услугу
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
        {activeTab === 'partners' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  onResetPartnerForm();
                  setAddPartnerDialogOpen(true);
                }}
              >
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить предложение
              </Button>
            </DialogTrigger>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
