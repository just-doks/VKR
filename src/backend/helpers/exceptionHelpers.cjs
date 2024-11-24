const ApiError = require('../error/ApiError.cjs');
const {Exception} = require('../models/models.cjs');

const DAYS = "SMTWHFA";

function digestDays(days) {
    if (days && (days instanceof String || typeof days === 'string')) {  
        let filtered = "";
        for (let i = 0; i < days.length; i++) {
            if (DAYS.includes(days[i]) && !filtered.includes(days[i])) {
                filtered += days[i];
            }
        }
        if (filtered.length) return filtered;
    }
    return null;
}

function digestTime(time) {
    if (time instanceof Object && Object.keys(time).includes("from") 
         && Object.keys(time).includes("to")) {
        const regexp = /^[0-9]{2}:[0-9]{2}$/;
        if (time.from.match(regexp) && time.to.match(regexp)
            && (time.from <= time.to || time.to === '00:00')) {
            return { from: time.from, to: time.to };
        }
    }
    return null;
}

exports.create = async function(exceptions, ruleId) { // OK
    if (!Array.isArray(exceptions) || !ruleId) {
        throw ApiError.badRequest('Отсутствуют обязательные параметры');
    }
    
    let toCreate = [];
    let rejected = [];

    for (let i = 0; i < exceptions.length; i++) {
        if (!exceptions[i].days && !exceptions[i].time) {
            rejected.push(exceptions[i]);
        } else {
            const days = exceptions[i].days ?? undefined;
            const time = exceptions[i].time ?? undefined;
            const ddays = digestDays(days);
            const dtime = digestTime(time);
            if(!ddays && !dtime) {
                rejected.push(exceptions[i])
                continue;
            }
            toCreate.push({
                ...(ddays && {days: ddays}),
                ...(dtime && {time: dtime}),
                ruleId})
        }
    }
    const created = await Exception.bulkCreate(toCreate, {returning: ["id", "days", "time", "ruleId"]});
    return {
        ...(created.length && {created}), 
        ...(rejected.length && {rejected})
    };
}

exports.getAll = async function(ruleId) { // OK
    if (!ruleId) {
        throw ApiError.badRequest('Не указан идентификатор правила');
    }
    const exceptions = await Exception.findAll({
        where: {ruleId}, attributes: {exclude: ["createdAt", "updatedAt"]}
    });
    return exceptions;
}

exports.updateOne = async function(id, days, time) { // OK
    if (!id || !(days || time)) {
        throw ApiError.badRequest('Не заполнены обязательные поля');
    }
    const exception = await Exception.findOne({where:{id}});
    if (!exception) {
        throw ApiError.notFound('Исключение не найдено');
    }
    if (days) exception.days = days;
    if (time) exception.time = time;
    await exception.save();
    return exception;
}

exports.update = async function(exceptions, ruleId) { // OK
    if (!Array.isArray(exceptions)) {
        throw ApiError.badRequest('Не заполнены обязательные поля');
    }
    let updated = [];
    let rejected = [];
    for (let i = 0; i < exceptions.length; i++) {
        const id = exceptions[i].id ?? undefined;
        const days = exceptions[i].days ?? undefined;
        const time = (exceptions[i].time ?? undefined);
        if (!id || !(days || time)) {
            rejected.push(exceptions[i]);
            continue;
        }
        const exception = await Exception.findOne({
            where: {id,  ruleId}, attributes: {exclude: ["createdAt", "updatedAt"]}
        });
        if (!exception) {
            rejected.push(exceptions[i]);
            continue;
        }
        const ddays = digestDays(days);
        const dtime = digestTime(time);
        if(!ddays && !dtime) {
            rejected.push(exceptions[i])
            continue;
        }
        if (ddays) exception.days = ddays;

        if (dtime) exception.time = dtime;

        await exception.save();
        updated.push(exception);
    }
    return {
        ...(updated.length && {updated}),
        ...(rejected.length && {rejected})
    };
}

exports.deleteOne = async function(id) { // OK
    if (!id) 
        throw ApiError.badRequest("Не указан идентификатор исключения");
    const exception = await Exception.findOne({where:{id}});
    if (!exception)
        throw ApiError.notFound('Исключение не найдено');
    await exception.destroy();
    return;
}

exports.delete = async function(exceptions, ruleId) { // OK
    if (!Array.isArray(exceptions)) 
        throw ApiError.badRequest("Отсутствует список исключений на удаление");
    let deleted = [];
    let rejected = [];
    for (let i = 0; i < exceptions.length; i++) {
        const id = exceptions[i].id ?? undefined;
        if (!id) {
            rejected.push(exceptions[i]);
            continue;
        }
        const exception = await Exception.findOne({
            where:{id, ruleId}, attributes: {exclude: ["createdAt", "updatedAt"]}
        });
        if (!exception) {
            rejected.push(exceptions[i]);
            continue;
        }
        await exception.destroy();
        deleted.push(exception);
    }

    return {
        ...(deleted.length && {deleted}),
        ...(rejected.length && {rejected})
    };
}