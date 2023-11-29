const { Model, DataTypes } = require("sequelize");
const { db } = require('../utils/db.utill');

class LoginUserInfo extends Model{}

LoginUserInfo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, 
    allowNull:false,
    field: 'id'
},
username: {
    type: DataTypes.STRING,
    allowNull: false
},
token: {
    type: DataTypes.TEXT,
    allowNull: false
},
user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
}, 
expire_date: {
    type: DataTypes.DATE,
    allowNull: false
}
},{
    sequelize:db,
    modelName:"LoginUserInfo",
    tableName:"login_user_info",
    timestamps: false,
    underscored: true
});

module.exports =  LoginUserInfo