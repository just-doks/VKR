const Router = require('express')
const router = new Router()
const {ProxyController} = require('../controllers/index.cjs')
const checkRole = require('../middleware/checkRoleMiddleware.cjs')
const checkAuth = require('../middleware/authMiddleware.cjs')

router.post('/', checkRole('ADMIN'), ProxyController.toggle)
router.get('/', checkAuth, ProxyController.get)
router.put('/', checkRole('ADMIN'), ProxyController.update)
router.delete('/', checkRole('ADMIN'), ProxyController.reset)

router.get('/cert', checkAuth, ProxyController.downloadCert)
router.put('/conf', checkAuth, ProxyController.update)
router.get('/reset', checkRole('ADMIN'), ProxyController.reset)

module.exports = router