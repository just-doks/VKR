const sequelize = require('../db.cjs')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.ENUM('USER', 'ADMIN', 'GLOBAL'), defaultValue: 'USER'}
});

const List = sequelize.define('list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
});

const Address = sequelize.define('address', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.ENUM('DOMAIN', 'IP'), allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false}
});

const Rule = sequelize.define('rule', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    access: {type: DataTypes.ENUM('ALLOW', 'DENY'), allowNull: false},
    schedule: {type: DataTypes.ENUM('ON', 'OFF'), allowNull: false, defaultValue: 'OFF'}
});

const Exception = sequelize.define('exception', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    days: {type: DataTypes.STRING(8)},
    time: {type: DataTypes.JSON}
});

User.hasMany(List)
List.belongsTo(User)

List.hasMany(Address)
Address.belongsTo(List)

Rule.hasMany(Exception)
Exception.belongsTo(Rule)

Rule.hasOne(User, {foreignKey: {allowNull: true}})
User.belongsTo(Rule)

Rule.hasOne(List, {foreignKey: {allowNull: false}})
List.belongsTo(Rule)

Rule.hasOne(Address, {foreignKey: {allowNull: false}})
Address.belongsTo(Rule)

module.exports = {
    User,
    List,
    Address,
    Rule,
    Exception
}