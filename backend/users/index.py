import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import hashlib

DSN = os.environ.get('DATABASE_URL')

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    '''API для управления клиентами и их аутентификацией'''
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
    
    try:
        conn = psycopg2.connect(DSN)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('id')
            
            if user_id:
                cur.execute('''
                    SELECT id, email, full_name, phone, company_name, 
                           created_at, last_login, is_active
                    FROM t_p81470733_business_helper_app.users 
                    WHERE id = %s
                ''', (user_id,))
                user = cur.fetchone()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(user) if user else None, default=str)
                }
            else:
                cur.execute('''
                    SELECT id, email, full_name, phone, company_name, 
                           created_at, last_login, is_active
                    FROM t_p81470733_business_helper_app.users 
                    ORDER BY created_at DESC
                ''')
                users = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(u) for u in users], default=str)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'login':
                email = body.get('email')
                password = body.get('password')
                password_hash = hash_password(password)
                
                cur.execute('''
                    SELECT id, email, full_name, phone, company_name, is_active
                    FROM t_p81470733_business_helper_app.users 
                    WHERE email = %s AND password_hash = %s
                ''', (email, password_hash))
                user = cur.fetchone()
                
                if user:
                    cur.execute('''
                        UPDATE t_p81470733_business_helper_app.users 
                        SET last_login = CURRENT_TIMESTAMP 
                        WHERE id = %s
                    ''', (user['id'],))
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True, 'user': dict(user)}, default=str)
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': False, 'error': 'Неверный email или пароль'})
                    }
            
            elif action == 'register':
                email = body.get('email')
                password = body.get('password')
                full_name = body.get('full_name')
                phone = body.get('phone', '')
                company_name = body.get('company_name', '')
                
                password_hash = hash_password(password)
                
                cur.execute('''
                    INSERT INTO t_p81470733_business_helper_app.users 
                    (email, password_hash, full_name, phone, company_name)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, email, full_name, phone, company_name, created_at
                ''', (email, password_hash, full_name, phone, company_name))
                
                new_user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'user': dict(new_user)}, default=str)
                }
            
            else:
                cur.execute('''
                    INSERT INTO t_p81470733_business_helper_app.users 
                    (email, password_hash, full_name, phone, company_name)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, email, full_name, phone, company_name, created_at
                ''', (
                    body.get('email'),
                    hash_password(body.get('password', 'changeme')),
                    body.get('full_name'),
                    body.get('phone', ''),
                    body.get('company_name', '')
                ))
                
                new_user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(new_user), default=str)
                }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('id')
            
            updates = []
            params = []
            
            if 'full_name' in body:
                updates.append('full_name = %s')
                params.append(body['full_name'])
            if 'phone' in body:
                updates.append('phone = %s')
                params.append(body['phone'])
            if 'company_name' in body:
                updates.append('company_name = %s')
                params.append(body['company_name'])
            if 'is_active' in body:
                updates.append('is_active = %s')
                params.append(body['is_active'])
            
            params.append(user_id)
            
            cur.execute(f'''
                UPDATE t_p81470733_business_helper_app.users 
                SET {', '.join(updates)}
                WHERE id = %s
                RETURNING id, email, full_name, phone, company_name, is_active
            ''', params)
            
            updated_user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_user), default=str)
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('id')
            
            cur.execute('UPDATE t_p81470733_business_helper_app.users SET is_active = false WHERE id = %s', (user_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
