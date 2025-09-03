const usersRouter = require('express').Router()
const userController = require('../controllers/users')

usersRouter.get('/', userController.getAll)
usersRouter.post('/', userController.create)

module.exports = usersRouter