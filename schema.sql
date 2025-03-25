CREATE TABLE ebooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  file_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ebook_purchases (
  id TEXT PRIMARY KEY,
  ebook_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  token_used INTEGER NOT NULL,
  payment_status TEXT NOT NULL,
  FOREIGN KEY (ebook_id) REFERENCES ebooks(id)
);

CREATE TABLE ebook_downloads (
  id TEXT PRIMARY KEY,
  ebook_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ebook_id) REFERENCES ebooks(id)
);

CREATE TABLE ebook_analytics (
  id TEXT PRIMARY KEY,
  ebook_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ebook_id) REFERENCES ebooks(id)
);

CREATE INDEX idx_ebook_purchases_user ON ebook_purchases(user_id);
CREATE INDEX idx_ebook_downloads_user ON ebook_downloads(user_id);
CREATE INDEX idx_ebook_analytics_ebook ON ebook_analytics(ebook_id);
