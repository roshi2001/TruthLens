import pytest
import sys
sys.path.append('..')

def test_neo4j_connection_params():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER")
    password = os.getenv("NEO4J_PASSWORD")
    assert uri is not None
    assert user is not None
    assert password is not None

def test_neo4j_uri_format():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    uri = os.getenv("NEO4J_URI")
    assert uri.startswith("bolt://")

def test_article_data_validation():
    article = {
        "id": "test-123",
        "title": "Test Article Title",
        "text": "This is test content",
        "domain": "test.com",
        "date": "2024-01-01",
        "url": "https://test.com/article"
    }
    assert len(article["id"]) > 0
    assert len(article["title"]) > 0
    assert "." in article["domain"]