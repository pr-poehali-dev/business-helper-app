-- Добавляем поля status и source_url в таблицу news_articles
ALTER TABLE t_p81470733_business_helper_app.news_articles 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Создаём индекс для быстрого поиска по статусу
CREATE INDEX IF NOT EXISTS idx_news_articles_status 
ON t_p81470733_business_helper_app.news_articles(status);

-- Синхронизируем is_published со status для существующих записей
UPDATE t_p81470733_business_helper_app.news_articles 
SET status = CASE 
    WHEN is_published = true THEN 'published' 
    ELSE 'draft' 
END
WHERE status = 'draft';