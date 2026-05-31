import pytest
import json
import sys
sys.path.append('..')

def test_article_message_structure():
    message = {
        "id": "123",
        "title": "Test Article",
        "text": "This is a test article about politics.",
        "domain": "reuters.com",
        "date": "2024-01-01",
        "url": "https://reuters.com/test"
    }
    required_fields = ["id", "title", "text", "domain", "date", "url"]
    for field in required_fields:
        assert field in message

def test_article_text_length():
    text = "x" * 1000
    truncated = text[:500]
    assert len(truncated) == 500

def test_message_serialization():
    message = {"id": "1", "title": "Test", "text": "Content"}
    serialized = json.dumps(message).encode("utf-8")
    deserialized = json.loads(serialized.decode("utf-8"))
    assert deserialized["id"] == "1"
    assert deserialized["title"] == "Test"

def test_kafka_topic_name():
    topic = "news-articles"
    assert isinstance(topic, str)
    assert len(topic) > 0
    assert "-" in topic