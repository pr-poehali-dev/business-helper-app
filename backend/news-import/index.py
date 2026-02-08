"""
API для импорта новостей с внешних сайтов
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import requests
from bs4 import BeautifulSoup


def handler(event: dict, context) -> dict:
    """Импорт новостей с сайта sberanalytics.ru"""
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
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Database not configured'})
            }
        
        # Парсинг новостей с сайта sberanalytics.ru
        response = requests.get('https://sberanalytics.ru/news', timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        news_items = []
        articles = soup.find_all('article') or soup.find_all('div', class_='news-item')
        
        for article in articles[:20]:  # Берем первые 20 новостей
            try:
                title_elem = article.find('h2') or article.find('h3') or article.find('a')
                if not title_elem:
                    continue
                    
                title = title_elem.get_text(strip=True)
                
                desc_elem = article.find('p')
                description = desc_elem.get_text(strip=True) if desc_elem else ''
                
                img_elem = article.find('img')
                image_url = ''
                if img_elem and img_elem.get('src'):
                    img_src = img_elem.get('src')
                    if img_src.startswith('http'):
                        image_url = img_src
                    elif img_src.startswith('/'):
                        image_url = f'https://sberanalytics.ru{img_src}'
                
                link_elem = article.find('a', href=True)
                source_url = ''
                if link_elem:
                    href = link_elem.get('href')
                    if href.startswith('http'):
                        source_url = href
                    elif href.startswith('/'):
                        source_url = f'https://sberanalytics.ru{href}'
                
                date_elem = article.find('time') or article.find(class_='date')
                published_date = None
                if date_elem:
                    date_text = date_elem.get_text(strip=True)
                    try:
                        published_date = datetime.strptime(date_text, '%d.%m.%Y').date()
                    except:
                        pass
                
                if title and len(title) > 10:
                    news_items.append({
                        'title': title,
                        'description': description,
                        'image_url': image_url,
                        'source_url': source_url,
                        'published_date': published_date
                    })
            except Exception as e:
                print(f'Error parsing article: {e}')
                continue
        
        if not news_items:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'imported': 0,
                    'message': 'No news found on the page'
                })
            }
        
        # Сохранение в базу данных
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        imported_count = 0
        for item in news_items:
            # Проверяем, нет ли уже такой новости
            check_query = f"SELECT id FROM {schema}.news_articles WHERE title = %s"
            cursor.execute(check_query, (item['title'],))
            existing = cursor.fetchone()
            
            if not existing:
                insert_query = f"""
                    INSERT INTO {schema}.news_articles 
                    (title, description, image_url, source_url, published_date, status, created_at)
                    VALUES (%s, %s, %s, %s, %s, 'draft', NOW())
                """
                cursor.execute(insert_query, (
                    item['title'],
                    item['description'],
                    item['image_url'],
                    item['source_url'],
                    item['published_date']
                ))
                imported_count += 1
        
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
                'imported': imported_count,
                'total_found': len(news_items)
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
