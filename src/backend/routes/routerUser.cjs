const Router = require('express')
const router = new Router()

const authMiddleware = require('../middleware/authMiddleware.cjs')
const checkRole = require('../middleware/checkRoleMiddleware.cjs')

const { UserController } = require('../controllers/index.cjs')

router.post('/', checkRole('ADMIN'), UserController.create)             // T
router.get('/', checkRole('ADMIN'), UserController.read)                // T
router.put('/', authMiddleware, UserController.update)                  // T
router.delete('/', checkRole('ADMIN'), UserController.delete)           // T

router.post('/login', UserController.login)                             // T
router.get('/auth', authMiddleware, UserController.auth)                // T
router.get('/exist', checkRole('ADMIN'), UserController.isUser)         // T
router.get('/user', checkRole('ADMIN'), UserController.readOne)         // T
router.get('/global', checkRole('ADMIN'), UserController.readGlobal)    // T

module.exports = router