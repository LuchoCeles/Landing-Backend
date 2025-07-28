const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'transporte_el_directo', // Nombre de tu BD existente
  process.env.DB_USER || 'root', // Usuario de MySQL
  process.env.DB_PASSWORD || '', // Contraseña
  {
    host: process.env.DB_HOST|| 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Función para probar la conexión
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

testConnection();

module.exports = sequelize;