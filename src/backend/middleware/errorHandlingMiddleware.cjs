const ApiError = require('../error/ApiError.cjs')

module.exports = function(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    let message = "Непредвиденная ошибка"; 
    if (err instanceof String || typeof err === 'string')
        message += ":\n" + err;
    else 
    if (err.message 
        && (err.message instanceof String 
            || typeof err.message === 'string')) {
                message = ":\n" + err.message;
            }
    return res.status(500).json({message})
}