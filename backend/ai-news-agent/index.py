"""
ИИ-агент для обработки новостей и автоматической публикации
"""
import json
import os
from datetime import datetime
import requests
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """ИИ-агент для автоматической обработки и публикации новостей"""
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
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if isinstance(body_str, str):
            body = json.loads(body_str) if body_str else {}
        else:
            body = body_str or {}
        action = body.get('action', 'process')
        
        if action == 'process':
            # Обрабатываем черновики новостей через ИИ
            result = process_draft_news()
        elif action == 'publish':
            # Публикуем готовые новости
            result = publish_news()
        elif action == 'auto':
            # Полный цикл: парсинг → обработка → публикация
            result = auto_pipeline()
        elif action == 'migrate':
            # Применение миграции БД
            result = apply_migration()
        else:
            result = {'error': 'Unknown action'}
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    if method == 'GET':
        # Получаем статистику агента
        stats = get_agent_stats()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(stats, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }


def process_draft_news():
    """Обработка черновиков через ИИ"""
    database_url = os.environ.get('DATABASE_URL')
    api_key = os.environ.get('POLZA_AI_API_KEY')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not database_url or not api_key:
        return {'success': False, 'error': 'Missing credentials'}
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Получаем черновики (прямая интерполяция схемы из env)
    query = f"SELECT id, title, content, source_url, image_url FROM {schema}.news_articles WHERE status = 'draft' ORDER BY created_at DESC LIMIT 5"
    cursor.execute(query)
    
    drafts = cursor.fetchall()
    processed = 0
    
    for draft in drafts:
        # Улучшаем контент через ИИ
        improved = improve_content_with_ai(
            draft['title'],
            draft['content'],
            draft['source_url'],
            api_key
        )
        
        if improved:
            # Обновляем статью
            query = f"UPDATE {schema}.news_articles SET content = %s, status = 'ready', updated_at = %s WHERE id = %s"
            cursor.execute(query, (improved, datetime.now(), draft['id']))
            processed += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'success': True,
        'processed': processed,
        'total_drafts': len(drafts)
    }


def improve_content_with_ai(title, content, source_url, api_key):
    """Улучшение контента через ChatGPT"""
    try:
        response = requests.post(
            'https://api.polza.ai/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'openai/gpt-4o-mini',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'Ты - редактор новостного канала для бизнеса. Перепиши короткое описание продукта в интересную новость для Telegram-канала. Добавь эмодзи, сделай текст живым и привлекательным. Максимум 3-4 предложения.'
                    },
                    {
                        'role': 'user',
                        'content': f"Заголовок: {title}\n\nОписание: {content}\n\nСсылка: {source_url}"
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 300
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content']
        
        return None
        
    except Exception:
        return None


def publish_news():
    """Публикация готовых новостей в Telegram"""
    database_url = os.environ.get('DATABASE_URL')
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not all([database_url, bot_token, channel_id]):
        return {'success': False, 'error': 'Missing credentials'}
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Получаем готовые к публикации новости
    query = f"SELECT id, title, content, source_url, image_url FROM {schema}.news_articles WHERE status = 'ready' ORDER BY created_at DESC LIMIT 3"
    cursor.execute(query)
    
    ready_news = cursor.fetchall()
    published = 0
    
    for news in ready_news:
        # Публикуем в Telegram
        success = send_to_telegram(
            news['title'],
            news['content'],
            news['source_url'],
            news['image_url'],
            bot_token,
            channel_id
        )
        
        if success:
            # Обновляем статус
            query = f"UPDATE {schema}.news_articles SET status = 'published', published_at = %s, updated_at = %s WHERE id = %s"
            cursor.execute(query, (datetime.now(), datetime.now(), news['id']))
            published += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'success': True,
        'published': published,
        'total_ready': len(ready_news)
    }


def send_to_telegram(title, content, source_url, image_url, bot_token, channel_id):
    """Отправка новости в Telegram-канал"""
    try:
        message = f"<b>{title}</b>\n\n{content}"
        
        if source_url:
            message += f"\n\n🔗 <a href='{source_url}'>Подробнее</a>"
        
        # Если есть изображение - отправляем с фото
        if image_url:
            requests.post(
                f'https://api.telegram.org/bot{bot_token}/sendPhoto',
                data={
                    'chat_id': channel_id,
                    'photo': image_url,
                    'caption': message,
                    'parse_mode': 'HTML'
                },
                timeout=10
            )
        else:
            # Иначе только текст
            requests.post(
                f'https://api.telegram.org/bot{bot_token}/sendMessage',
                json={
                    'chat_id': channel_id,
                    'text': message,
                    'parse_mode': 'HTML',
                    'disable_web_page_preview': False
                },
                timeout=10
            )
        
        return True
        
    except Exception:
        return False


def auto_pipeline():
    """Полный автоматический цикл обработки новостей"""
    results = {
        'scrape': None,
        'process': None,
        'publish': None
    }
    
    # 1. Парсим новости
    try:
        scraper_response = requests.post(
            'https://functions.poehali.dev/news-scraper',
            timeout=30
        )
        if scraper_response.status_code == 200:
            results['scrape'] = scraper_response.json()
    except Exception as e:
        results['scrape'] = {'error': str(e)}
    
    # 2. Обрабатываем через ИИ
    results['process'] = process_draft_news()
    
    # 3. Публикуем
    results['publish'] = publish_news()
    
    return {
        'success': True,
        'pipeline': results
    }


def get_agent_stats():
    """Получение статистики работы агента"""
    database_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not database_url:
        return {'error': 'Database not configured'}
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = f"SELECT status, COUNT(*) as count FROM {schema}.news_articles GROUP BY status"
    cursor.execute(query)
    
    stats = {row['status']: row['count'] for row in cursor.fetchall()}
    
    cursor.close()
    conn.close()
    
    return {
        'drafts': stats.get('draft', 0),
        'ready': stats.get('ready', 0),
        'published': stats.get('published', 0),
        'total': sum(stats.values())
    }


def apply_migration():
    """Применение миграции для создания таблицы news_articles"""
    database_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not database_url:
        return {'success': False, 'error': 'DATABASE_URL not configured'}
    
    migration_sql = f"""
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

    CREATE INDEX IF NOT EXISTS idx_news_status ON {schema}.news_articles(status, created_at DESC);
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