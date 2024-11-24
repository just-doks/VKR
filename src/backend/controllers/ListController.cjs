// Создание экземпляра класса обработки ошибок 
// и импорт модуля с функциями помощниками
const ApiError = require("../error/ApiError.cjs")
const helpers = require('../helpers/index.cjs');

// Класс обработчик запросов к конечным точкам,
// соответствующим сущности списка адресов модели данных
class ListController {
    async create(req, res, next) {
        try {
            const { names, userId } = req.body;
            const {rejected} = await helpers.List.create(names, userId);
            const lists = await helpers.List.getAll(userId);
            const result = {
                ...(lists.length && {lists}),
                ...(rejected && {rejected})
            }
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
    async read(req, res, next) {
        try {
            const { userId } = req.query;
            const lists = await helpers.List.getAll(userId);
            return res.json(lists);
        } catch (err) {
            return next(err);
        }
    }
    async update(req, res, next) {
        try {
            const { id, name, add, remove } = req.body
            if (!id)
                return next(ApiError.badRequest("Не указан идентификатор списка"));

            const result = {id};
            if (name) {
                const list = await helpers.List.updateName(id, name);
                result.list = list;
            }
            if (remove.length) {
                const {rejected} = await helpers.Address.delete(remove, id);
                result.rejected = (rejected && {...result.rejected, remove: rejected});
            }
            if (add.length) {
                const {rejected} = await helpers.Address.create(add, id);
                result.rejected = (rejected && {...result.rejected, add: rejected});
            }
            
            result.addresses = await helpers.Address.getAll(id);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
    async patch(req, res, next) {
        try {
            const { id, name } = req.body;
            const list = await helpers.List.updateName(id, name);
            return res.json(list);
        } catch (err) {
            return next(err);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.query;
            await helpers.List.deleteOne(id);
            return res.status(200).end();
        } catch (err) {
            return next(err)
        }
    }

    async isList(req, res, next) {
        try {
            const { name, userId } = req.query;
            const result = await helpers.List.isExist(name, userId);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
};

module.exports = ListController;