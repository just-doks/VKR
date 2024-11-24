// Импорт стандартных инструментов
const path = require('path')
const { execSync } = require('node:child_process');
const { writeFile } = require('node:fs/promises');

// Импорт модулей, объектов и методов проекта
const sequelize = require('../db.cjs');
const ApiError = require('../error/ApiError.cjs')
const init = require('../utils/initFunc.cjs')
const { User, List, Address, Rule, Exception } = require('../models/models.cjs');
const { digestEntities } = require('../helpers/index.cjs').Proxy;

// Класс обработки запросов к конечным точкам управления прокси
class ProxyController {

    async get(req, res, next) {
        try {
            const state = execSync('sudo systemctl is-active squid', {shell: '/bin/bash'})
            const isActive = (state === 'active');
            const domain = process.env.PROXY_DOMAIN;
            const port = process.env.PROXY_PORT;
            return res.json({isActive, domain, port})
        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async toggle(req, res, next) {
        const isActive = false;
        const state = execSync('sudo systemctl is-active squid', {shell: '/bin/bash'});
        if (state === 'active') {
            execSync('sudo squid -k shutdown', {shell: '/bin/bash'});
        } else {
            execSync('sudo systemctl start squid', {shell: '/bin/bash'});
            isActive = true;
        }
        return res.json({isActive})
    }

    async update(req, res, next) {
        const {acl, http_access} = await digestEntities();
        const data = acl.concat(http_access).join('\n');
        await writeFile(path.resolve(process.env.PROXY_CONF), data);
        execSync('sudo squid -k reconfigure', {shell: '/bin/bash'});
        return res.status(200).end();
    }

    async downloadCert(req, res, next) {
        const file = process.env.PROXY_CERT;
        res.download(file);
    }

    async reset(req, res, next) {
        try {
            await init();
            return res.json({message: "Система успешно сброшена"})
        } catch (err) {
            return next(ApiError.internal(err.message))
        }
    }
    

}

module.exports = ProxyController;