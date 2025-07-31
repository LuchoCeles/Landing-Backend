require('dotenv').config();
require('./models/Associations');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
}));

// Rutas API
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Configuración de límites de tamaño para peticiones
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;