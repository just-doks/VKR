const ApiError = require('../error/ApiError.cjs');
const {Rule, Exception, User} = require('../models/models.cjs');

const ACCESS = ['ALLOW', 'DENY']
const SCHEDULE = ['ON', 'OFF']

exports.createOne = async function createOne(access) { // T
    if (!ACCESS.includes(access)) {
        throw ApiError.badRequest("Некорректный тип доступа");
    }
    const rule = await Rule.create({access});    
    return rule;
}

exports.getAll = async function getAll() { // OK
    const rules = await Rule.findAll();
    return rules;
}

exports.getOne = async function getOne(id) { // OK
    if (!id) {
        throw ApiError.badRequest("Не указан идентификатор правила");
    }
    const rule = await Rule.findOne({
        where: {id}, attributes: { exclude: ["createdAt", "updatedAt"]}
    });
    if (!rule) {
        throw ApiError.notFound("Правило по указанному идентификатору не найдено");
    } else
        return rule;
}

exports.updateOne = async function updateOne(id, access, schedule) { // OK
    if (!id || !(ACCESS.includes(access) || SCHEDULE.includes(schedule))) {
        throw ApiError.badRequest("Поля идентификатора и доступа некорректны или не заполнены");
    }
    const rule = await Rule.findOne({
        where: {id}, 
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!rule) {
        throw ApiError.notFound("Правило по указанному идентификатору не найдено");
    }
    if ((access ? (access === rule.access) : true) && 
        (schedule ? (schedule === rule.schedule) : true)) 
        return rule;
    rule.update({...(access && {access}), ...(schedule && {schedule})});
    return rule;
}

exports.deleteOne = async function deleteOne(id) { // OK
    if (!id) {
        throw ApiError.badRequest("Не указан идентификатор правила");
    }
    const rule = await Rule.findOne({where: {id}});
    if (!rule) {
        throw ApiError.notFound("Правило по указанному идентификатору не найдено");
    }
    await Exception.destroy({where: {ruleId: id}});
    await rule.destroy();
    return;
}

exports.getGlobal = async function getGlobal() { // OK
    const global = await User.findOne({where: {role: 'GLOBAL'}});
    const rule = await Rule.findOne(
        {where: {id: global.ruleId}, 
        attributes: {exclude: ['createdAt', 'updatedAt']}
    });
    return rule;
}