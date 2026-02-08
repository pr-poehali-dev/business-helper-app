import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const NEWS_API_URL = 'https://functions.poehali.dev/5d29c9e1-5acb-4318-b4ae-ea1d2943e9aa';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  source_url: string;
  image_url: string;
  published_at: string;
  created_at: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    loadNews();
  }, [page]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(`${NEWS_API_URL}?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news);
        setTotal(data.total);
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
      month: 'long',
      year: 'numeric'
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Icon name="Newspaper" size={40} className="text-blue-600" />
            Новости СберАналитики
          </h1>
          <p className="text-lg text-gray-600">
            Актуальные обновления и новые продукты
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="FileX" size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Новостей пока нет</p>
            <p className="text-sm text-gray-500 mt-2">Скоро здесь появятся свежие обновления</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {item.image_url && (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Icon name="Calendar" size={14} />
                      {formatDate(item.published_at || item.created_at)}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.content}
                    </p>
                    
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Подробнее
                        <Icon name="ExternalLink" size={16} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronLeft" size={20} />
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronRight" size={20} />
                </button>
              </div>
            )}

            <div className="text-center mt-8 text-sm text-gray-500">
              Показано {news.length} из {total} новостей
            </div>
          </>
        )}
      </div>
    </div>
  );
}
