const ApiError = require('../error/ApiError.cjs');
const {Address, List, Rule, Exception} = require('../models/models.cjs');

const TYPES = ['DOMAIN', 'IP']

exports.create = async function(addresses, listId) {
    if (!Array.isArray(addresses) || !listId) {
        throw ApiError.badRequest('Отсутствуют обязательные параметры');
    }
    
    let created = [];
    let rejected = [];

    for (let i = 0; i < addresses.length; i++) {
        const type = addresses[i].type ?? undefined;
        const value = addresses[i].value ?? undefined;
        if (!TYPES.includes(type) || !value) {
            rejected.push(addresses[i]);
            continue;
        }
        const addr = await Address.findOne({where: {value, listId}})
        if (addr) {
            rejected.push(addresses[i]);
        } else {
            const list = await List.findOne({where: {id: listId}});
            const listRule = await Rule.findOne({where: {id: list.ruleId}});
            const addressRule = await Rule.create({access: listRule.access});
            const address = await Address.create({
                type: addresses[i].type,
                value: addresses[i].value,
                listId, 
                ruleId: addressRule.id});
            created.push(address);
        }
    }
    let result = {
        ...(created.length && {created}), 
        ...(rejected.length && {rejected})
    };

    return result;
}

exports.getAll = async function(listId) {
    if (!listId) {
        throw ApiError.badRequest('Не указан идентификатор списка');
    }
    const list = await Address.findAll({where: {listId}});
    return list;
}

exports.updateOne = async function(id, type, value) { 
    if (!id || !type || !value) {
        throw ApiError.badRequest('Не заполнены обязательные поля');
    }
    const addr = await Address.findOne({where:{id}});
    if (!addr) {
        throw ApiError.notFound('Адрес не найден');
    }
    await addr.update({type, value});
    return addr;
}

exports.deleteOne = async function(id) {
    if (!id) 
        throw ApiError.badRequest("Не указан идентификатор адреса");
    const addr = await Address.findOne({where:{id}});
    if (!addr)
        throw ApiError.notFound('Адрес не найден');
    const ruleId = addr.ruleId;
    await Exception.destroy({where:{ruleId}});
    await Rule.destroy({where:{id: ruleId}});
    await addr.destroy();
    return;
}

exports.delete = async function(list, listId) {
    if (!Array.isArray(list)) 
        throw ApiError.badRequest("Отсутствует список адресов на удаление");
    let deleted = [];
    let rejected = [];

    let addrIDs = [];
    for (let i = 0; i < list.length; i++) {
        if (!list[i].id) {
            rejected.push(list[i]);
        } else {
            addrIDs.push(list[i].id);
        }
    }
    if (addrIDs.length) {
        const addrs = await Address.findAll({where:{id: addrIDs, listId}});
        if (addrs.length) {
            const ruleIDs = addrs.map(addr => (addr.ruleId));
            await Exception.destroy({where:{ruleId: ruleIDs}});
            await Rule.destroy({where:{id: ruleIDs}});
            await Address.destroy({where: {id: addrIDs}});
            deleted = addrs;

            if (deleted.length !== addrIDs.length) {
                const delIDs = deleted.map(el => (el.id));
                const notdelIDs = addrIDs.filter(id => !delIDs.includes(id));
                const rejectList = list.filter(l => notdelIDs.includes(l.id));
                rejected = [
                    ...rejected, 
                    ...rejectList
                ]
            }
        } else {
            rejected = list;
        }
    }
    return {
        ...(deleted.length && {deleted}),
        ...(rejected.length && {rejected})
    };
}

exports.isExist = async function isExist(listId, type, value) {
    if (!listId || !type || !value) {
        throw ApiError.badRequest('Не заполнены обязательные поля');
    }
    const addr = await Address.findOne({where:{listId, type, value}});
    if (addr) return true;
    else return false;
}