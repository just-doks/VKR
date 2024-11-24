// Импортируется класс из библиотеки Sequelize
const {Sequelize} = require('sequelize')

// Объявляется экспортируемый метод создания экземпляра класса
module.exports = new Sequelize(
    // Выполняются настройки для подключения к БД
    process.env.DB_NAME, // Название БД
    process.env.DB_USER, // Пользователь
    process.env.DB_PASSWORD, // Пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)