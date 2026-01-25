import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления услугами: получение списка, добавление, редактирование и удаление услуг"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            cur.execute("""
                SELECT id, title, description, price, icon, features, 
                       created_at, updated_at 
                FROM t_p81470733_business_helper_app.services 
                ORDER BY created_at DESC
            """)
            services = cur.fetchall()
            
            result = []
            for service in services:
                result.append({
                    'id': service['id'],
                    'title': service['title'],
                    'description': service['description'],
                    'price': service['price'],
                    'icon': service['icon'],
                    'features': service['features'],
                    'created_at': service['created_at'].isoformat() if service['created_at'] else None,
                    'updated_at': service['updated_at'].isoformat() if service['updated_at'] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, ensure_ascii=False)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            title = body.get('title')
            description = body.get('description')
            price = body.get('price')
            icon = body.get('icon', 'Package')
            features = body.get('features', [])
            
            if not all([title, description, price]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Заполните все обязательные поля'}, ensure_ascii=False)
                }
            
            cur.execute("""
                INSERT INTO t_p81470733_business_helper_app.services 
                (title, description, price, icon, features) 
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, title, description, price, icon, features, created_at, updated_at
            """, (title, description, price, icon, features))
            
            new_service = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': new_service['id'],
                    'title': new_service['title'],
                    'description': new_service['description'],
                    'price': new_service['price'],
                    'icon': new_service['icon'],
                    'features': new_service['features'],
                    'created_at': new_service['created_at'].isoformat() if new_service['created_at'] else None,
                    'updated_at': new_service['updated_at'].isoformat() if new_service['updated_at'] else None
                }, ensure_ascii=False)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            service_id = body.get('id')
            title = body.get('title')
            description = body.get('description')
            price = body.get('price')
            icon = body.get('icon', 'Package')
            features = body.get('features', [])
            
            if not all([service_id, title, description, price]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Заполните все обязательные поля'}, ensure_ascii=False)
                }
            
            cur.execute("""
                UPDATE t_p81470733_business_helper_app.services 
                SET title = %s, description = %s, price = %s, icon = %s, 
                    features = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, title, description, price, icon, features, created_at, updated_at
            """, (title, description, price, icon, features, service_id))
            
            updated_service = cur.fetchone()
            
            if not updated_service:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Услуга не найдена'}, ensure_ascii=False)
                }
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': updated_service['id'],
                    'title': updated_service['title'],
                    'description': updated_service['description'],
                    'price': updated_service['price'],
                    'icon': updated_service['icon'],
                    'features': updated_service['features'],
                    'created_at': updated_service['created_at'].isoformat() if updated_service['created_at'] else None,
                    'updated_at': updated_service['updated_at'].isoformat() if updated_service['updated_at'] else None
                }, ensure_ascii=False)
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            service_id = params.get('id')
            
            if not service_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Укажите ID услуги'}, ensure_ascii=False)
                }
            
            cur.execute("""
                DELETE FROM t_p81470733_business_helper_app.services 
                WHERE id = %s
                RETURNING id
            """, (service_id,))
            
            deleted = cur.fetchone()
            
            if not deleted:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Услуга не найдена'}, ensure_ascii=False)
                }
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'id': deleted['id']}, ensure_ascii=False)
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False)
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }
