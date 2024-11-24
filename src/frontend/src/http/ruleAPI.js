import { $authHost } from './index.js';
import './types.js';

/**
 * @param {number} id
 * @returns {Promise<{rule: Rule, exceptions?: Exception[]}>}
 */
export const fetchRule = async (id) => {
    const {data} = await $authHost.get('api/rules', {params: {id}});
    return data;
}

/**
 * @param {number} id 
 * @param {'ALLOW'|'DENY'} access 
 * @param {'ON'|'OFF'} schedule 
 * @param {Exception[]} add 
 * @param {Exception[]} update 
 * @param {Exception[]} remove 
 * @returns {Promise<{ 
 *      rule?: Rule, 
 *      exceptions?: Exception[], 
 *      rejected?: {
 *          add?: Exception[], update?: Exception[], remove?: Exception[]
 *      }
 * }>}
 */
export const updateRule = async (id, access, schedule, add, update, remove) => {
    const {data} = await $authHost.put('api/rules', 
        {id, access, schedule, add, update, remove});
    return data;
}

/** @param {number} id */
export const deleteRule = async (id) => {
    await $authHost.delete('api/rules', {id});
}

