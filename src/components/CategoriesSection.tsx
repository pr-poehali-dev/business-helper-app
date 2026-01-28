import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface Product {
  id: number;
  category: string;
  partner: string;
  partnerLogo: string;
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  features: string[];
  badge?: string;
  rating: number;
  reviews: number;
}

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onProductConnect: (product: Product) => void;
}

const CategoriesSection = ({ categories, products, selectedCategory, onCategoryChange, onProductConnect }: CategoriesSectionProps) => {
  return (
    <section id="categories" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-800 mb-4">Категории услуг</h3>
          <p className="text-xl text-gray-600">Выберите нужное направление для вашего бизнеса</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="border border-gray-200 hover:border-blue-600 transition-all hover:shadow-lg cursor-pointer group"
              onClick={() => onCategoryChange(cat.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon name={cat.icon as any} className="text-white" size={40} />
                </div>
                <CardTitle className="text-xl mb-2">{cat.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{cat.count} предложений</Badge>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h4 className="text-3xl font-bold text-gray-800 mb-6">
            {selectedCategory === 'all' ? 'Популярные предложения' : categories.find(c => c.id === selectedCategory)?.name}
          </h4>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <Card
              key={product.id}
              className="border-2 hover:border-orange-400 transition-all hover:shadow-2xl group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {product.badge && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className={`${
                    product.badge === 'Хит продаж' ? 'bg-red-500' :
                    product.badge === 'Новинка' ? 'bg-green-500' :
                    product.badge === 'Акция' ? 'bg-purple-500' :
                    'bg-orange-500'
                  } text-white border-0 shadow-lg font-semibold`}>
                    {product.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{product.partnerLogo}</div>
                  <div>
                    <div className="text-sm text-gray-600">Партнёр</div>
                    <div className="font-bold text-gray-800">{product.partner}</div>
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                <CardDescription className="text-base">{product.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                    ))}
                    <span className="text-sm text-gray-600">({product.reviews} отзывов)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold text-green-600">{product.price}</span>
                    {product.oldPrice && <span className="text-lg text-gray-400 line-through mb-2">{product.oldPrice}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                    <Icon name="TrendingDown" size={16} />
                    Экономия {product.oldPrice}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icon name="CheckCircle2" className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => onProductConnect(product)}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={18} />
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

export default CategoriesSection;