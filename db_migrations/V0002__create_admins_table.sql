CREATE TABLE t_p81470733_business_helper_app.admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO t_p81470733_business_helper_app.admins (username, password_hash) VALUES
('admin', 'admin123');