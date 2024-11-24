const ApiError = require('../error/ApiError.cjs');
const {User, List, Address, Rule, Exception} = require('../models/models.cjs');

exports.createOne = async function createOne(name, userId) {
    if (!name || !userId) {
        throw ApiError.badRequest("Не заполнены обязательные поля");
    }
    const candidate = await List.findOne({where: {name, userId}})
    if (candidate) {
        throw ApiError.conflict("Список с таким именем уже существует");
    }
    const user = await User.findOne({where: {id: userId}});
    const userRule = await Rule.findOne({where: {id: user.ruleId}});
    const listRule = await Rule.create({access: userRule.access});
    const list = await List.create({name, userId, ruleId: listRule.id})
    return list;
}

exports.create = async function create(names, userId) {
    if (!Array.isArray(names) || !(typeof userId === 'number')) {
        throw ApiError.badRequest(
            "Имена списков и идентификатор пользователя не указаны или некорректны");
    }
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
        throw ApiError.notFound("Пользователь по указанному идентификатору не найден");
    }
    let created = []
    let rejected = []
    for (let i = 0; i < names.length; i++) {
        const candidate = await List.findOne({where: {name: names[i], userId}})
        if (candidate) {
            rejected.push(names[i]);
            continue;
        } 
        else {
            const userRule = await Rule.findOne({where: {id: user.ruleId}});
            const listRule = await Rule.create({access: userRule.access});
            const list = await List.create({
                name: names[i], 
                userId, 
                ruleId: listRule.id});
            created.push(list);
        }
        
    }
    return {
        ...(created.length && {created}),
        ...(rejected.length && {rejected})
    };
}

exports.getAll = async function getAll(userId) {
    if (!userId) {
        throw ApiError.badRequest("Не указан идентификатор пользователя, при запросе списков");
    }
    const lists = await List.findAll({where: {userId}});
    return lists;
}

exports.updateName = async function updateName(id, name) {
    if (!id || !name) {
        throw ApiError.badRequest("Не указаны идентификатор и/или имя, при обновлении списка");
    }
    let list = await List.findOne({where: {id}});
    if (!list) {
        throw ApiError.notFound("Список не найден");
    }
    if (list.name === name)
        return list;
    
    const namedList = await List.findOne({where: {name, userId: list.userId}});
    if (namedList) {
        throw ApiError.conflict("Список с таким именем уже существует");
    }
    await list.update({name});
    return list;
}

exports.deleteOne = async function deleteOne(id) {
    if (!id) {
        throw ApiError.badRequest("Не указан идентификатор списка");
    }
    let list = await List.findOne({where: {id}});
    if (!list) {
        throw ApiError.notFound("Список не найден");
    }
    await Exception.destroy({where: {ruleId: list.ruleId}});
    await Rule.destroy({where: {id: list.ruleId}});
    await list.destroy();
    return;
}

exports.deleteAll = async function deleteAll(userId) {
    if (!userId) {
        throw ApiError.badRequest("Не указан идентификатор пользователя");
    }
    const lists = await List.findAll({where: {userId}});
    const listIDs = [];
    const ruleIDs = [];
    lists.forEach(list => {
        listIDs.push(list.id);
        ruleIDs.push(list.ruleId)
    })
    const addrs = await Address.findAll({where: {listId: listIDs}});
    ruleIDs = [...ruleIDs, ...addrs.map(addr => addr.ruleId)];

    await Exception.destroy({where: {ruleId: ruleIDs}});
    await Rule.destroy({where: {id: ruleIDs}});
    await Address.destroy({where:{listId: listIDs}});
    await List.destroy({where: {userId}});
    return;
}

exports.isExist = async function isExist(name, userId) {
    if (!name || !userId) {
        throw ApiError.badRequest("Не указаны имя списка и/или идентификатор пользователя");
    }
    const list = await List.findOne({where: {name, userId}});
    if (list) return true;
    else return false;
}