import { $authHost } from './index.js';
import './types.js';

/**
 * @param {Array<{type: 'DOMAIN'|'IP', value: string}>} addresses
 * @param {number} listId
 * @return {Promise<{lists?: object[], rejected?: string[]}>}
 */
export const createAddrs = async (addresses, listId) => {
    const {data} = await $authHost.post('api/addresses', {addresses, listId})
    return data;
}

/**
 * @param {number} listId 
 * @returns {Promise<Address[]>}
 */
export const fetchAddrs = async (listId) => {
    const {data} = await $authHost.get('api/addresses', {params: {listId}});
    return data;
}

/**
 * Обновить имя списка, добавить адреса, убрать адреса
 * @param {number} listId Идентификатор списка
 * @param {Address[]} [add] Массив новых адресов
 * @param {Address[]} [remove] Массив адресов на удаление
 * @returns {Promise<{
 *      addresses?: Address[],
 *      rejected?: {
 *          add?: Address[], 
 *          remove?: Address[]
 *      }
 * }>}
 */
export const updateAddrs = async (listId, add, remove) => {
    const {data} = await $authHost.put('api/addresses', {listId, add, remove})
    return data;
}

/**
 * @param {number} id 
 * @param {'DOMAIN'|'IP'} type
 * @param {string} value
 * @returns {Promise<Address>}
 */
export async function patchAddr(id, type, value) {
    const {data} = await $authHost.patch('api/addresses', {id, type, value})
    return data;
}

/** @param {number} id */
export const deleteAddr = async (id) => {
    await $authHost.delete('api/addresses', {params: {id}});
}

/**
 * @param {number} listId 
 * @param {'DOMAIN'|'IP'} type
 * @param {string} value 
 * @returns {Promise<boolean>}
 */
export const isAddrExist = async (listId, type, value) => {
    const {data} = await $authHost.get('api/addresses/exist', {params: {listId, type, value}});
    return data;
}


