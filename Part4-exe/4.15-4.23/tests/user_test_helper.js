const bcrypt = require('bcryptjs')
const User = require('../models/user')

const createUser = async (userData) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(userData.password, saltRounds)
  
  const user = new User({
    username: userData.username,
    name: userData.name,
    passwordHash
  })
  
  return await user.save()
}

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  }
]

module.exports = {
  createUser,
  initialUsers
}