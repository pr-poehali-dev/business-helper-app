"""
Парсер новостей с сайта sberanalytics.ru и автоматическая публикация
"""
import json
import os
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """Парсинг продуктов с sberanalytics.ru и сохранение в базу данных"""
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
        # Запускаем парсинг
        result = scrape_sberanalytics()
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }


def scrape_sberanalytics():
    """Парсинг продуктов с сberanalytics.ru"""
    try:
        # Получаем страницу
        response = requests.get('https://sberanalytics.ru/products', timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Ищем карточки продуктов
        product_cards = soup.select('li.section-card-product__list')
        
        products = []
        for card in product_cards:
            # Заголовок
            title_elem = card.select_one('h2')
            if not title_elem:
                continue
            title = title_elem.get_text(strip=True)
            
            # Описание
            desc_elem = card.select_one('p')
            description = desc_elem.get_text(strip=True) if desc_elem else ''
            
            # Ссылка
            link_elem = card.select_one('a[href]')
            link = link_elem['href'] if link_elem else ''
            if link and not link.startswith('http'):
                link = f"https://sberanalytics.ru{link}"
            
            # Изображение
            img_elem = card.select_one('img.section-card-product__img-product')
            image_url = ''
            if img_elem and img_elem.get('src'):
                image_url = img_elem['src']
                if image_url and not image_url.startswith('http'):
                    image_url = f"https://sberanalytics.ru{image_url}"
            
            products.append({
                'title': title,
                'description': description,
                'link': link,
                'image_url': image_url
            })
        
        # Сохраняем в базу данных
        saved_count = save_to_database(products)
        
        return {
            'success': True,
            'scraped': len(products),
            'saved': saved_count,
            'products': products
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def save_to_database(products):
    """Сохранение продуктов в базу данных как новостей"""
    database_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    if not database_url:
        raise Exception('DATABASE_URL not found')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    saved_count = 0
    
    for product in products:
        # Проверяем, есть ли уже такая новость
        query = sql.SQL("SELECT id FROM {schema}.{table} WHERE title = %s").format(
            schema=sql.Identifier(schema),
            table=sql.Identifier('news_articles')
        )
        cursor.execute(query, (product['title'],))
        existing = cursor.fetchone()
        
        if not existing:
            # Создаем новую новость
            query = sql.SQL("INSERT INTO {schema}.{table} (title, content, source_url, image_url, status, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s)").format(
                schema=sql.Identifier(schema),
                table=sql.Identifier('news_articles')
            )
            cursor.execute(query, (
                product['title'],
                product['description'],
                product['link'],
                product['image_url'],
                'draft',
                datetime.now(),
                datetime.now()
            ))
            saved_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return saved_count