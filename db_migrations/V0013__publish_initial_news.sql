UPDATE t_p81470733_business_helper_app.news_articles 
SET 
    status = 'published', 
    is_published = true, 
    published_date = CURRENT_TIMESTAMP 
WHERE id IN (1, 2, 4, 5, 6, 7);