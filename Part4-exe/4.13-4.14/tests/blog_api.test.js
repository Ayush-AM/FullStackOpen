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

// Basic GET tests
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

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })
})

// POST tests
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

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
  })
})

// 4.13: DELETE tests
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await nonExistingId()

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 'invalid-id-format'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

// 4.14: PUT (update) tests
describe('updating a blog', () => {
  test('succeeds with valid data and returns updated blog', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      title: 'Updated React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 15
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(15)
    expect(response.body.title).toBe('Updated React patterns')

    const blogsAtEnd = await blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    expect(updatedBlog.likes).toBe(15)
  })

  test('updates only the likes field when only likes are provided', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updateData = {
      likes: 25
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateData)
      .expect(200)

    expect(response.body.likes).toBe(25)
    expect(response.body.title).toBe(blogToUpdate.title)
    expect(response.body.author).toBe(blogToUpdate.author)
    expect(response.body.url).toBe(blogToUpdate.url)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await nonExistingId()

    const updateData = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(updateData)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 'invalid-id-format'

    const updateData = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updateData)
      .expect(400)
  })

  test('fails with status code 400 if required fields are missing', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const invalidUpdateData = {
      title: '', // Empty title should fail validation
      url: blogToUpdate.url,
      likes: 10
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(invalidUpdateData)
      .expect(400)
  })
})

afterAll(async () => {
  await close()
})