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
    cy.get('input').click();
    cy.get('input').clear();
    cy.get('input').type('ma');
    cy.get('.suggestions-list :nth-child(2)').click();
    cy.get(':nth-child(1) > p').should('have.text', 'Teléfono: 5552345678');
    cy.get(':nth-child(2) > p').should('have.text', 'Ninguna conocida');
    cy.get(':nth-child(3) p').should('have.text', 'Ojo seco moderado');
    cy.get(':nth-child(4) p').should('have.text', 'Migrañas frecuentes');
    cy.get(':nth-child(5) p').should('have.text', 'Madre con degeneración macular');
  })
})
