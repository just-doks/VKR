const Router = require('express');
const router = new Router();
const { ListController } = require('../controllers/index.cjs');
const checkRole = require('../middleware/checkRoleMiddleware.cjs');

router.post('/', checkRole("ADMIN"), ListController.create);        // T
router.get('/', checkRole("ADMIN"), ListController.read);           // T
router.put('/', checkRole("ADMIN"), ListController.update);         // T
router.patch('/', checkRole("ADMIN"), ListController.patch);        // T
router.delete('/', checkRole("ADMIN"), ListController.delete);      // T

router.get('/exist', checkRole('ADMIN'), ListController.isList);    // T

module.exports = router;