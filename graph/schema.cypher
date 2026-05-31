// Constraints
CREATE CONSTRAINT article_id IF NOT EXISTS FOR (a:Article) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT entity_name IF NOT EXISTS FOR (e:Entity) REQUIRE e.name IS UNIQUE;
CREATE CONSTRAINT claim_id IF NOT EXISTS FOR (c:Claim) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT source_domain IF NOT EXISTS FOR (s:Source) REQUIRE s.domain IS UNIQUE;

// Indexes
CREATE INDEX article_date IF NOT EXISTS FOR (a:Article) ON (a.date);
CREATE INDEX claim_label IF NOT EXISTS FOR (c:Claim) ON (c.label);
CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type);