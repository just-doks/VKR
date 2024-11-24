// Объявление класса обработки некорректных запросов
class ApiError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        return new ApiError(400, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }
    static unauthorized(message) {
        return new ApiError(401, message)
    }

    static forbidden(message) {
        return new ApiError(403, message)
    }
    static noAccess() {
        return new ApiError(403, "Нет доступа")
    }
    static notFound(message) {
        return new ApiError(404, message)
    }

    static conflict(message) {
        return new ApiError(409, message)
    }
}

module.exports = ApiError