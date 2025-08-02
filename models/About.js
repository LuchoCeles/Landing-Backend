const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const About = sequelize.define('About', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'about',
  freezeTableName: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = About;