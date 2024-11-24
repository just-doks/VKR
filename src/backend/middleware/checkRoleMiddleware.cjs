// Импорт пакета jsonwebtoken
const jwt = require('jsonwebtoken')

// Функция проверки роли пользователя 
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer [token]
            if (!token) {
                return res.status(401).json({mesage: "Пользователь не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                return res.status(403).json({message: "Нет доступа"})
            }
            req.user = decoded
            next() 
            // По окончании Middleware, вызываем функцию next(), 
            // тем самым, вызвав следующий middleware
        } catch (e) {
            res.status(500).json({message: "Непредвиденная ошибка"})    
        }
    }
}