CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    badge VARCHAR(50) DEFAULT 'Новости',
    image_url TEXT,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telegram_message_id BIGINT,
    author_id INTEGER,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_published ON news_articles(is_published, published_date DESC);