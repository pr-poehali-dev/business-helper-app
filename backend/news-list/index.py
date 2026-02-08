"""
API для получения списка опубликованных новостей
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """Получение списка опубликованных новостей"""
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
    
    if method == 'GET':
        try:
            database_url = os.environ.get('DATABASE_URL')
            schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
            
            if not database_url:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Database not configured'})
                }
            
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            
            query_params = event.get('queryStringParameters') or {}
            limit = int(query_params.get('limit', '20'))
            offset = int(query_params.get('offset', '0'))
            
            query = f"""
                SELECT 
                    id, 
                    title, 
                    description,
                    content, 
                    source_url, 
                    image_url,
                    badge,
                    published_date,
                    created_at
                FROM {schema}.news_articles 
                WHERE status = 'published'
                ORDER BY published_date DESC NULLS LAST, created_at DESC
                LIMIT {limit} OFFSET {offset}
            """
            
            cursor.execute(query)
            news = cursor.fetchall()
            
            count_query = f"SELECT COUNT(*) as total FROM {schema}.news_articles WHERE status = 'published'"
            cursor.execute(count_query)
            total = cursor.fetchone()['total']
            
            cursor.close()
            conn.close()
            
            for item in news:
                if item.get('published_date'):
                    item['published_date'] = item['published_date'].isoformat()
                if item.get('created_at'):
                    item['created_at'] = item['created_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'news': news,
                    'total': total,
                    'limit': limit,
                    'offset': offset
                })
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }