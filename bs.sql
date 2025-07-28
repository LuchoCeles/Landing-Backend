-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS transportadora_el_directo;
USE transportadora_el_directo;

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de items del carrusel
CREATE TABLE IF NOT EXISTS carousel_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  text TEXT,
  `order` INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de información "Sobre Nosotros"
CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de información de contacto (versión nueva con estructura diferente)
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(25) NOT NULL,
  email VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios (versión nueva con estructura diferente)
CREATE TABLE IF NOT EXISTS schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sucursal VARCHAR(50) NOT NULL,
  dia VARCHAR(40) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configurar el modo SQL para evitar problemas de compatibilidad
SET GLOBAL sql_mode='NO_ENGINE_SUBSTITUTION';

-- Insertar usuario administrador inicial (contraseña: admin123)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYV7Z1Qy6ZAl/CsMpKW7zJYQYFggJO');

-- Insertar datos iniciales del carrusel (igual en ambas versiones)
INSERT INTO carousel_item (image_url, title, text, `order`) 
VALUES 
  ('https://ejemplo.com/imagen1.jpg', 'Primer Slide', 'Transporte seguro y confiable', 0),
  ('https://ejemplo.com/imagen2.jpg', 'Segundo Slide', 'Servicio a todo el país', 1);

-- Insertar texto inicial "Sobre Nosotros" (igual en ambas versiones)
INSERT INTO about (content) 
VALUES ('Transporte El Directo SRL es una empresa con más de 20 años de experiencia en el rubro del transporte de cargas. Nos especializamos en entregas rápidas y seguras en todo el territorio nacional.');

-- Insertar datos iniciales de contacto (adaptado a la nueva estructura)
-- Nota: La nueva estructura no tiene separación por ciudad, así que elegí el teléfono de Rosario como principal
INSERT INTO contact_info (telefono, email, whatsapp) 
VALUES 
  ('+54 341 1234567', 'info@transporteedirecto.com', '+54 9 341 1234567');

-- Insertar horarios iniciales (adaptado a la nueva estructura)
INSERT INTO schedule (sucursal, dia, hora_inicio, hora_fin) 
VALUES 
  ('Rosario', 'Lunes', '08:00:00', '18:00:00'),
  ('Rosario', 'Martes', '08:00:00', '18:00:00'),
  ('Rosario', 'Miércoles', '08:00:00', '18:00:00'),
  ('Rosario', 'Jueves', '08:00:00', '18:00:00'),
  ('Rosario', 'Viernes', '08:00:00', '18:00:00'),
  ('Rosario', 'Sábado', '09:00:00', '13:00:00'),
  ('Mar del Plata', 'Lunes', '09:00:00', '17:00:00'),
  ('Mar del Plata', 'Martes', '09:00:00', '17:00:00'),
  ('Mar del Plata', 'Miércoles', '09:00:00', '17:00:00'),
  ('Mar del Plata', 'Jueves', '09:00:00', '17:00:00'),
  ('Mar del Plata', 'Viernes', '09:00:00', '17:00:00');