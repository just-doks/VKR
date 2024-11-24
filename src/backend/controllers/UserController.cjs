// Создание экземпляра класса обработки ошибок 
// и импорт модуля с функциями помощниками
const ApiError = require('../error/ApiError.cjs');
const helpers = require('../helpers/index.cjs');

// Класс обработчик запросов к конечным точкам,
// соответствующим сущности пользователя модели данных
class UserController {

    async create(req, res, next) {
        try {
            const { name, password, rule } = req.body;
            const user = await helpers.User.createOne(name, password, rule);
            return res.json(user);
        } catch (err) {
            return next(err)
        }
    }
    async read(req, res, next) {
        try {
            const users = await helpers.User.getUsers();
            return res.json(users);
        } catch (err) {
            return next(err)
        }
    }
    async update(req, res, next) {
        try {
            const { id, name, password } = req.body;

            if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
                return next(ApiError.noAccess())
            }
            const user = await helpers.User.updateOne(id, name, password);
            return res.json(user);
        } catch (err) {
            return next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.query;
            await helpers.User.deleteOne(id);
            return res.status(200).end();
        } catch (err) {
            return next(err);
        }
    }

    async readOne(req, res, next) {
        try {
            const { id, name } = req.query;
            const user = await helpers.User.getOne(id, name);
            return res.json(user);
        } catch (err) {
            return next(err);
        }
    }
    async readGlobal(req, res, next) {
        try {
            const global = await helpers.User.getGlobal();
            return res.json(global);
        } catch (err) {
            return next(err);
        }
    }
    async login(req, res, next) {
        try {
            const { name, password } = req.body;
            const token = await helpers.User.login(name, password);
            return res.json({token});
        } catch (err) {
            return next(err);
        }
    }
    async auth(req, res, next) {
        try {
            const { id, name, role } = req.user
            const token = await helpers.User.renewToken(id, name, role);
            return res.json({token});
        } catch (err) {
            return next(err);
        }
    }
    async isUser(req, res, next) {
        try {
            const { name } = req.query;
            const result = await helpers.User.isExist(name);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
};

module.exports = UserController;