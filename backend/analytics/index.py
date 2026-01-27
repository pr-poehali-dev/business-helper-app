import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

DSN = os.environ.get('DATABASE_URL')

def handler(event: dict, context) -> dict:
    '''API для аналитики действий клиентов и формирования рекомендаций'''
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
    
    try:
        conn = psycopg2.connect(DSN)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('user_id')
            action_type = query_params.get('type')
            report_type = query_params.get('report')
            
            if report_type == 'user_profile':
                cur.execute('''
                    SELECT 
                        u.id,
                        u.email,
                        u.full_name,
                        u.phone,
                        u.company_name,
                        u.created_at,
                        u.last_login,
                        COUNT(DISTINCT ua.id) as total_actions,
                        COUNT(DISTINCT CASE WHEN ua.action_type = 'view_service' THEN ua.service_id END) as viewed_services,
                        COUNT(DISTINCT CASE WHEN ua.action_type = 'view_offer' THEN ua.partner_offer_id END) as viewed_offers,
                        COUNT(DISTINCT CASE WHEN ua.action_type = 'submit_order' THEN ua.id END) as orders_count,
                        MAX(ua.created_at) as last_activity
                    FROM t_p81470733_business_helper_app.users u
                    LEFT JOIN t_p81470733_business_helper_app.user_actions ua ON u.id = ua.user_id
                    WHERE u.id = %s
                    GROUP BY u.id
                ''', (user_id,))
                profile = cur.fetchone()
                
                cur.execute('''
                    SELECT action_type, COUNT(*) as count
                    FROM t_p81470733_business_helper_app.user_actions
                    WHERE user_id = %s
                    GROUP BY action_type
                    ORDER BY count DESC
                ''', (user_id,))
                action_stats = cur.fetchall()
                
                cur.execute('''
                    SELECT 
                        s.title as service_name,
                        COUNT(*) as views
                    FROM t_p81470733_business_helper_app.user_actions ua
                    JOIN t_p81470733_business_helper_app.services s ON ua.service_id = s.id
                    WHERE ua.user_id = %s AND ua.action_type = 'view_service'
                    GROUP BY s.id, s.title
                    ORDER BY views DESC
                    LIMIT 5
                ''', (user_id,))
                top_services = cur.fetchall()
                
                cur.execute('''
                    SELECT 
                        po.title as offer_name,
                        po.partner,
                        COUNT(*) as views
                    FROM t_p81470733_business_helper_app.user_actions ua
                    JOIN t_p81470733_business_helper_app.partner_offers po ON ua.partner_offer_id = po.id
                    WHERE ua.user_id = %s AND ua.action_type = 'view_offer'
                    GROUP BY po.id, po.title, po.partner
                    ORDER BY views DESC
                    LIMIT 5
                ''', (user_id,))
                top_offers = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'profile': dict(profile) if profile else None,
                        'action_stats': [dict(a) for a in action_stats],
                        'top_services': [dict(s) for s in top_services],
                        'top_offers': [dict(o) for o in top_offers]
                    }, default=str)
                }
            
            elif report_type == 'all_users':
                cur.execute('''
                    SELECT 
                        u.id,
                        u.email,
                        u.full_name,
                        u.company_name,
                        u.created_at,
                        u.last_login,
                        COUNT(DISTINCT ua.id) as total_actions,
                        COUNT(DISTINCT CASE WHEN ua.action_type = 'submit_order' THEN ua.id END) as orders_count,
                        MAX(ua.created_at) as last_activity
                    FROM t_p81470733_business_helper_app.users u
                    LEFT JOIN t_p81470733_business_helper_app.user_actions ua ON u.id = ua.user_id
                    WHERE u.is_active = true
                    GROUP BY u.id
                    ORDER BY total_actions DESC
                ''')
                users_analytics = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(u) for u in users_analytics], default=str)
                }
            
            elif report_type == 'popular_services':
                cur.execute('''
                    SELECT 
                        s.id,
                        s.title,
                        s.price,
                        COUNT(ua.id) as view_count,
                        COUNT(DISTINCT ua.user_id) as unique_users
                    FROM t_p81470733_business_helper_app.services s
                    LEFT JOIN t_p81470733_business_helper_app.user_actions ua 
                        ON s.id = ua.service_id AND ua.action_type = 'view_service'
                    GROUP BY s.id
                    ORDER BY view_count DESC
                ''')
                services = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(s) for s in services], default=str)
                }
            
            elif user_id:
                if action_type:
                    cur.execute('''
                        SELECT * FROM t_p81470733_business_helper_app.user_actions
                        WHERE user_id = %s AND action_type = %s
                        ORDER BY created_at DESC
                        LIMIT 100
                    ''', (user_id, action_type))
                else:
                    cur.execute('''
                        SELECT * FROM t_p81470733_business_helper_app.user_actions
                        WHERE user_id = %s
                        ORDER BY created_at DESC
                        LIMIT 100
                    ''', (user_id,))
                
                actions = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(a) for a in actions], default=str)
                }
            else:
                cur.execute('''
                    SELECT * FROM t_p81470733_business_helper_app.user_actions
                    ORDER BY created_at DESC
                    LIMIT 100
                ''')
                actions = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(a) for a in actions], default=str)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO t_p81470733_business_helper_app.user_actions
                (user_id, action_type, action_description, page_url, 
                 service_id, partner_offer_id, metadata, ip_address, user_agent)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, created_at
            ''', (
                body.get('user_id'),
                body.get('action_type'),
                body.get('action_description'),
                body.get('page_url'),
                body.get('service_id'),
                body.get('partner_offer_id'),
                json.dumps(body.get('metadata', {})),
                body.get('ip_address'),
                body.get('user_agent')
            ))
            
            result = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result), default=str)
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
