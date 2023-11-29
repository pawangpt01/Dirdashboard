const { DataTypes, Model } = require('sequelize');
const { db } = require('../utils/db.utill');

class User extends Model {}

User.init({    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      employee_code :{
        type: DataTypes.STRING,
        allowNull: false
      }
  }, {
    sequelize : db, 
    modelName: 'User' ,
    tableName: 'users',
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored:true
  });


  module.exports = User