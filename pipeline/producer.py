import json
import time
from confluent_kafka import Producer
from datasets import load_dataset
from dotenv import load_dotenv
import os

load_dotenv()

def create_producer():
    return Producer({'bootstrap.servers': 'localhost:9092'})

def stream_articles(delay=0.001):
    producer = create_producer()
    print("Loading CC-News dataset...")
    
    ds = load_dataset("vblagoje/cc_news", split="train")
    print(f"Streaming {len(ds)} articles to Kafka topic: news-articles")
    
    sent = 0
    for i, article in enumerate(ds):
        if not article.get("text") or len(article["text"]) < 50:
            continue
        
        message = {
            "id": str(i),
            "title": article.get("title", ""),
            "text": article.get("text", "")[:1000],
            "domain": article.get("domain", ""),
            "date": str(article.get("date", "")),
            "url": article.get("url", ""),
        }
        
        producer.produce(
            topic="news-articles",
            key=str(i),
            value=json.dumps(message).encode('utf-8')
        )
        sent += 1
        
        if sent % 1000 == 0:
            print(f"Sent {sent} articles...")
            producer.flush()
        
        time.sleep(delay)
    
    producer.flush()
    print(f"Done. Total articles sent: {sent}")

if __name__ == "__main__":
    stream_articles()