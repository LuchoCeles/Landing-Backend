const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactInfo = sequelize.define('ContactInfo', {
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
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'contact_info',
  timestamps: true
});


module.exports = ContactInfo;