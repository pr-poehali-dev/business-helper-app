import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API для управления партнёрскими предложениями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            category = query_params.get('category')
            
            if category and category != 'all':
                cur.execute("""
                    SELECT id, category, partner, partner_logo, title, description, 
                           price, old_price, features, rating, reviews, created_at, updated_at
                    FROM t_p81470733_business_helper_app.partner_offers
                    WHERE category = %s
                    ORDER BY created_at DESC
                """, (category,))
            else:
                cur.execute("""
                    SELECT id, category, partner, partner_logo, title, description, 
                           price, old_price, features, rating, reviews, created_at, updated_at
                    FROM t_p81470733_business_helper_app.partner_offers
                    ORDER BY created_at DESC
                """)
            
            rows = cur.fetchall()
            offers = []
            for row in rows:
                offers.append({
                    'id': row[0],
                    'category': row[1],
                    'partner': row[2],
                    'partnerLogo': row[3],
                    'title': row[4],
                    'description': row[5],
                    'price': row[6],
                    'oldPrice': row[7],
                    'features': row[8],
                    'rating': float(row[9]) if row[9] else 0.0,
                    'reviews': row[10],
                    'createdAt': row[11].isoformat() if row[11] else None,
                    'updatedAt': row[12].isoformat() if row[12] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(offers),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            category = data.get('category')
            partner = data.get('partner')
            partner_logo = data.get('partnerLogo', '🏢')
            title = data.get('title')
            description = data.get('description')
            price = data.get('price')
            old_price = data.get('oldPrice')
            features = data.get('features', [])
            rating = data.get('rating', 0.0)
            reviews = data.get('reviews', 0)
            
            if not all([category, partner, title, description, price]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO t_p81470733_business_helper_app.partner_offers 
                (category, partner, partner_logo, title, description, price, old_price, features, rating, reviews, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (category, partner, partner_logo, title, description, price, old_price, features, rating, reviews, datetime.now(), datetime.now()))
            
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': new_id, 'message': 'Partner offer created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            offer_id = data.get('id')
            
            if not offer_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing offer id'}),
                    'isBase64Encoded': False
                }
            
            category = data.get('category')
            partner = data.get('partner')
            partner_logo = data.get('partnerLogo')
            title = data.get('title')
            description = data.get('description')
            price = data.get('price')
            old_price = data.get('oldPrice')
            features = data.get('features')
            rating = data.get('rating')
            reviews = data.get('reviews')
            
            cur.execute("""
                UPDATE t_p81470733_business_helper_app.partner_offers
                SET category = %s, partner = %s, partner_logo = %s, title = %s, 
                    description = %s, price = %s, old_price = %s, features = %s,
                    rating = %s, reviews = %s, updated_at = %s
                WHERE id = %s
            """, (category, partner, partner_logo, title, description, price, old_price, features, rating, reviews, datetime.now(), offer_id))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Partner offer updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            offer_id = query_params.get('id')
            
            if not offer_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing offer id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                DELETE FROM t_p81470733_business_helper_app.partner_offers
                WHERE id = %s
            """, (offer_id,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Partner offer deleted'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
