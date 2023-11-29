const { DataTypes, Model } = require('sequelize');
const { db } = require('../utils/db.utill');

class Mou extends Model {}

Mou.init({    
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      project_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      key_deliverables: {
      type: DataTypes.STRING,
      allowNull: false
    },
    performance_indicators: {
      type: DataTypes.TEXT,
      allowNull: false
      // allowNull defaults to true
    },
    output_target: {
      type: DataTypes.TEXT,
      allowNull: true
      },  
    status: {
      type: DataTypes.TEXT,
      allowNull: true
      }, 
    project_code: {
        type: DataTypes.INTEGER,
        allowNull: true
      }, 
    project_name: {
        type: DataTypes.STRING,
        allowNull: true
      }, 
     
    funding_agency: {
        type: DataTypes.STRING,
        allowNull: true
      }, 
    funding_agency_code: {
        type: DataTypes.INTEGER,
        allowNull: true
      }, 
   
  }, {
    // Other model options go here
    sequelize : db, // We need to pass the connection instance
    modelName: 'Mou' ,// We need to choose the model name
    tableName: 'mous',
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored:true
  });


  module.exports = {Mou}