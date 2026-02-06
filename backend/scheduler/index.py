"""
Планировщик для автоматического запуска ИИ-агента по расписанию
"""
import json
import os
from datetime import datetime
import requests


def handler(event: dict, context) -> dict:
    """Автоматический запуск ИИ-агента по расписанию"""
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
        # Запускаем полный цикл агента
        result = run_scheduled_job()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    if method == 'GET':
        # Информация о планировщике
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'active',
                'last_run': datetime.now().isoformat(),
                'schedule': 'Manual trigger via webhook'
            }, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }


def run_scheduled_job():
    """Запуск полного цикла ИИ-агента"""
    ai_agent_url = 'https://functions.poehali.dev/c42f2362-0697-4b7f-acd6-202c45772cba'
    
    try:
        response = requests.post(
            ai_agent_url,
            headers={'Content-Type': 'application/json'},
            json={'action': 'auto'},
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                'success': True,
                'timestamp': datetime.now().isoformat(),
                'result': result
            }
        else:
            return {
                'success': False,
                'error': f'Agent returned status {response.status_code}',
                'timestamp': datetime.now().isoformat()
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
