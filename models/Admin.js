const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  },
  google_access_token: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  google_refresh_token: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  google_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  google_analytics_connected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  google_analytics_property_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'admin',
  timestamps: true
});

module.exports = Admin;