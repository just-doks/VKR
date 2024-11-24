// Импорт пакета jsonwebtoken
const jwt = require('jsonwebtoken')

// Функция проверки авторизации пользователя
module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer [token]
        if (!token) {
            return res.status(401).json({mesage: "Пользователь не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next() 
        // По окончании Middleware, вызываем функцию next(), 
        // тем самым, вызвав следующий middleware
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})   
    }
}