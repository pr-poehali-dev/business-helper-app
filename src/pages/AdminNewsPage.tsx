import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import NewsToolbar from '@/components/admin/NewsToolbar';
import NewsFilter from '@/components/admin/NewsFilter';
import NewsCard from '@/components/admin/NewsCard';
import NewsEditDialog from '@/components/admin/NewsEditDialog';

const MANAGE_API = 'https://functions.poehali.dev/97ce1b78-10ed-41b5-be3d-bef3a35789b5';
const IMPORT_API = 'https://functions.poehali.dev/182da4d3-fee1-4432-a5b6-20c44e5670c6';
const PUBLISH_API = 'https://functions.poehali.dev/ed51a7b8-9f6c-4d9d-92fa-ec6c559b4d5d';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  badge?: string;
  source_url: string;
  image_url: string;
  status: 'draft' | 'published';
  published_date: string | null;
  created_at: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');

  const loadNews = useCallback(async () => {
    setLoading(true);
    try {
      const url = filterStatus === 'all' 
        ? MANAGE_API 
        : `${MANAGE_API}?status=${filterStatus}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.news);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const importNews = async () => {
    setImporting(true);
    try {
      const response = await fetch(IMPORT_API, { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert(`Импортировано: ${data.imported} новостей из ${data.total_found}`);
        loadNews();
      } else {
        alert('Ошибка импорта новостей');
      }
    } catch (error) {
      console.error('Error importing news:', error);
      alert('Ошибка импорта новостей');
    } finally {
      setImporting(false);
    }
  };

  const publishNews = async (newsItem: NewsItem) => {
    if (!confirm('Опубликовать новость в Telegram (@kupetzvplyuse) и ВКонтакте?')) return;

    try {
      const response = await fetch(PUBLISH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newsItem.id })
      });

      const data = await response.json();
      if (data.success) {
        const results = data.results || {};
        const platforms = [];
        
        if (results.telegram?.success) platforms.push('Telegram');
        if (results.vk?.success) platforms.push('ВКонтакте');
        
        if (platforms.length > 0) {
          alert(`✅ Новость опубликована в: ${platforms.join(', ')}`);
        } else {
          alert('⚠️ Не удалось опубликовать ни на одной платформе');
        }
        
        loadNews();
      } else {
        alert(`Ошибка: ${data.error || 'Не удалось опубликовать'}`);
      }
    } catch (error) {
      console.error('Error publishing news:', error);
      alert('Ошибка публикации новости');
    }
  };

  const unpublishNews = async (newsItem: NewsItem) => {
    try {
      const response = await fetch(MANAGE_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsItem,
          status: 'draft'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Новость снята с публикации');
        loadNews();
      }
    } catch (error) {
      console.error('Error unpublishing news:', error);
      alert('Ошибка снятия с публикации');
    }
  };

  const deleteNews = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;

    try {
      const response = await fetch(`${MANAGE_API}?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Новость удалена');
        loadNews();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Ошибка удаления новости');
    }
  };

  const saveNews = async (newsItem: Partial<NewsItem>) => {
    try {
      const method = newsItem.id ? 'PUT' : 'POST';
      const response = await fetch(MANAGE_API, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem)
      });

      const data = await response.json();
      if (data.success) {
        alert(newsItem.id ? 'Новость обновлена' : 'Новость создана');
        setEditDialog(false);
        setSelectedNews(null);
        loadNews();
      }
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Ошибка сохранения новости');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCreateNews = () => {
    setSelectedNews({
      id: 0,
      title: '',
      description: '',
      content: '',
      source_url: '',
      image_url: '',
      status: 'draft',
      published_date: null,
      created_at: new Date().toISOString()
    });
    setEditDialog(true);
  };

  const handleEditNews = (item: NewsItem) => {
    setSelectedNews(item);
    setEditDialog(true);
  };

  const filteredNews = news;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NewsToolbar
          importing={importing}
          onImport={importNews}
          onCreate={handleCreateNews}
        />

        <NewsFilter
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          totalCount={filteredNews.length}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <Icon name="FileX" size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Новостей нет</p>
            <p className="text-sm text-gray-500 mt-2">Импортируйте новости или создайте вручную</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                onEdit={handleEditNews}
                onPublish={publishNews}
                onUnpublish={unpublishNews}
                onDelete={deleteNews}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      <NewsEditDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        selectedNews={selectedNews}
        onNewsChange={setSelectedNews}
        onSave={() => selectedNews && saveNews(selectedNews)}
      />
    </div>
  );
}
