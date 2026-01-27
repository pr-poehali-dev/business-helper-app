-- Создаем таблицу для хранения заявок на услуги
CREATE TABLE IF NOT EXISTS t_p81470733_business_helper_app.orders (
    id SERIAL PRIMARY KEY,
    service VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company VARCHAR(255),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);

-- Создаем индекс для быстрого поиска по статусу
CREATE INDEX idx_orders_status ON t_p81470733_business_helper_app.orders(status);

-- Создаем индекс для быстрого поиска по дате
CREATE INDEX idx_orders_created_at ON t_p81470733_business_helper_app.orders(created_at DESC);
