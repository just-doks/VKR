const Router = require('express')
const router = new Router()
const {AddressController} = require('../controllers/index.cjs')
const checkRole = require('../middleware/checkRoleMiddleware.cjs')

router.post('/', checkRole("ADMIN"), AddressController.create)          // T
router.get('/', checkRole("ADMIN"), AddressController.read)             // T
router.patch('/', checkRole('ADMIN'), AddressController.patch)          // T
router.put('/', checkRole("ADMIN"), AddressController.update)           // T
router.delete('/', checkRole("ADMIN"), AddressController.delete)        // T

router.get('/exist', checkRole("ADMIN"), AddressController.isAddress)   // T

module.exports = router