require('dotenv').config();
require('./models/Associations');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const { sequelize } = require('./config/database');

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

// Rutas API
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;