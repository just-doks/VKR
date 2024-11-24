// Импорт модуля с функциями помощниками
const helpers = require('../helpers/index.cjs');

// Класс обработчик запросов к конечным точкам,
// соответствующим сущности адресов модели данных
class AddressController {
    async create(req, res, next) { // T
        try {
            const { addresses, listId } = req.body;
            const result = await helpers.Address.create(addresses, listId);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
    async read(req, res, next) { // T
        try {
            const { listId } = req.query;
            const list = await helpers.Address.getAll(listId);
            return res.json(list);
        } catch (err) {
            return next(err);
        }
    }
    async patch(req, res, next) { // T
        try {
            const { id, type, value } = req.body;
            const address = await helpers.Address.updateOne(id, type, value);
            return res.json(address);
        } catch (err) {
            return next(err);
        }
    }
    async delete(req, res, next) { // T
        try {
            const { id } = req.query;
            await helpers.Address.deleteOne(id);
            return res.status(200).end();
        } catch (err) {
            return next(err);
        }
    }

    async update(req, res, next) { // T
        try {
            const { listId, add, remove } = req.body;
            const result = {};
            if (remove.length) {
                const {deleted, rejected} = await helpers.Address.delete(remove, listId);
                result.removed = deleted;
                result.rejected = (rejected && {...result.rejected, remove: rejected});
            }
            if (add.length) {
                const {created, rejected} = await helpers.Address.create(add, listId);
                result.added = created;
                result.rejected = (rejected && {...result.rejected, add: rejected});
            }
            result.addresses = await helpers.Address.getAll(listId);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }

    async isAddress(req, res, next) {
        try {
            const { listId, type, value } = req.query;
            const result = await helpers.Address.isExist(listId, type, value);
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
};

module.exports = AddressController;