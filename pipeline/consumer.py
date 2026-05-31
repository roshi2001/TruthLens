import json
import time
from confluent_kafka import Consumer, KafkaError
from dotenv import load_dotenv
import os
import sys
sys.path.append('..')
from graph.queries import Neo4jConnection

load_dotenv()

def process_articles():
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'truthlens-group-3',
        'auto.offset.reset': 'earliest',
        'session.timeout.ms': 30000,
    })
    
    consumer.subscribe(['news-articles'])
    conn = Neo4jConnection()
    
    processed = 0
    start_time = time.time()
    print("Starting consumer — waiting for messages...")

    try:
        while True:
            msg = consumer.poll(timeout=5.0)
            if msg is None:
                if processed > 0:
                    print(f"No more messages. Total processed: {processed}")
                    break
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print(f"End of partition")
                    break
                else:
                    print(f"Error: {msg.error()}")
                    break

            article = json.loads(msg.value().decode('utf-8'))
            try:
                conn.create_article(
                    article_id=article["id"],
                    title=article["title"],
                    text=article["text"][:500],
                    domain=article["domain"],
                    date=article["date"],
                    url=article["url"]
                )
                processed += 1
                if processed % 500 == 0:
                    elapsed = time.time() - start_time
                    throughput = processed / elapsed
                    print(f"Processed {processed} articles | Throughput: {throughput:.1f}/sec")
            except Exception as e:
                print(f"Error: {e}")
    finally:
        consumer.close()
        conn.close()
        print(f"Done. Total processed: {processed}")

if __name__ == "__main__":
    process_articles()