import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NEWS_API_URL = 'https://functions.poehali.dev/5d29c9e1-5acb-4318-b4ae-ea1d2943e9aa';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  badge?: string;
  source_url: string;
  image_url: string;
  published_date: string;
  created_at: string;
}

export default function NewsPreviewSection() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch(`${NEWS_API_URL}?limit=3`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };

  if (loading || news.length === 0) {
    return null;
  }

  return (
    <section id="news" className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Новости и обновления
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Следите за актуальными новостями и новыми продуктами СберАналитики
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => navigate('/news')}
            >
              {item.image_url && (
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Icon name="Calendar" size={14} />
                  {formatDate(item.published_date || item.created_at)}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.description || item.content}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/news')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Icon name="Newspaper" size={20} className="mr-2" />
            Все новости
          </Button>
        </div>
      </div>
    </section>
  );
}