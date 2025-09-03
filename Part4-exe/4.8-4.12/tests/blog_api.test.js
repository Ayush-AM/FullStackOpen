const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')
const { connect, close, clear } = require('./mongo_test_helper')

beforeAll(async () => {
  await connect()
})

beforeEach(async () => {
  await clear()
  
  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

// 4.8: Test GET /api/blogs
describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

// 4.9: Test that id property exists
describe('viewing a specific blog', () => {
  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

// 4.10: Test POST /api/blogs
describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Test Driven Development',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Test Driven Development')
  })

  test('increases total number of blogs by one', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }

    await api.post('/api/blogs').send(newBlog)
    
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })
})

// 4.11: Test missing likes property defaults to 0
describe('when likes property is missing', () => {
  test('defaults to 0', async () => {
    const newBlog = {
      title: 'Missing Likes',
      author: 'Test Author',
      url: 'http://test.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })
})

// 4.12: Test missing title or url returns 400
describe('when required properties are missing', () => {
  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'Missing URL',
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if both title and url are missing', async () => {
    const newBlog = {
      author: 'Test Author',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(async () => {
  await close()
})