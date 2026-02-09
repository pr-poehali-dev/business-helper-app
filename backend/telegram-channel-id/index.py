import json
import os
import requests

def handler(event: dict, context) -> dict:
    '''
    Служебная функция для получения правильного Channel ID канала Telegram.
    
    Вызывает Telegram Bot API метод getUpdates для получения последних сообщений,
    из которых извлекается настоящий ID канала (начинается с -100).
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    # Получаем токен бота
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    if not bot_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'TELEGRAM_BOT_TOKEN не настроен'})
        }

    # Запрашиваем последние обновления из Telegram
    url = f'https://api.telegram.org/bot{bot_token}/getUpdates'
    
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if not data.get('ok'):
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Ошибка Telegram API',
                    'details': data.get('description', 'Unknown error')
                })
            }
        
        # Ищем сообщения из каналов (начинаются с -100)
        channels = []
        for update in data.get('result', []):
            chat = None
            
            # Проверяем разные типы сообщений
            if 'message' in update:
                chat = update['message'].get('chat')
            elif 'channel_post' in update:
                chat = update['channel_post'].get('chat')
            elif 'my_chat_member' in update:
                chat = update['my_chat_member'].get('chat')
            
            if chat and chat.get('type') == 'channel':
                channel_id = chat.get('id')
                channel_title = chat.get('title', 'Без названия')
                channel_username = chat.get('username', '')
                
                # Добавляем только уникальные каналы
                if not any(c['id'] == channel_id for c in channels):
                    channels.append({
                        'id': channel_id,
                        'title': channel_title,
                        'username': f'@{channel_username}' if channel_username else 'Приватный канал'
                    })
        
        if not channels:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'channels': [],
                    'message': 'Каналов не найдено. Убедитесь, что бот добавлен в канал как администратор и есть хотя бы одно сообщение в канале.'
                })
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'channels': channels,
                'message': f'Найдено каналов: {len(channels)}'
            })
        }
    
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Ошибка запроса к Telegram API',
                'details': str(e)
            })
        }
