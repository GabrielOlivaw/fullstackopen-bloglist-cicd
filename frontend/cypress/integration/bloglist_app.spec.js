describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Gabriel Knight',
      username: 'root',
      password: 'secret'
    }
    const user2 = {
      name: 'Faker Fakerman',
      username: 'faker',
      password: 'nil'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3003')
  })

  it('Front page can be opened', function() {
    cy.contains('Bloglist application')
    cy.contains('Bloglist Login')
  })

  it('Login form is shown', function() {
    cy.get('#loginForm')
    cy.get('#Username')
    cy.get('#Password')
    cy.get('#loginButton')
  })

  describe('Login', function() {
    it('Succeeds with correct credentials', function() {
      cy.get('#Username').type('root')
      cy.get('#Password').type('secret')
      cy.get('#loginButton').click()

      cy.contains('User root logged in.')
    })

    it('Fails with wrong credentials', function() {
      cy.get('#Username').type('root')
      cy.get('#Password').type('abc123')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials.')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'secret' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()

      cy.get('#Title').type('The nuances of E2E')
      cy.get('#Author').type('Johnny Psychic')
      cy.get('#Url').type('/the-nuances-of-e2e.html')

      cy.get('#createBlogButton').click()
      cy.get('#blogList').contains('The nuances of E2E')
    })

    describe('With previously created blogs', function() {
      beforeEach(function() {
        cy.addBlog({ title: 'Cryptography Part 1', author: 'Martha Lovelace', url: '/cryptography-part-1.html' })
        cy.addBlog({ title: 'Tales of Egypt', author: 'Khemet', url: '/tales-of-egypt.html', likes: 43 })
        cy.addBlog({ title: 'Italian Grammar', author: 'Julia Santa', url: '/italian-grammar.html', likes: 42 })
      })

      it('A blog can be liked', function() {
        cy.contains('Cryptography Part 1').as('blogParent')
        cy.get('@blogParent').contains('Show').click()
        cy.get('@blogParent').contains('Likes: 0')
        cy.get('@blogParent').contains('Like').click()
        cy.get('@blogParent').contains('Likes: 1')

        cy.get('.message').contains('Like added to blog Cryptography Part 1.')
      })

      it('A blog can be deleted', function() {
        cy.contains('Cryptography Part 1').as('blogParent')
        cy.get('@blogParent').contains('Show').click()
        cy.get('@blogParent').contains('Delete').click()
        cy.get('html').should('not.contain', 'Cryptography Part 1')

        cy.get('.message').contains('Blog deleted successfully.')
      })

      it('A blog from another user can\'t be deleted', function() {
        cy.contains('Logout').click()
        cy.login({ username: 'faker', password: 'nil' })

        cy.contains('Cryptography Part 1').as('blogParent')
        cy.get('@blogParent').contains('Show').click()
        cy.get('@blogParent').should('not.contain', 'Delete')
      })

      it('Blogs are ordered by number of likes', function() {
        cy.get('#blogList').children().then(blogs => {
          // Obtain the blogs ids
          const blogIds = blogs.map((index, blog) => blog.id)

          // Check whether the most liked blog is the first one.
          cy.get(`#${blogIds[0]}`).contains('Tales of Egypt')

          // Like the second most liked blog in order to surpass the first.
          cy.get(`#${blogIds[1]}`).contains('Show').click()
          cy.get(`#${blogIds[1]}`).contains('Like').click()
          cy.get(`#${blogIds[1]}`).contains('Like').click()

          // Don't trust cy.wait(), it doesn't work properly in a CI environment.
        })

        cy.get('#blogList').eq(0).contains('Italian Grammar')
      })
    })
  })
})
