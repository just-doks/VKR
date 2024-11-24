const UserController = require('./UserController.cjs')
const ListController = require('./ListController.cjs')
const AddressController = require('./AddressController.cjs')
const RuleController = require('./RuleController.cjs')
const ProxyController = require('./ProxyController.cjs')

module.exports = {
    UserController: new UserController(),
    ListController: new ListController(),
    AddressController: new AddressController(),
    RuleController: new RuleController(),
    ProxyController: new ProxyController()
}