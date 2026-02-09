import React from 'react';
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
import { Button } from '@/components/ui/button';

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

interface NewsEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNews: NewsItem | null;
  onNewsChange: (news: NewsItem) => void;
  onSave: () => void;
}

export default function NewsEditDialog({
  open,
  onOpenChange,
  selectedNews,
  onNewsChange,
  onSave,
}: NewsEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onChange={(e) => onNewsChange({ ...selectedNews, title: e.target.value })}
                placeholder="Заголовок новости"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                value={selectedNews.description}
                onChange={(e) => onNewsChange({ ...selectedNews, description: e.target.value })}
                placeholder="Краткое описание для превью"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Полный текст</Label>
              <Textarea
                id="content"
                value={selectedNews.content}
                onChange={(e) => onNewsChange({ ...selectedNews, content: e.target.value })}
                placeholder="Полный текст новости"
                rows={6}
              />
            </div>
            
            <div>
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                value={selectedNews.image_url}
                onChange={(e) => onNewsChange({ ...selectedNews, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="source_url">Ссылка на источник</Label>
              <Input
                id="source_url"
                value={selectedNews.source_url}
                onChange={(e) => onNewsChange({ ...selectedNews, source_url: e.target.value })}
                placeholder="https://example.com/article"
              />
            </div>
            
            <div>
              <Label htmlFor="badge">Метка (необязательно)</Label>
              <Input
                id="badge"
                value={selectedNews.badge || ''}
                onChange={(e) => onNewsChange({ ...selectedNews, badge: e.target.value })}
                placeholder="Новинка, Акция, и т.д."
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
