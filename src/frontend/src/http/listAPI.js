import { $authHost } from './index.js';
import './types.js';

/**
 * @param {string[]} names
 * @param {number} userId
 * @return {Promise<{lists?: List[], rejected?: string[]}>}
 */
export const createLists = async (names, userId) => {
    const {data} = await $authHost.post('api/lists', {names, userId})
    return data;
}

/**
 * @param {number} userId 
 * @returns {Promise<List[]>}
 */
export const fetchLists = async (userId) => {
    const {data} = await $authHost.get('api/lists', {params: {userId}});
    return data;
}
/**
 * Обновить имя списка, добавить адреса, убрать адреса
 * @param {number} id Идентификатор списка
 * @param {string} [name] Новое имя списка
 * @param {Address[]} [add] Массив новых адресов
 * @param {Address[]} [remove] Массив адресов на удаление
 * @returns {Promise<{
 *      list?: List, 
 *      addresses?: Address[],
 *      rejected?: {
 *          add?: Address[],
 *          remove?: Address[]
 *      }
 * }>}
 */
export const updateList = async (id, name, add, remove) => {
    const {data} = await $authHost.put('api/lists', {id, name, add, remove})
    return data;
}
/**
 * @param {number} id 
 * @param {string} name 
 * @returns {Promise<List>}
 */
export const updateListName = async (id, name)  => {
    const {data} = await $authHost.patch('api/lists', {id, name})
    return data;
}
/** @param {number} id */
export const deleteList = async (id) => {
    await $authHost.delete('api/lists', {params: {id}});
}

/**
 * @param {string} name 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
export const isListExist = async (name, userId) => {
    const {data} = await $authHost.get('api/lists/exist', {params: {name, userId}});
    return data;
}







