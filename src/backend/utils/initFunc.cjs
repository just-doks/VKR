const {User, Rule} = require("../models/models.cjs");
const sequelize = require('../db.cjs');
const bcrypt = require('bcrypt')

module.exports = async function () {
    await sequelize.sync({force: true})
    const globalRule = await Rule.create({access: 'ALLOW'})
    const hashPassword = await bcrypt.hash("1234", 5)
    await User.create({
        name: 'GLOBAL', 
        role: 'GLOBAL', 
        ruleId: globalRule.id})
    await User.create({
        name: 'admin', 
        password: hashPassword, 
        role: 'ADMIN'})
}