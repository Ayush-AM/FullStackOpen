const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'sekret'
  }
]

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'http://test.com' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  createUser,
  nonExistingId,
  blogsInDb,
  usersInDb
}