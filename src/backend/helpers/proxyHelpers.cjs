const {User, List, Address, Rule, Exception} = require('../models/models.cjs');

/** @return {Promise<{acl?: string[], http_access?: string[]}>} */
async function digestRule(rule, acltail) {
    let acl = [];
    let http_access = [];
    const id = rule.id;
    const access = (rule.access === 'ALLOW' ? 'allow' : 'deny');

    if (rule.schedule === 'ON') {
        const aclname = `r${id}`;
        const exceptions = await Exception.findAll({where:{ruleId: id}});

        for (let i = 0; i < exceptions.length; i++) {
            const exc = exceptions[i];
            const days = exc.days ?? undefined;
            const time = (exc.time ?? undefined);
            if (!days && !time) continue;
            const aclstr = `acl ${aclname} time `
                + (days ? days : '')
                + (time ? ` ${time.from}-${time.to}` : '');
            acl.push(aclstr);
        }
        const hastr = 'http_access ' + access +
            (exceptions.length ? ` !${aclname}` : '') +
            (acltail ? ` ${acltail}` : '');
        
        http_access.push(hastr);
    } else {
        const hastr = `http_access ${access}` +
            (acltail ? ` ${acltail}` : '');
        http_access.push(hastr);
    }

    return {
        ...(acl.length && {acl}), 
        ...(http_access.length && {http_access})
    };
}

/** @return {Promise<{acl: string[], http_access: string[]}>} */
async function digestUser(id, username, rule, globalRule) {
    let acl = [];
    let http_access = [];
    
    const lists = await List.findAll({where:{userId: id}});

    for (let l = 0; l < lists.length; l++) {
        const list = lists[l];
        const listacl = `l${list.id}`;
        const lRule = await Rule.findOne({where:{id: list.ruleId}});
        const addrs = await Address.findAll({where:{listId: list.id}});

        for (let a = 0; a < addrs.length; a++) {
            const addr = addrs[a];
            const aclname = `a${addr.id}`;
            const type = (addr.type === 'DOMAIN' ? 'dstdomain' : 'dst');
            acl.push(`acl ${aclname} ${type} ${addr.value}`);
            acl.push(`acl ${listacl} any-of ${aclname}`);

            const aRule = await Rule.findOne({where:{id: addr.ruleId}});
            const acltail = (username ? aclname.concat(` ${username}`) : aclname);
            const {acl: a_acl, http_access: a_ha} = 
                await digestRule(aRule, acltail);
            
            if (a_acl) acl.push(...a_acl);
            if (a_ha && (aRule.access !== lRule.access)) http_access.push(...a_ha);
        }

        if (addrs.length) {
            const acltail = (username ? listacl.concat(` ${username}`) : listacl);
            const {acl: l_acl, http_access: l_ha} = await digestRule(lRule, acltail);
            if (l_acl) acl.push(...l_acl);
            if (l_ha && (lRule.access !== rule.access)) http_access.push(...l_ha);
        }  
    }

    const acltail = (username ? `${username}` : 'all')
    const {acl: u_acl, http_access: u_ha} = await digestRule(rule, acltail);
    if (u_acl) acl.push(...u_acl);
    if (u_ha && (globalRule ? (rule.access !== globalRule.access) : true )) 
        http_access.push(...u_ha);
    return {
        ...(acl.length && {acl}), 
        ...(http_access.length && {http_access})
    };
}

exports.digestEntities = async function digestEntities() {
    let acl = [];
    let http_access = [];
    acl.push('acl auth proxy_auth REQUIRED');
    http_access.push('http_access deny !auth');

    const global = await User.findOne({where:{role: 'GLOBAL'}});
    const gRule = await Rule.findOne({where:{id: global.ruleId}});
    const users = await User.findAll({where:{role: 'USER'}});
    for (let u = 0; u < users.length; u++) {
        const user = users[u];
        const useracl = `u${user.id}`;
        acl.push(`acl ${useracl} proxy_auth '${user.name}'`);

        const uRule = await Rule.findOne({where:{id: user.ruleId}});

        const { acl: u_acl, http_access: u_ha } = 
            await digestUser(user.id, useracl, uRule, gRule);
        if (u_acl) acl.push(...u_acl);
        if (u_ha) http_access.push(...u_ha);
    }

    const {acl: g_acl, http_access: g_ha} = 
        await digestUser(global.id, 'auth', gRule);

    if (g_acl) acl.push(...g_acl);
    if (g_ha) http_access.push(...g_ha);

    http_access.push('http_access deny all');

    return {acl, http_access};
}