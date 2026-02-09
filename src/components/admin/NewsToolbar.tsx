import React from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface NewsToolbarProps {
  importing: boolean;
  onImport: () => void;
  onCreate: () => void;
}

export default function NewsToolbar({ importing, onImport, onCreate }: NewsToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Icon name="Settings" size={32} className="text-blue-600" />
          Управление новостями
        </h1>
        <p className="text-gray-600 mt-2">
          Импорт, редактирование и публикация новостей в Telegram{' '}
          <a
            href="https://t.me/kupetzvplyuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            @kupetzvplyuse
          </a>
          {' '}и{' '}
          <a
            href="https://vk.com/kupetzvplyuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            ВКонтакте
          </a>
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={onImport}
          disabled={importing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Icon name="Download" size={18} />
          {importing ? 'Импорт...' : 'Импорт с СберАналитики'}
        </Button>
        
        <Button
          onClick={onCreate}
          className="flex items-center gap-2"
        >
          <Icon name="Plus" size={18} />
          Создать новость
        </Button>
      </div>
    </div>
  );
}
