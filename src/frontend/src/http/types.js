

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {number} ruleId
 */

/**
 * @typedef {Object} List
 * @property {number} id
 * @property {string} name
 * @property {number} userId
 * @property {number} ruleId
 */

/**
 * @typedef {Object} Address
 * @property {number} [id]
 * @property {('DOMAIN'|'IP')} type
 * @property {string} value
 * @property {number} [listId]
 * @property {number} [ruleId]
 */

/**
 * @typedef {Object} Rule
 * @property {number} id
 * @property {'ALLOW'|'DENY'} access
 * @property {'ON'|'OFF'} schedule
 */

/**
 * @typedef {Object} Exception
 * @property {number} [id]
 * @property {string} [days] - MTWHFAS
 * @property {{from: string, to: string}} [time]
 * @property {number} [ruleId]
 */