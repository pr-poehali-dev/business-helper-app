CREATE TABLE t_p81470733_business_helper_app.services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Package',
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_created_at ON t_p81470733_business_helper_app.services(created_at);

INSERT INTO t_p81470733_business_helper_app.services (title, description, price, icon, features) VALUES
('Интернет', 'Высокоскоростной интернет до 1 Гбит/с', '500 ₽/мес', 'Wifi', ARRAY['До 1 Гбит/с', 'Безлимитный трафик', 'Статический IP']),
('Телевидение', '200+ каналов в HD качестве', '300 ₽/мес', 'Tv', ARRAY['200+ каналов', 'HD качество', 'Архив передач']);