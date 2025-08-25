describe('Auth E2E', () => {
  const base = 'http://localhost:8080'

  it('registers a new user', () => {
    cy.visit(`${base}/register`)
    cy.get('#username').type('testuser')
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('123456')
    cy.get('#register-button').click()
    cy.contains('Welcome, testuser') // check success message
  })

  it('logs in an existing user', () => {
    cy.visit(`${base}/login`)
    cy.get('#username').type('testuser')
    cy.get('#password').type('123456')
    cy.get('#login-button').click()
    cy.contains('Welcome, testuser') // check success message
  })
})
