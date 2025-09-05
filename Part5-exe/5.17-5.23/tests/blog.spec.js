const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database and create a test user
    await request.post('http://localhost:3003/api/testing/reset')
    
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    }
    
    await request.post('http://localhost:3003/api/users', {
      data: newUser
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      
      await expect(page.getByText('Test User logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('wronguser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      
      await expect(page.getByText('invalid username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Login before each test
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      
      // Wait for login to complete
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      
      await page.getByTestId('title').fill('Test Blog Title')
      await page.getByTestId('author').fill('Test Author')
      await page.getByTestId('url').fill('https://testblog.com')
      
      await page.getByRole('button', { name: 'create' }).click()
      
      // Verify the blog is visible in the list
      await expect(page.getByText('Test Blog Title')).toBeVisible()
      await expect(page.getByText('Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // First create a blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Blog to Like')
      await page.getByTestId('author').fill('Author')
      await page.getByTestId('url').fill('https://example.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Click the view button to show details
      await page.getByRole('button', { name: 'view' }).click()
      
      // Like the blog
      const likeButton = page.getByRole('button', { name: 'like' })
      await likeButton.click()
      
      // Verify the like count increased
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added the blog can delete it', async ({ page }) => {
      // Create a blog
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Blog to Delete')
      await page.getByTestId('author').fill('Author')
      await page.getByTestId('url').fill('https://delete.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Show details
      await page.getByRole('button', { name: 'view' }).click()
      
      // Handle the confirm dialog
      page.on('dialog', dialog => dialog.accept())
      
      // Delete the blog
      await page.getByRole('button', { name: 'remove' }).click()
      
      // Verify the blog is gone
      await expect(page.getByText('Blog to Delete')).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      // Create a blog with the current user
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('My Blog')
      await page.getByTestId('author').fill('Me')
      await page.getByTestId('url').fill('https://myblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      // Show details - should see delete button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      
      // Logout
      await page.getByRole('button', { name: 'logout' }).click()
      
      // Create another user and login
      const anotherUser = {
        name: 'Another User',
        username: 'anotheruser',
        password: 'password123'
      }
      
      await request.post('http://localhost:3003/api/users', {
        data: anotherUser
      })
      
      await page.getByTestId('username').fill('anotheruser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      
      // Should not see delete button for other user's blog
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      // Create multiple blogs with different like counts
      const blogs = [
        { title: 'Least Liked', likes: 1 },
        { title: 'Most Liked', likes: 5 },
        { title: 'Medium Liked', likes: 3 }
      ]
      
      // Create blogs
      for (const blog of blogs) {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill(blog.title)
        await page.getByTestId('author').fill('Author')
        await page.getByTestId('url').fill(`https://${blog.title.toLowerCase()}.com`)
        await page.getByRole('button', { name: 'create' }).click()
      }
      
      // Add likes to each blog
      const blogElements = await page.$$('.blog')
      
      for (let i = 0; i < blogs.length; i++) {
        await blogElements[i].click()
        const likeButton = blogElements[i].getByRole('button', { name: 'like' })
        
        // Add the specified number of likes
        for (let j = 0; j < blogs[i].likes; j++) {
          await likeButton.click()
          // Wait a bit between likes to ensure they're registered
          await page.waitForTimeout(100)
        }
        
        // Collapse the blog details
        await blogElements[i].click()
      }
      
      // Get all blog titles and verify order
      const blogTitles = await page.$$eval('.blog .title', elements => 
        elements.map(el => el.textContent)
      )
      
      // Should be ordered by likes: Most Liked, Medium Liked, Least Liked
      expect(blogTitles[0]).toContain('Most Liked')
      expect(blogTitles[1]).toContain('Medium Liked')
      expect(blogTitles[2]).toContain('Least Liked')
    })
  })
})