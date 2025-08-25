describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080/register')
    
    cy.get('a').click()
    cy.get('#username').click()
    cy.get('#username').clear()
    cy.get('#username').type('tono')
    cy.get('#password').click()
    cy.get('#password').clear()
    cy.get('#password').type('E')
    cy.get('#password').clear()
    cy.get('#password').type('Contrasena1!')
    cy.get('.auth-button').click()
    cy.get(':nth-child(2) > ul > :nth-child(1)').should('be.visible');
    cy.get(':nth-child(2) > ul > :nth-child(2)').should('be.visible');
    cy.get('ul :nth-child(3)').should('be.visible');
  })
})
