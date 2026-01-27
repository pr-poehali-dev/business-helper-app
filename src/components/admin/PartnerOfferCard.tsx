import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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

interface PartnerOfferCardProps {
  offer: PartnerOffer;
  onEdit: (offer: PartnerOffer) => void;
  onDelete: (id: number) => void;
}

const PartnerOfferCard = ({ offer, onEdit, onDelete }: PartnerOfferCardProps) => {
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      'bank': 'Банковские услуги',
      'phone': 'Телефония',
      'crm': 'CRM и автоматизация',
      'mobile': 'Мобильные операторы'
    };
    return categories[category] || category;
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {getCategoryName(offer.category)}
          </Badge>
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(offer)}
              >
                <Icon name="Edit" size={16} />
              </Button>
            </DialogTrigger>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDelete(offer.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{offer.partnerLogo}</div>
          <div>
            <div className="text-sm font-semibold text-gray-600">{offer.partner}</div>
            <CardTitle className="text-lg">{offer.title}</CardTitle>
          </div>
        </div>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-blue-600">{offer.price}</div>
            {offer.oldPrice && (
              <div className="text-sm text-gray-400 line-through">{offer.oldPrice}</div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="font-semibold">{offer.rating}</span>
            <span className="text-gray-500">({offer.reviews} отзывов)</span>
          </div>
          <ul className="space-y-2 pt-2">
            {offer.features.map((feature, idx) => (
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

export default PartnerOfferCard;
