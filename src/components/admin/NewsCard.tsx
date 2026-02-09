import React from 'react';
import Icon from '@/components/ui/icon';
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

interface NewsCardProps {
  item: NewsItem;
  onEdit: (item: NewsItem) => void;
  onPublish: (item: NewsItem) => void;
  onUnpublish: (item: NewsItem) => void;
  onDelete: (id: number) => void;
  formatDate: (dateString: string) => string;
}

export default function NewsCard({
  item,
  onEdit,
  onPublish,
  onUnpublish,
  onDelete,
  formatDate,
}: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
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
                <>
                  <a
                    href="https://t.me/kupetzvplyuse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Icon name="Send" size={12} />
                    TG
                  </a>
                  <a
                    href="https://vk.com/kupetzvplyuse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Icon name="ExternalLink" size={12} />
                    VK
                  </a>
                </>
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
              onClick={() => onEdit(item)}
            >
              <Icon name="Edit" size={16} className="mr-1" />
              Редактировать
            </Button>
            
            {item.status === 'draft' ? (
              <Button
                size="sm"
                onClick={() => onPublish(item)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="Send" size={16} className="mr-1" />
                Опубликовать
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUnpublish(item)}
              >
                <Icon name="Archive" size={16} className="mr-1" />
                Снять с публикации
              </Button>
            )}
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item.id)}
            >
              <Icon name="Trash2" size={16} className="mr-1" />
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
