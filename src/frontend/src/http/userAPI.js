import {jwtDecode} from 'jwt-decode';
import { $host, $authHost } from "./index";
import './types.js';
/**
 * @param {string} name 
 * @param {string} password 
 * @returns {Promise<User>}
 */
export const createUser = async (name, password) => {
    const {data} = await $authHost.post('api/users', {name, password})
    return data
}
/** @returns {Promise<User[]>} */
export const fetchUsers = async () => {
    const {data} = await $authHost.get('api/users')
    return data
}

/**
 * @param {number} id 
 * @param {string} name 
 * @param {string} password  
 * @returns {Promise<User>}
 */
export const updateUser = async (id, name, password) => {
    const {data} = await $authHost.put('api/users', {id, name, password})
    return data
}
/** @param {number} id */
export async function deleteUser(id) {
    await $authHost.delete('api/users', {params: {id}});
}

export const loginUser = async (name, password) => {
    const {data} = await $host.post('api/users/login', {name, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const checkAuth = async () => {
    const {data} = await $authHost.get('api/users/auth')
    const { token } = data
    if (!token) {
        return {};
    } else {
        localStorage.setItem('token', token)
        return jwtDecode(token)
    }
}

/**
 * @param {string} name 
 * @returns {Promise<boolean>}
 */
export async function isUserExist(name) {
    const {data} = await $authHost.get('api/users/exist', {params: {name}});
    return data;
}

/** @returns {Promise<{id: number, ruleId: number}>} */
export const fetchGlobal = async () => {
    const {data} = await $authHost.get('api/users/global')
    return data
}






