import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content?: string;
  badge: string;
  image_url?: string;
  published_date?: string;
  is_published: boolean;
}

interface NewsManagementProps {
  articles: NewsArticle[];
  onReload: () => void;
}

const NEWS_API_URL = 'https://functions.poehali.dev/33fdf451-a1d5-4a5f-9e74-b9870f38067b';

const NewsManagement = ({ articles, onReload }: NewsManagementProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    badge: 'Новости',
    image_url: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      badge: 'Новости',
      image_url: ''
    });
    setSelectedArticle(null);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.content) {
      alert('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(NEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...formData,
          is_published: false
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Статья создана! Теперь вы можете опубликовать её.');
        resetForm();
        setDialogOpen(false);
        onReload();
      } else {
        alert('Ошибка создания статьи');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Не удалось создать статью');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (article: NewsArticle) => {
    if (!confirm(`Опубликовать статью "${article.title}" в Telegram-канал @kupetzvplyuse?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(NEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          id: article.id
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Статья опубликована в Telegram!');
        onReload();
      } else {
        alert(data.error || 'Ошибка публикации');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Не удалось опубликовать статью');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту статью?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${NEWS_API_URL}?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Статья удалена');
        onReload();
      } else {
        alert('Ошибка удаления');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Не удалось удалить статью');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (article: NewsArticle) => {
    if (article.content) {
      setSelectedArticle(article);
      setViewDialogOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${NEWS_API_URL}?id=${article.id}`);
      const data = await response.json();
      setSelectedArticle(data);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Не удалось загрузить статью');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Управление новостями</h2>
          <p className="text-gray-600">Публикуются автоматически в @kupetzvplyuse</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Icon name="Plus" className="mr-2" size={18} />
          Создать статью
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="FileText" className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет статей</h3>
              <p className="text-gray-500">Создайте первую новость или статью</p>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={article.is_published ? 'default' : 'secondary'}>
                        {article.badge}
                      </Badge>
                      {article.is_published && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Icon name="Check" size={14} className="mr-1" />
                          Опубликовано
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription className="mt-2">{article.description}</CardDescription>
                    {article.published_date && (
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(article.published_date).toLocaleString('ru-RU')}
                      </p>
                    )}
                  </div>
                  {article.image_url && (
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(article)}>
                    <Icon name="Eye" size={16} className="mr-1" />
                    Просмотр
                  </Button>
                  {!article.is_published && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handlePublish(article)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Icon name="Send" size={16} className="mr-1" />
                        Опубликовать
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(article.id)}
                        disabled={loading}
                      >
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать новую статью</DialogTitle>
            <DialogDescription>
              Статья будет сохранена как черновик. После создания вы сможете опубликовать её в Telegram.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="badge">Тип *</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Новости, Акция, Обновление"
              />
            </div>
            <div>
              <Label htmlFor="title">Заголовок *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Привлекательный заголовок"
              />
            </div>
            <div>
              <Label htmlFor="description">Краткое описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Краткое описание для превью (1-2 предложения)"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="content">Полный текст *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Подробное содержание статьи"
                rows={8}
              />
            </div>
            <div>
              <Label htmlFor="image_url">Ссылка на изображение</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Отмена
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'Создание...' : 'Создать черновик'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{selectedArticle?.badge}</Badge>
              {selectedArticle?.is_published && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Опубликовано
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl">{selectedArticle?.title}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedArticle?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedArticle?.image_url && (
            <img 
              src={selectedArticle.image_url} 
              alt={selectedArticle.title}
              className="w-full rounded-lg"
            />
          )}
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{selectedArticle?.content}</p>
          </div>
          {selectedArticle?.published_date && (
            <p className="text-sm text-gray-500">
              Опубликовано: {new Date(selectedArticle.published_date).toLocaleString('ru-RU')}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManagement;
