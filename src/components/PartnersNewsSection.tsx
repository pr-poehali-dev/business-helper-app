import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Partner {
  name: string;
  logo: string;
  description: string;
  specialization: string;
  advantages: string[];
  caseStudy: string;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  badge: string;
  description: string;
}

interface PartnersNewsSectionProps {
  partners: Partner[];
  news: NewsItem[];
}

const PartnersNewsSection = ({ partners, news }: PartnersNewsSectionProps) => {
  return (
    <>
      <section id="partners" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Наши партнёры</h3>
            <p className="text-xl text-gray-600">Работаем с лидерами рынка</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((partner, idx) => (
              <Card key={idx} className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl">{partner.logo}</div>
                    <div>
                      <CardTitle className="text-2xl">{partner.name}</CardTitle>
                      <CardDescription className="text-base">{partner.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="mb-4 w-fit bg-orange-100 text-orange-700 border-orange-300">
                    {partner.specialization}
                  </Badge>
                  
                  <div className="space-y-3 mb-4">
                    <div className="font-semibold text-gray-800">Преимущества:</div>
                    {partner.advantages.map((adv, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        {adv}
                      </div>
                    ))}
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start gap-2">
                      <Icon name="TrendingUp" className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="font-semibold text-gray-800 mb-1">Кейс:</div>
                        <div className="text-sm text-gray-700">{partner.caseStudy}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="py-16 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Новости и акции</h3>
            <p className="text-xl text-gray-600">Актуальные предложения от партнёров</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card key={item.id} className="border-2 hover:border-orange-400 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={item.badge === 'Акция' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
                      {item.badge}
                    </Badge>
                    <span className="text-sm text-gray-600">{item.date}</span>
                  </div>
                  <CardTitle className="text-xl mb-3">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                  <Button variant="link" className="p-0 mt-3 text-orange-600">
                    Подробнее <Icon name="ArrowRight" className="ml-1" size={16} />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PartnersNewsSection;
