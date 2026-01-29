import json
import os
import psycopg2
import requests
from typing import Optional

DATABASE_URL = os.environ['DATABASE_URL']
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHANNEL_ID = os.environ.get('TELEGRAM_CHANNEL_ID', '')

def handler(event: dict, context) -> dict:
    '''API для управления новостями и статьями с автопубликацией в Telegram'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            article_id = query_params.get('id')
            
            if article_id:
                cur.execute('''
                    SELECT id, title, description, content, badge, image_url, 
                           published_date, telegram_message_id, is_published
                    FROM news_articles 
                    WHERE id = %s
                ''', (article_id,))
                row = cur.fetchone()
                if row:
                    result = {
                        'id': row[0],
                        'title': row[1],
                        'description': row[2],
                        'content': row[3],
                        'badge': row[4],
                        'image_url': row[5],
                        'published_date': row[6].isoformat() if row[6] else None,
                        'telegram_message_id': row[7],
                        'is_published': row[8]
                    }
                else:
                    result = None
            else:
                cur.execute('''
                    SELECT id, title, description, badge, image_url, published_date, is_published
                    FROM news_articles 
                    WHERE is_published = true
                    ORDER BY published_date DESC
                ''')
                rows = cur.fetchall()
                result = [{
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'badge': row[3],
                    'image_url': row[4],
                    'published_date': row[5].isoformat() if row[5] else None,
                    'is_published': row[6]
                } for row in rows]
            
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, ensure_ascii=False)
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            action = data.get('action', 'create')
            
            if action == 'create':
                title = data.get('title')
                description = data.get('description')
                content = data.get('content')
                badge = data.get('badge', 'Новости')
                image_url = data.get('image_url')
                is_published = data.get('is_published', False)
                
                cur.execute('''
                    INSERT INTO news_articles (title, description, content, badge, image_url, is_published)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (title, description, content, badge, image_url, is_published))
                article_id = cur.fetchone()[0]
                conn.commit()
                
                telegram_message_id = None
                if is_published and TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID:
                    telegram_message_id = publish_to_telegram(title, description, content, image_url, badge)
                    if telegram_message_id:
                        cur.execute('''
                            UPDATE news_articles 
                            SET telegram_message_id = %s 
                            WHERE id = %s
                        ''', (telegram_message_id, article_id))
                        conn.commit()
                
                cur.close()
                conn.close()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': article_id, 'telegram_message_id': telegram_message_id}, ensure_ascii=False)
                }
            
            elif action == 'publish':
                article_id = data.get('id')
                
                cur.execute('''
                    SELECT title, description, content, image_url, badge, is_published
                    FROM news_articles 
                    WHERE id = %s
                ''', (article_id,))
                row = cur.fetchone()
                
                if not row:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)
                    }
                
                if row[5]:
                    cur.close()
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Статья уже опубликована'}, ensure_ascii=False)
                    }
                
                title, description, content, image_url, badge = row[0], row[1], row[2], row[3], row[4]
                
                telegram_message_id = None
                if TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID:
                    telegram_message_id = publish_to_telegram(title, description, content, image_url, badge)
                
                cur.execute('''
                    UPDATE news_articles 
                    SET is_published = true, published_date = CURRENT_TIMESTAMP, telegram_message_id = %s
                    WHERE id = %s
                ''', (telegram_message_id, article_id))
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'telegram_message_id': telegram_message_id}, ensure_ascii=False)
                }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            article_id = data.get('id')
            
            cur.execute('SELECT is_published FROM news_articles WHERE id = %s', (article_id,))
            row = cur.fetchone()
            if row and row[0]:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нельзя редактировать опубликованную статью'}, ensure_ascii=False)
                }
            
            title = data.get('title')
            description = data.get('description')
            content = data.get('content')
            badge = data.get('badge')
            image_url = data.get('image_url')
            
            cur.execute('''
                UPDATE news_articles 
                SET title = %s, description = %s, content = %s, badge = %s, image_url = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (title, description, content, badge, image_url, article_id))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            article_id = query_params.get('id')
            
            cur.execute('DELETE FROM news_articles WHERE id = %s', (article_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}, ensure_ascii=False)
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }

def publish_to_telegram(title: str, description: str, content: str, image_url: Optional[str], badge: str) -> Optional[int]:
    '''Публикация статьи в Telegram канал'''
    try:
        message_text = f"🔔 <b>{badge}</b>\n\n<b>{title}</b>\n\n{description}\n\n{content[:500]}..."
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            'chat_id': TELEGRAM_CHANNEL_ID,
            'text': message_text,
            'parse_mode': 'HTML'
        }
        
        response = requests.post(url, json=payload, timeout=10)
        response_data = response.json()
        
        if response_data.get('ok'):
            return response_data['result']['message_id']
        return None
    except Exception as e:
        print(f"Telegram error: {e}")
        return None
