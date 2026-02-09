import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewsFilterProps {
  filterStatus: 'all' | 'draft' | 'published';
  onFilterChange: (value: 'all' | 'draft' | 'published') => void;
  totalCount: number;
}

export default function NewsFilter({ filterStatus, onFilterChange, totalCount }: NewsFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
      <div className="flex items-center gap-4">
        <Label>Фильтр:</Label>
        <Select
          value={filterStatus}
          onValueChange={onFilterChange}
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
          Всего: {totalCount} новостей
        </div>
      </div>
    </div>
  );
}
