// Импортируются необходимые библиотеки
const express = require('express')
const cors = require('cors')
const path = require('path')
// Определяется место .env файла
require('dotenv').config({path: path.resolve(__dirname, '.env')})

// Импортируются собственные экземпляры и функции
const sequelize = require('./db.cjs')
const models = require('./models/models.cjs')
const router = require('./routes/index.cjs')
const errorHandler = require('./middleware/errorHandlingMiddleware.cjs')
const { User } = require('./models/models.cjs')
const init = require('./utils/initFunc.cjs')

// Определяется порт
const PORT = process.env.PORT

// Определяется экземпляр класса Express
const app = express()
app.use(cors()) // Для использования функций пакета Cors
app.use(express.json()) // Для того, чтобы приложение могло парсить json формат
app.use('/api', router) // Указывается корневой путь и роутер
app.get('/main/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'static/', 'index.html'));
});
app.get('/', (req, res) => {
    res.redirect('/main/*')
});

// Обработка ошибок, последний middleware
app.use(errorHandler)

// Функция запуска сервера
const start = async() => {
    try {
        await sequelize.authenticate() // Подключение к БД
        await sequelize.sync() // Функция сверяет БД со схемой данных
        const global = await User.findOne({name: 'GLOBAL', role: 'GLOBAL'})
        if (!global) {
            await init()
        }
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`)) // Прослушиваемый порт
    } catch (err) {
        console.log(err)
    }
}

start()