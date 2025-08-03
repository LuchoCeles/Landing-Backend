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
    allowNull: false
  },
  dia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  horario: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'schedule',
  timestamps: false
});

module.exports = Schedule;