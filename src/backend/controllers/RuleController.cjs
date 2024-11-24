// импорт модуля функций помощников
const helpers = require('../helpers/index.cjs');

// Класс обработчик запросов к конечным точкам 
// сущности правила доступа модели данных
class RuleController {
    async create(req, res, next) { // OK
        try {
            const { access } = req.body;
            const rule = await helpers.Rule.createOne(access);
            return res.json(rule);
        } catch (err) {
            return next(err);
        }
    }
    async read(req, res, next) { // OK
        try {
            const { id } = req.query;
            const rule = await helpers.Rule.getOne(id);
            const exceptions = await helpers.Exception.getAll(rule.id);
            return res.json({
                rule, ...(exceptions.length && {exceptions})
            });
        } catch (err) {
            return next(err);
        }
    }
    async update(req, res, next) { // OK
        try {
            const { id, access, schedule, add, update, remove } = req.body
            let result = {};
            if (access || schedule) {
                const rule = await helpers.Rule.updateOne(id, access, schedule);
                result.rule = rule;
            }
            if (add && add.length) {
                const {rejected} = await helpers.Exception.create(add, id);
                result.rejected = (rejected && {...result.rejected, add: rejected});
            }
            if (update && update.length) {
                const {rejected} = await helpers.Exception.update(update, id);
                result.rejected = (rejected && {...result.rejected, update: rejected});
            }
            if (remove && remove.length) {
                const {rejected} = await helpers.Exception.delete(remove, id);
                result.rejected = (rejected && {...result.rejected, remove: rejected});
            }
            const exceptions = await helpers.Exception.getAll(id);
            if (exceptions.length) result.exceptions = exceptions;
            return res.json(result);
        } catch (err) {
            return next(err);
        }
    }
    async delete(req, res, next) { // OK
        try {
            const { id } = req.query;
            await helpers.Rule.deleteOne(id);
            return res.status(200).end();
        } catch (err) {
            return next(err);
        }
    }

    async readAll(req, res, next) {
        try {
            const rules = await helpers.Rule.getAll();
            return res.json(rules);
        } catch (err) {
            return next(err);
        }
    }
};

module.exports = RuleController;