// cypress/e2e/blog_app.cy.js
describe('Blog app', function() {
  beforeEach(function() {
    // Reset the backend state
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    
    // Create a user
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'testuser',
      name: 'Test User',
      password: 'testpass'
    })
    
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpass')
      cy.get('#login-button').click()

      cy.contains('Test User logged in')
      cy.get('.notification.success').should('contain', 'Login successful')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      cy.get('#login-button').click()

      cy.get('.notification.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)') // Check for red color
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testpass' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('Test Blog Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('http://test.com')
      cy.get('#create-blog-button').click()

      cy.get('.notification.success').should('contain', 'A new blog Test Blog Title by Test Author added')
      cy.contains('Test Blog Title by Test Author')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Test Blog Title',
          author: 'Test Author',
          url: 'http://test.com'
        })
      })

      it('users can like a blog', function() {
        cy.contains('Test Blog Title by Test Author')
        cy.contains('Likes: 0')
        cy.contains('Like').click()
        cy.contains('Likes: 1')
      })

      it('the user who created the blog can delete it', function() {
        cy.contains('Test Blog Title by Test Author')
        cy.contains('Delete').click()
        cy.get('html').should('not.contain', 'Test Blog Title by Test Author')
      })

      it('only the creator can see the delete button', function() {
        // Create another user
        cy.request('POST', 'http://localhost:3003/api/users', {
          username: 'otheruser',
          name: 'Other User',
          password: 'otherpass'
        })
        
        // Log out
        cy.contains('Logout').click()
        
        // Log in as other user
        cy.get('#username').type('otheruser')
        cy.get('#password').type('otherpass')
        cy.get('#login-button').click()
        
        // Check that delete button is not visible
        cy.contains('Test Blog Title by Test Author')
        cy.contains('Delete').should('not.exist')
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'Author A',
          url: 'http://test1.com',
          likes: 5
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'Author B',
          url: 'http://test2.com',
          likes: 3
        })
        cy.createBlog({
          title: 'The title with the third most likes',
          author: 'Author C',
          url: 'http://test3.com',
          likes: 10
        })
      })

      it('blogs are ordered by likes', function() {
        cy.get('.blog').eq(0).should('contain', 'The title with the third most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the second most likes')
      })
    })
  })
})