const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarruselItem = sequelize.define('CarruselItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'carousel_item',
  timestamps: true 
});

module.exports = CarruselItem;