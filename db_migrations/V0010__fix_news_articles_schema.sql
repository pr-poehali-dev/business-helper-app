-- Обновление структуры таблицы news_articles для ИИ-агента

-- Удаляем старые колонки если они есть
ALTER TABLE IF EXISTS news_articles 
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS badge,
DROP COLUMN IF EXISTS published_date,
DROP COLUMN IF EXISTS telegram_message_id,
DROP COLUMN IF EXISTS author_id,
DROP COLUMN IF EXISTS is_published;

-- Добавляем новые колонки если их нет
ALTER TABLE IF EXISTS news_articles 
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

-- Создаём индекс для быстрого поиска по статусу
CREATE INDEX IF NOT EXISTS idx_news_status ON news_articles(status, created_at DESC);

-- Удаляем старый индекс если существует
DROP INDEX IF EXISTS idx_news_published;
