CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(type);

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

-- Nueva tabla para consultas y contactos (sincroniza con Notion)
CREATE TABLE contactos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  asunto TEXT,
  mensaje TEXT,
  estado TEXT DEFAULT 'Nuevo',
  notion_id TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contactos_email ON contactos(email);
CREATE INDEX idx_contactos_estado ON contactos(estado);

-- Tabla para usuarios
CREATE TABLE usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  roles TEXT DEFAULT 'cliente',
  activo INTEGER DEFAULT 1,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  ultima_sesion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_roles ON usuarios(roles);

-- Tabla para servicios legales
CREATE TABLE servicios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio REAL NOT NULL,
  duracion INTEGER, -- en minutos
  disponible INTEGER DEFAULT 1,
  categoria TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_servicios_categoria ON servicios(categoria);
CREATE INDEX idx_servicios_disponible ON servicios(disponible);

-- Tabla para pagos
CREATE TABLE pagos (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  servicio_id TEXT,
  monto REAL NOT NULL,
  estado TEXT NOT NULL,
  metodo_pago TEXT NOT NULL,
  referencia_externa TEXT,
  notion_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

CREATE INDEX idx_pagos_usuario ON pagos(usuario_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);

-- Tabla para consultas de OpenAI
CREATE TABLE ai_consultas (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  respuesta TEXT,
  tokens_usados INTEGER NOT NULL,
  modelo TEXT NOT NULL,
  estado TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_ai_consultas_usuario ON ai_consultas(usuario_id);

-- Tabla para registro de tokens de OpenAI
CREATE TABLE ai_tokens (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  tokens_usados INTEGER NOT NULL DEFAULT 0,
  tokens_disponibles INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_ai_tokens_usuario ON ai_tokens(usuario_id);

-- Tabla para citas y consultas legales
CREATE TABLE citas (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  servicio_id TEXT NOT NULL,
  fecha DATETIME NOT NULL,
  estado TEXT NOT NULL,
  notas TEXT,
  notion_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

CREATE INDEX idx_citas_usuario ON citas(usuario_id);
CREATE INDEX idx_citas_fecha ON citas(fecha);
CREATE INDEX idx_citas_estado ON citas(estado);

-- Tabla para logs de sistema
CREATE TABLE system_logs (
  id TEXT PRIMARY KEY,
  nivel TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  contexto TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_logs_nivel ON system_logs(nivel);
CREATE INDEX idx_system_logs_created ON system_logs(created_at);

CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notion_id TEXT,
  FOREIGN KEY (author_id) REFERENCES usuarios(id)
);

CREATE TABLE ebooks_new (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notion_id TEXT
);

CREATE TABLE debates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notion_id TEXT,
  FOREIGN KEY (author_id) REFERENCES usuarios(id)
);

CREATE TABLE client_segments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  segment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

CREATE TABLE whatsapp_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);
