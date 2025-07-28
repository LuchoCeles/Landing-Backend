const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sucursal: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['rosario', 'mdq']]
    }
  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']]
    }
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  tableName: 'schedule',
  timestamps: false
});

module.exports = Schedule;