"""
API для публикации новостей в Telegram канал и обновления статуса в БД
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import requests


def handler(event: dict, context) -> dict:
    """Публикация новости в Telegram канал и изменение статуса на 'published'"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    if method == 'POST':
        database_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        telegram_bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        telegram_channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        if not telegram_bot_token or not telegram_channel_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram credentials not configured'})
            }
        
        body = json.loads(event.get('body', '{}'))
        news_id = body.get('id')
        
        if not news_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'News ID is required'})
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Получаем данные новости
        query = f"SELECT * FROM {schema}.news_articles WHERE id = %s"
        cursor.execute(query, (news_id,))
        news = cursor.fetchone()
        
        if not news:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'News not found'})
            }
        
        # Формируем текст для Telegram
        title = news['title']
        description = news['description'] or ''
        source_url = news['source_url'] or ''
        image_url = news['image_url'] or ''
        
        # Формат сообщения
        message_parts = [f"📰 <b>{title}</b>"]
        
        if description:
            message_parts.append(f"\n{description}")
        
        if source_url:
            message_parts.append(f'\n\n🔗 <a href="{source_url}">Читать полностью</a>')
        
        message = '\n'.join(message_parts)
        
        # Публикуем в Telegram
        telegram_api_url = f'https://api.telegram.org/bot{telegram_bot_token}'
        
        try:
            if image_url:
                # Публикуем с картинкой
                response = requests.post(
                    f'{telegram_api_url}/sendPhoto',
                    json={
                        'chat_id': telegram_channel_id,
                        'photo': image_url,
                        'caption': message,
                        'parse_mode': 'HTML'
                    },
                    timeout=10
                )
            else:
                # Публикуем без картинки
                response = requests.post(
                    f'{telegram_api_url}/sendMessage',
                    json={
                        'chat_id': telegram_channel_id,
                        'text': message,
                        'parse_mode': 'HTML',
                        'disable_web_page_preview': False
                    },
                    timeout=10
                )
            
            telegram_result = response.json()
            
            if not telegram_result.get('ok'):
                cursor.close()
                conn.close()
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': 'Telegram API error',
                        'details': telegram_result.get('description', 'Unknown error')
                    })
                }
        
        except Exception as e:
            cursor.close()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Failed to publish to Telegram: {str(e)}'})
            }
        
        # Обновляем статус новости в БД
        published_date = datetime.now().date().isoformat()
        
        update_query = f"""
            UPDATE {schema}.news_articles 
            SET status = 'published', published_date = %s
            WHERE id = %s
        """
        
        cursor.execute(update_query, (published_date, news_id))
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'News published to Telegram and updated in DB',
                'telegram_message_id': telegram_result['result']['message_id']
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
