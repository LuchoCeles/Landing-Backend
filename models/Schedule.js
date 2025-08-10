const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'store',
      key: 'id'
    }
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
  timestamps: true
});

module.exports = Schedule;