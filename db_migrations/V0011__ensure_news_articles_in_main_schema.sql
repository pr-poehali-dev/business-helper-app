-- Создаём таблицу news_articles в основной схеме проекта
-- Схема: t_p81470733_business_helper_app

CREATE TABLE IF NOT EXISTS t_p81470733_business_helper_app.news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём индекс для быстрого поиска по статусу
CREATE INDEX IF NOT EXISTS idx_news_status ON t_p81470733_business_helper_app.news_articles(status, created_at DESC);

-- Комментарии к таблице
COMMENT ON TABLE t_p81470733_business_helper_app.news_articles IS 'Таблица для хранения новостей ИИ-агента';
COMMENT ON COLUMN t_p81470733_business_helper_app.news_articles.status IS 'Статус: draft, ready, published';
