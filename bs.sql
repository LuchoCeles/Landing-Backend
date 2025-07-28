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

-- Tabla de información de contacto 
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  telefono VARCHAR(25) NOT NULL,
  email VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de horarios
CREATE TABLE IF NOT EXISTS schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sucursal VARCHAR(50) NOT NULL,
  dia VARCHAR(40) NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla pivot para relacionar contactos con horarios
CREATE TABLE IF NOT EXISTS contact_schedule_pivot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    schedule_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact_info(id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(id),
    UNIQUE KEY (contact_id, schedule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Configurar el modo SQL para evitar problemas de compatibilidad
SET GLOBAL sql_mode='NO_ENGINE_SUBSTITUTION';

-- Insertar usuario administrador inicial (contraseña: admin123)
INSERT INTO admin (username, password) 
VALUES ('admin', '$2a$10$ufDbL.U.V/6AoVLjgkRq1.J6Cvq/5YSoOQl07vHjCLKX8Qr3.eUH6'); -- Contraseña hasheada con bcrypt

INSERT INTO carousel_item (image_url, title, text, `order`) 
VALUES 
  ('https://ejemplo.com/imagen1.jpg', 'Primer Slide', 'Transporte seguro y confiable', 0),
  ('https://ejemplo.com/imagen2.jpg', 'Segundo Slide', 'Servicio a todo el país', 1);

INSERT INTO about (content) 
VALUES ('Transporte El Directo SRL es una empresa con más de 60 años de experiencia en el rubro del transporte de cargas. Nos especializamos en entregas rápidas y seguras en todo el territorio nacional.');

-- Insertar datos iniciales de contacto para cada sucursal
INSERT INTO contact_info (telefono, email, whatsapp) 
VALUES 
  ('+54 341 1234567', 'rosario@transporteedirecto.com', '+54 9 341 1234567'), -- Rosario
  ('+54 223 9876543', 'mardelplata@transporteedirecto.com', '+54 9 223 9876543'); -- Mar del Plata



-- Insertar horarios para Rosario
INSERT INTO schedule (sucursal, dia, hora_inicio, hora_fin) 
VALUES 
  ('Rosario', 'Lunes', '07:00:00', '15:30:00'),
  ('Rosario', 'Martes', '07:00:00', '15:30:00'),
  ('Rosario', 'Miércoles', '07:00:00', '15:30:00'),
  ('Rosario', 'Jueves', '07:00:00', '15:30:00'),
  ('Rosario', 'Viernes', '07:00:00', '15:30:00'),
  ('Rosario', 'Sábado', '07:00:00', '11:30:00');

-- Insertar horarios para Mar del Plata
INSERT INTO schedule (sucursal, dia, hora_inicio, hora_fin) 
VALUES 
  ('Mar del Plata', 'Lunes', '08:00:00', '16:00:00'),
  ('Mar del Plata', 'Martes', '08:00:00', '16:00:00'),
  ('Mar del Plata', 'Miércoles', '08:00:00', '16:00:00'),
  ('Mar del Plata', 'Jueves', '08:00:00', '16:00:00'),
  ('Mar del Plata', 'Viernes', '08:00:00', '16:00:00'),
  ('Mar del Plata', 'Sábado', '08:00:00', '12:00:00');

-- Establecer relaciones en la tabla pivote (contacto 1 -> Rosario, contacto 2 -> Mar del Plata)
-- Para Rosario
INSERT INTO contact_schedule_pivot (contact_id, schedule_id)
SELECT 1, id FROM schedule WHERE sucursal = 'Rosario';

-- Para Mar del Plata
INSERT INTO contact_schedule_pivot (contact_id, schedule_id)
SELECT 2, id FROM schedule WHERE sucursal = 'Mar del Plata';