-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS transportadora_el_directo;
USE transportadora_el_directo;

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de items del carrusel
CREATE TABLE IF NOT EXISTS carousel_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image LONGTEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  `order` INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de información "Sobre Nosotros"
CREATE TABLE IF NOT EXISTS about (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS store (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de información de contacto 
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  telefono VARCHAR(25) NOT NULL,
  email VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  address VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES store(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios
CREATE TABLE IF NOT EXISTS schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  dia VARCHAR(40) NOT NULL,
  horario VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES store(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla pivot para relacionar contactos con horarios
CREATE TABLE IF NOT EXISTS contact_schedule_pivot (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT NOT NULL,
  schedule_id INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contact_info(id),
  FOREIGN KEY (schedule_id) REFERENCES schedule(id),
  UNIQUE KEY (contact_id, schedule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configurar el modo SQL
SET GLOBAL sql_mode='NO_ENGINE_SUBSTITUTION';

-- Insertar datos iniciales

-- Administrador (password: Admin1234)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$ufDbL.U.V/6AoVLjgkRq1.J6Cvq/5YSoOQl07vHjCLKX8Qr3.eUH6');

-- Items del carrusel
INSERT INTO carousel_item (image, title, description, `order`) 
VALUES 
  ('https://ejemplo.com/imagen1.jpg', 'Transporte nacional de carga', 'Experiencia y confiabilidad en todo el país', 1),
  ('https://ejemplo.com/imagen2.jpg', 'Flota moderna', 'Unidades equipadas con tecnología de vanguardia', 2),
  ('https://ejemplo.com/imagen3.jpg', 'Cobertura integral', 'Conectamos las principales ciudades del país', 3);

-- Información "Sobre Nosotros"
INSERT INTO about (content) 
VALUES ('<h2>Transporte El Directo SRL</h2><p>Desde 1960 ofrecemos soluciones logísticas seguras y eficientes para el transporte de mercaderías a nivel nacional. Nuestra trayectoria nos avala como una empresa confiable y comprometida con la excelencia en el servicio.</p>');

-- Sucursales
INSERT INTO store (nombre) 
VALUES 
  ('Rosario - Sede Central'),
  ('Mar del Plata - Sucursal');

-- Información de contacto (CORREGIDO: agregué store_id que faltaba)
INSERT INTO contact_info (store_id, telefono, email, whatsapp, address) 
VALUES 
  (1, '+54 341 1234567', 'rosario@transporteedirecto.com', '+54 341 4397465', 'Sucre 1080, Rosario, Santa Fe'),
  (2, '+54 223 9876543', 'mardelplata@transporteedirecto.com', '+54 223 4771190', 'Teodoro Bronzini 2965, Mar del Plata, Buenos Aires');

-- Horarios para Rosario (store_id = 1)
INSERT INTO schedule (store_id, dia, horario) 
VALUES 
  (1, 'Lunes a Viernes', '07:00 - 15:30'),
  (1, 'Sábado', '07:00 - 11:30'),
  (1, 'Domingo', 'Cerrado'),
  (1, 'Feriados', 'Consultar');

-- Horarios para Mar del Plata (store_id = 2)
INSERT INTO schedule (store_id, dia, horario) 
VALUES 
  (2, 'Lunes a Viernes', '08:00 - 16:00'),
  (2, 'Sábado', '08:00 - 12:00'),
  (2, 'Domingo', 'Cerrado'),
  (2, 'Feriados', 'Consultar');

-- Relacionar contactos con horarios (CORREGIDO: usando store_id en lugar de IDs fijos)
INSERT INTO contact_schedule_pivot (contact_id, schedule_id)
SELECT ci.id, s.id 
FROM contact_info ci
JOIN schedule s ON ci.store_id = s.store_id;