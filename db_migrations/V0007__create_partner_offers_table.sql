-- Создание таблицы для партнёрских предложений
CREATE TABLE IF NOT EXISTS t_p81470733_business_helper_app.partner_offers (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    partner VARCHAR(255) NOT NULL,
    partner_logo VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    old_price VARCHAR(100),
    features TEXT[] NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрой фильтрации по категории
CREATE INDEX idx_partner_offers_category ON t_p81470733_business_helper_app.partner_offers(category);