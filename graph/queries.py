from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

load_dotenv()

class Neo4jConnection:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            os.getenv("NEO4J_URI"),
            auth=(os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD"))
        )

    def close(self):
        self.driver.close()

    def create_article(self, article_id, title, text, domain, date, url):
        with self.driver.session() as session:
            session.run("""
                MERGE (a:Article {id: $id})
                SET a.title = $title,
                    a.text = $text,
                    a.domain = $domain,
                    a.date = $date,
                    a.url = $url
                MERGE (s:Source {domain: $domain})
                MERGE (a)-[:FROM_SOURCE]->(s)
            """, id=article_id, title=title, text=text,
                domain=domain, date=date, url=url)

    def create_claim(self, claim_id, statement, label, speaker):
        with self.driver.session() as session:
            session.run("""
                MERGE (c:Claim {id: $id})
                SET c.statement = $statement,
                    c.label = $label,
                    c.speaker = $speaker
            """, id=claim_id, statement=statement,
                label=label, speaker=speaker)

    def get_articles_by_domain(self, domain):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (a:Article)-[:FROM_SOURCE]->(s:Source {domain: $domain})
                RETURN a.title, a.date, a.url
                LIMIT 10
            """, domain=domain)
            return [dict(r) for r in result]

    def get_claim_stats(self):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (c:Claim)
                RETURN c.label as label, count(*) as count
                ORDER BY count DESC
            """)
            return [dict(r) for r in result]