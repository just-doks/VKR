// Импортируется класс Router и создаётся экземпляр
const Router = require('express')
const router = new Router()

// Импортируются разработанные маршруты
const proxyRouter = require('./routerProxy.cjs')
const userRouter = require('./routerUser.cjs')
const listRouter = require('./routerList.cjs')
const addressRouter = require('./routerAddress.cjs')
const ruleRouter = require('./routerRule.cjs')

router.use('/users', userRouter)
router.use('/lists', listRouter)
router.use('/addresses', addressRouter)
router.use('/rules', ruleRouter)
router.use('/proxy', proxyRouter)

module.exports = router