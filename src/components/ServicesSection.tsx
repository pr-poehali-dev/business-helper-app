import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface ServicesSectionProps {
  services: Service[];
  loading: boolean;
}

const ServicesSection = ({ services, loading }: ServicesSectionProps) => {
  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center">
            <Icon name="Loader2" className="mx-auto text-blue-600 animate-spin mb-4" size={48} />
            <p className="text-gray-600">Загрузка услуг...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center">
            <Icon name="Package" className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Пока нет услуг</h3>
            <p className="text-gray-500">Услуги появятся здесь после добавления</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Наши услуги</h3>
          <p className="text-xl text-gray-600">Выберите подходящее решение для вашего бизнеса</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="border-2 hover:border-blue-500 transition-all hover:shadow-xl group"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  {service.iconUrl ? (
                    <img 
                      src={service.iconUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover rounded-2xl" 
                    />
                  ) : (
                    <Icon name={service.icon} className="text-white" size={32} />
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icon name="Check" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  <Icon name="ArrowRight" className="mr-2" size={18} />
                  Подключить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
