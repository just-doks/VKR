const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const ApiError = require('../error/ApiError.cjs');
const {User, List, Address, Rule, Exception} = require('../models/models.cjs');

const generateJwt = (id, name, role) =>
    {
        return jwt.sign(
            {id, name, role},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }

exports.createOne = async function createOne (name, password, role) { // OK
    if (!name || !password) {
        throw ApiError.badRequest("Не заполнены обязательные поля");
    }
    const candidate = await User.findOne({where: {name}})
    if (candidate) {
        throw ApiError.badRequest('Пользователь с таким именем уже существует');
    }
    const hashPassword = await bcrypt.hash(password, 5)

    const global = await User.findOne({where:{role: 'GLOBAL'}});
    const globalRule = await Rule.findOne({where: {id: global.ruleId}});
    const userRule = await Rule.create({access: globalRule.access});
    const user = await User.create({
        name, password: hashPassword, ...(role && {role}), ruleId: userRule.id});
    const filtered = {id: user.id, name: user.name, ruleId: user.ruleId};
    return filtered;
}


exports.login = async function login(name, password) { // OK
    if (!name && !password) {
        throw ApiError.badRequest('Заполнены не все поля');
    }
    const user = await User.findOne({where:{name}})
    if (!user) {
        throw ApiError.notFound('Пользователь не найден');
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) {
        throw ApiError.badRequest('Указан неверный пароль');
    }
    const token = generateJwt(user.id, user.name, user.role);
    return token;
}

exports.renewToken = async function renewToken(id, name, role) { // OK
    const token = generateJwt(id, name, role);
    return token;
}

exports.getUsers = async function getUsers() { // OK
    const users = await User.findAll({where: {role: 'USER'}}) // Любые запросы к БД являются асинхронными
    const filtered = users.map(user => (
        {id: user.id, name: user.name, ruleId: user.ruleId}
    ))
    return filtered;
}

exports.getOne = async function getOne(id, name) { // OK
    if (!id && !name) 
        throw ApiError.badRequest('Не указаны параметры поиска');

    const user = await User.findOne({where: {
        ...(id && {id}), ...(name && {name})
    }});

    if (user) {
        const filtered = {id: user.id, name: user.name, role: user.role, 
            ruleId: user.ruleId};
        return filtered;
    } else 
        return undefined;
}

exports.getGlobal = async function getGlobal() { // OK
    const global = await User.findOne({where: {role: 'GLOBAL'}})
    const filtered = {id: global.id, ruleId: global.ruleId}
    return filtered;
}

exports.isExist = async function isExist(name) { // OK
    if (!name) 
        throw ApiError.badRequest('Не указано имя');
    const user = await User.findOne({where: {name}});
    if (user) return true;
    else return false;
}

// Функция обновления учетных данных пользователей
exports.updateOne = async function update(id, name, password) { // OK

    // Выполняются проверки на корректность данных
    if (!id) {
        throw ApiError.badRequest("Не указан идентификатор пользователя");
    }
    let user = await User.findOne({where:{id}})
    if (!user) {
        throw ApiError.notFound("Пользователь не найден");
    }
    if (name) {
        const namedUser = await User.findOne({where:{name}})
        if (namedUser && id !== namedUser.id) {
            throw ApiError.conflict("Пользователь с таким именем уже есть");
        }
        else {
            user.name = name;
        }
    }

    // Обновление учетных данных
    if (password) {
        let hashPassword = await bcrypt.hash(password, 5)
        user.password = hashPassword;
    }
    await user.save();
    const filtered = {id: user.id, name: user.name, role: user.role, ruleId: user.ruleId}
    return filtered;
}

// Функция удаления пользователей
exports.deleteOne = async function deleteOne(id) { // OK
        if (!id) {
            throw ApiError.badRequest("Не указан ID");
        }
        let user = await User.findOne({where: {id}})
        if (!user) {
            throw ApiError.notFound("Пользователь по указанному ID не найден");
        }

        let listIDs = [];
        let ruleIDs = [];

        const lists = await List.findAll({where: {userId: id}});

        for (let i = 0; i < lists.length; i++) {
            listIDs.push(lists[i].id);
            ruleIDs.push(lists[i].ruleId);
        }

        const addresses = await Address.findAll({where: {listId: listIDs}});
        for (let j = 0; j < addresses.length; j++) {
            ruleIDs.push(addresses[j].ruleId);
        }

        await Exception.destroy({where: {ruleId: ruleIDs}});
        await Rule.destroy({where: {id: ruleIDs}});
        await Address.destroy({where: {listId: listIDs}});
        await List.destroy({where: {userId: id}});
        await user.destroy();
        return;
}