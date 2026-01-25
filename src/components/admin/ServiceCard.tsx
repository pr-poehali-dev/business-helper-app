import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
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

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            {service.iconUrl ? (
              <img src={service.iconUrl} alt={service.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Icon name={service.icon} className="text-blue-600" size={24} />
            )}
          </div>
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(service)}
              >
                <Icon name="Edit" size={16} />
              </Button>
            </DialogTrigger>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDelete(service.id)}
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
  );
};

export default ServiceCard;