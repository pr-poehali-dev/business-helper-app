"""
API для публикации новостей в Telegram канал, ВКонтакте и обновления статуса в БД
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import requests


def publish_to_telegram(bot_token: str, channel_id: str, title: str, description: str, source_url: str, image_url: str) -> dict:
    """Публикация новости в Telegram"""
    message_parts = [f"📰 <b>{title}</b>"]
    
    if description:
        message_parts.append(f"\n{description}")
    
    if source_url:
        message_parts.append(f'\n\n🔗 <a href="{source_url}">Читать полностью</a>')
    
    message = '\n'.join(message_parts)
    telegram_api_url = f'https://api.telegram.org/bot{bot_token}'
    
    print(f'[Telegram] Sending to channel: {channel_id}')
    print(f'[Telegram] Has image: {bool(image_url)}')
    
    if image_url:
        response = requests.post(
            f'{telegram_api_url}/sendPhoto',
            json={
                'chat_id': channel_id,
                'photo': image_url,
                'caption': message,
                'parse_mode': 'HTML'
            },
            timeout=10
        )
    else:
        response = requests.post(
            f'{telegram_api_url}/sendMessage',
            json={
                'chat_id': channel_id,
                'text': message,
                'parse_mode': 'HTML',
                'disable_web_page_preview': False
            },
            timeout=10
        )
    
    result = response.json()
    print(f'[Telegram] Response: {result}')
    return result


def publish_to_vk(access_token: str, group_id: str, title: str, description: str, source_url: str, image_url: str) -> dict:
    """Публикация новости в ВКонтакте"""
    message_parts = [f"📰 {title}"]
    
    if description:
        message_parts.append(f"\n{description}")
    
    if source_url:
        message_parts.append(f"\n\n🔗 Читать полностью: {source_url}")
    
    message = '\n'.join(message_parts)
    
    # Преобразуем group_id в число (убираем префикс club/public/event если есть)
    try:
        # Удаляем префиксы club, public, event и точку в конце
        clean_id = group_id.replace('club', '').replace('public', '').replace('event', '').rstrip('.')
        owner_id = -int(clean_id)
    except ValueError:
        print(f'[VK] ERROR: Invalid group_id: {group_id}')
        return {'error': {'error_msg': f'Invalid group_id: {group_id}'}}
    
    print(f'[VK] Posting to group: {owner_id} (from group_id: {group_id})')
    print(f'[VK] Has image: {bool(image_url)}')
    
    # Параметры для wall.post
    params = {
        'access_token': access_token,
        'owner_id': owner_id,
        'from_group': 1,
        'message': message,
        'v': '5.131'
    }
    
    print(f'[VK] Params: {params}')
    
    # Если есть изображение, сначала загружаем его
    if image_url:
        try:
            # Получаем URL для загрузки фото
            upload_server_response = requests.get(
                'https://api.vk.com/method/photos.getWallUploadServer',
                params={
                    'access_token': access_token,
                    'group_id': group_id,
                    'v': '5.131'
                },
                timeout=10
            )
            upload_server_data = upload_server_response.json()
            
            if upload_server_data.get('response', {}).get('upload_url'):
                upload_url = upload_server_data['response']['upload_url']
                
                # Скачиваем картинку
                image_response = requests.get(image_url, timeout=10)
                
                # Загружаем на VK сервер
                upload_response = requests.post(
                    upload_url,
                    files={'photo': ('image.jpg', image_response.content, 'image/jpeg')},
                    timeout=10
                )
                upload_data = upload_response.json()
                
                # Сохраняем фото
                save_response = requests.get(
                    'https://api.vk.com/method/photos.saveWallPhoto',
                    params={
                        'access_token': access_token,
                        'group_id': group_id,
                        'photo': upload_data.get('photo'),
                        'server': upload_data.get('server'),
                        'hash': upload_data.get('hash'),
                        'v': '5.131'
                    },
                    timeout=10
                )
                save_data = save_response.json()
                
                if save_data.get('response'):
                    photo = save_data['response'][0]
                    params['attachments'] = f"photo{photo['owner_id']}_{photo['id']}"
        
        except Exception as e:
            print(f'VK photo upload error: {e}')
    
    # Публикуем пост
    response = requests.get(
        'https://api.vk.com/method/wall.post',
        params=params,
        timeout=10
    )
    
    result = response.json()
    print(f'[VK] Response: {result}')
    return result


def handler(event: dict, context) -> dict:
    """Публикация новости в Telegram, ВКонтакте и изменение статуса на 'published'"""
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
        vk_access_token = os.environ.get('VK_ACCESS_TOKEN')
        vk_group_id = os.environ.get('VK_GROUP_ID')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Database not configured'})
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
        query = f"SELECT * FROM {schema}.news_articles WHERE id = {news_id}"
        cursor.execute(query)
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
        
        title = news['title']
        description = news['description'] or ''
        source_url = news['source_url'] or ''
        image_url = news['image_url'] or ''
        
        print(f'[Handler] Publishing news #{news_id}: {title[:50]}...')
        print(f'[Handler] Has Telegram creds: {bool(telegram_bot_token and telegram_channel_id)}')
        print(f'[Handler] Has VK creds: {bool(vk_access_token and vk_group_id)}')
        
        results = {
            'telegram': {'success': False, 'error': None},
            'vk': {'success': False, 'error': None}
        }
        
        # Публикуем в Telegram
        if telegram_bot_token and telegram_channel_id:
            try:
                telegram_result = publish_to_telegram(
                    telegram_bot_token, 
                    telegram_channel_id, 
                    title, 
                    description, 
                    source_url, 
                    image_url
                )
                
                if telegram_result.get('ok'):
                    results['telegram']['success'] = True
                    results['telegram']['message_id'] = telegram_result['result']['message_id']
                else:
                    results['telegram']['error'] = telegram_result.get('description', 'Unknown error')
            
            except Exception as e:
                results['telegram']['error'] = str(e)
        
        # Публикуем в ВКонтакте
        if vk_access_token and vk_group_id:
            try:
                vk_result = publish_to_vk(
                    vk_access_token, 
                    vk_group_id, 
                    title, 
                    description, 
                    source_url, 
                    image_url
                )
                
                if vk_result.get('response', {}).get('post_id'):
                    results['vk']['success'] = True
                    results['vk']['post_id'] = vk_result['response']['post_id']
                else:
                    error = vk_result.get('error', {})
                    results['vk']['error'] = error.get('error_msg', 'Unknown error')
            
            except Exception as e:
                results['vk']['error'] = str(e)
        
        # Обновляем статус новости в БД только если хотя бы одна публикация успешна
        if results['telegram']['success'] or results['vk']['success']:
            published_date = datetime.now().date().isoformat()
            
            update_query = f"""
                UPDATE {schema}.news_articles 
                SET status = 'published', published_date = '{published_date}'
                WHERE id = {news_id}
            """
            
            cursor.execute(update_query)
            conn.commit()
        
        cursor.close()
        conn.close()
        
        # Формируем сообщение о результате
        success_count = sum(1 for r in results.values() if r['success'])
        
        if success_count == 0:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'Failed to publish to any platform',
                    'results': results
                })
            }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': f'News published to {success_count} platform(s)',
                'results': results
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