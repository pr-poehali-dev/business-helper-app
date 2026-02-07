"""
Функция для применения миграций к базе данных
"""
import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Применение миграции V0011 для создания таблицы news_articles"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method in ['POST', 'GET']:
        result = apply_migration()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }


def apply_migration():
    """Применение миграции для создания таблицы news_articles"""
    database_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not database_url:
        return {'success': False, 'error': 'DATABASE_URL not configured'}
    
    migration_sql = f"""
    -- Создаём таблицу news_articles в основной схеме проекта
    CREATE TABLE IF NOT EXISTS {schema}.news_articles (
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
    CREATE INDEX IF NOT EXISTS idx_news_status ON {schema}.news_articles(status, created_at DESC);

    -- Комментарии к таблице
    COMMENT ON TABLE {schema}.news_articles IS 'Таблица для хранения новостей ИИ-агента';
    COMMENT ON COLUMN {schema}.news_articles.status IS 'Статус: draft, ready, published';
    """
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Выполняем миграцию
        cursor.execute(migration_sql)
        conn.commit()
        
        # Проверяем, что таблица создалась
        cursor.execute(f"""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = %s 
            AND table_name = 'news_articles'
        """, (schema,))
        
        table_exists = cursor.fetchone()[0] > 0
        
        cursor.close()
        conn.close()
        
        if table_exists:
            return {
                'success': True,
                'message': f'Таблица news_articles успешно создана в схеме {schema}',
                'schema': schema
            }
        else:
            return {
                'success': False,
                'error': 'Таблица не была создана',
                'schema': schema
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': f'Ошибка миграции: {str(e)}',
            'schema': schema
        }