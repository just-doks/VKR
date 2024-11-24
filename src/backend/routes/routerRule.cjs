const Router = require('express')
const router = new Router()
const {RuleController} = require('../controllers/index.cjs')
const checkRole = require('../middleware/checkRoleMiddleware.cjs')

router.post('/', checkRole("ADMIN"), RuleController.create)                 // T
router.get('/', checkRole("ADMIN"), RuleController.read)                    // T
router.put('/', checkRole("ADMIN"), RuleController.update)                  // T
router.delete('/', checkRole("ADMIN"), RuleController.delete)               // T

router.get('/all', checkRole("ADMIN"), RuleController.readAll)              // T

module.exports = router