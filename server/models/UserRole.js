const { DataTypes, Model } = require('sequelize');
const { db } = require('../utils/db.utill');

class UserRole extends Model {}

UserRole.init({    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    sequelize : db, 
    modelName: 'UserRole' ,
    tableName: 'user_roles',
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored:true
  });


  module.exports = UserRole