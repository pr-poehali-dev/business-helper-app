import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    if (!confirm('Опубликовать новость в Telegram канал @kupetzvplyuse?')) return;

    try {
      const response = await fetch(PUBLISH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newsItem.id })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Новость опубликована в Telegram канал!');
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
        body: JSON.dumps(newsItem)
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

  const filteredNews = news;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Icon name="Settings" size={32} className="text-blue-600" />
              Управление новостями
            </h1>
            <p className="text-gray-600 mt-2">
              Импорт, редактирование и публикация новостей в{' '}
              <a
                href="https://t.me/kupetzvplyuse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                @kupetzvplyuse
              </a>
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={importNews}
              disabled={importing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon name="Download" size={18} />
              {importing ? 'Импорт...' : 'Импорт с СберАналитики'}
            </Button>
            
            <Button
              onClick={() => {
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
              }}
              className="flex items-center gap-2"
            >
              <Icon name="Plus" size={18} />
              Создать новость
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex items-center gap-4">
            <Label>Фильтр:</Label>
            <Select
              value={filterStatus}
              onValueChange={(value: 'all' | 'draft' | 'published') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все новости</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
                <SelectItem value="published">Опубликованные</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto text-sm text-gray-600">
              Всего: {filteredNews.length} новостей
            </div>
          </div>
        </div>

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
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex gap-6">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.status === 'published' ? (
                          <a
                            href="https://t.me/kupetzvplyuse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                          >
                            <Icon name="Send" size={12} />
                            В Telegram
                          </a>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            Черновик
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {formatDate(item.published_date || item.created_at)}
                      </span>
                      
                      {item.source_url && (
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Icon name="ExternalLink" size={14} />
                          Источник
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedNews(item);
                          setEditDialog(true);
                        }}
                      >
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать
                      </Button>
                      
                      {item.status === 'draft' ? (
                        <Button
                          size="sm"
                          onClick={() => publishNews(item)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Icon name="Send" size={16} className="mr-1" />
                          Опубликовать в TG
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unpublishNews(item)}
                        >
                          <Icon name="Archive" size={16} className="mr-1" />
                          Снять с публикации
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteNews(item.id)}
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNews?.id ? 'Редактирование новости' : 'Создание новости'}
            </DialogTitle>
            <DialogDescription>
              Заполните поля и нажмите "Сохранить"
            </DialogDescription>
          </DialogHeader>
          
          {selectedNews && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={selectedNews.title}
                  onChange={(e) => setSelectedNews({...selectedNews, title: e.target.value})}
                  placeholder="Заголовок новости"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea
                  id="description"
                  value={selectedNews.description}
                  onChange={(e) => setSelectedNews({...selectedNews, description: e.target.value})}
                  placeholder="Краткое описание для превью"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Полный текст</Label>
                <Textarea
                  id="content"
                  value={selectedNews.content}
                  onChange={(e) => setSelectedNews({...selectedNews, content: e.target.value})}
                  placeholder="Полный текст новости"
                  rows={6}
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  value={selectedNews.image_url}
                  onChange={(e) => setSelectedNews({...selectedNews, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <Label htmlFor="source_url">Ссылка на источник</Label>
                <Input
                  id="source_url"
                  value={selectedNews.source_url}
                  onChange={(e) => setSelectedNews({...selectedNews, source_url: e.target.value})}
                  placeholder="https://example.com/article"
                />
              </div>
              
              <div>
                <Label htmlFor="badge">Метка (необязательно)</Label>
                <Input
                  id="badge"
                  value={selectedNews.badge || ''}
                  onChange={(e) => setSelectedNews({...selectedNews, badge: e.target.value})}
                  placeholder="Новинка, Акция, и т.д."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Отмена
            </Button>
            <Button onClick={() => selectedNews && saveNews(selectedNews)}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}