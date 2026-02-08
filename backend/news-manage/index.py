"""
API для управления новостями (CRUD операции)
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Управление новостями: создание, редактирование, удаление, публикация"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
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
    
    try:
        # GET - Получить все новости (включая черновики)
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            status_filter = query_params.get('status', '')
            limit = int(query_params.get('limit', '100'))
            offset = int(query_params.get('offset', '0'))
            
            where_clause = f"WHERE status = '{status_filter}'" if status_filter else ""
            
            query = f"""
                SELECT 
                    id, title, description, content, source_url, image_url,
                    badge, status, published_date, created_at
                FROM {schema}.news_articles
                {where_clause}
                ORDER BY created_at DESC
                LIMIT {limit} OFFSET {offset}
            """
            
            cursor.execute(query)
            news = cursor.fetchall()
            
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
                'body': json.dumps({'success': True, 'news': news})
            }
        
        # POST - Создать новую новость
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            query = f"""
                INSERT INTO {schema}.news_articles 
                (title, description, content, source_url, image_url, badge, status, published_date, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """
            
            cursor.execute(query, (
                body.get('title', ''),
                body.get('description', ''),
                body.get('content', ''),
                body.get('source_url', ''),
                body.get('image_url', ''),
                body.get('badge', ''),
                body.get('status', 'draft'),
                body.get('published_date')
            ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'id': result['id'],
                    'message': 'News created successfully'
                })
            }
        
        # PUT - Обновить новость (редактирование или публикация)
        elif method == 'PUT':
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
            
            # Если публикуем новость, устанавливаем дату публикации
            status = body.get('status', 'draft')
            published_date = body.get('published_date')
            
            if status == 'published' and not published_date:
                published_date = datetime.now().date().isoformat()
            
            query = f"""
                UPDATE {schema}.news_articles 
                SET 
                    title = %s,
                    description = %s,
                    content = %s,
                    source_url = %s,
                    image_url = %s,
                    badge = %s,
                    status = %s,
                    published_date = %s
                WHERE id = %s
            """
            
            cursor.execute(query, (
                body.get('title', ''),
                body.get('description', ''),
                body.get('content', ''),
                body.get('source_url', ''),
                body.get('image_url', ''),
                body.get('badge', ''),
                status,
                published_date,
                news_id
            ))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'News updated successfully'
                })
            }
        
        # DELETE - Удалить новость
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            news_id = query_params.get('id')
            
            if not news_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'News ID is required'})
                }
            
            query = f"DELETE FROM {schema}.news_articles WHERE id = %s"
            cursor.execute(query, (news_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': 'News deleted successfully'
                })
            }
        
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
    finally:
        cursor.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
