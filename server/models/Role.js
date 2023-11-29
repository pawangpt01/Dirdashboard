const { DataTypes, Model } = require('sequelize');
const { db } = require('../utils/db.utill');

class Role extends Model {}

Role.init({    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
    }
    
    
  }, {
    sequelize : db, 
    modelName: 'Role' ,
    tableName: 'roles',
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored:true
  });


  module.exports = Role