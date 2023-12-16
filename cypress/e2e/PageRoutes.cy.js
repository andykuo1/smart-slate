describe('Page routing to /', () => {
  it('shold go to / on launch', () => {
    cy.visit('/');
    cy.location('pathname').should('match', /\/smart-slate\/$/);
  });
});

describe('Page routing to /edit', () => {
  it('should go to /edit from New Project click', () => {
    cy.visit('/');
    cy.contains('New Project').should('be.visible').click();
    cy.location('pathname').should('match', /\/edit$/);
  });

  it('should go to /edit from existing project select', () => {
    // Create the project first.
    cy.visit('/');
    cy.contains('New Project').click();
    // Then return to menu to select it.
    cy.visit('/');
    cy.contains('My Movie').should('be.visible').click();
    cy.location('pathname').should('match', /\/edit$/);
    cy.get('input[value="My Movie"]').should('be.visible');
  });
});

describe('Page routing to /rec', () => {
  it('should go to /rec in new take recording', () => {
    // Open a new project
    cy.visit('/');
    cy.contains('New Project').click();
    // Create a new scene
    cy.contains('New Scene').click();
    // Hit record
    cy.get('button[title="Record"]').should('be.visible').click();
    // Wait a few seconds
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3_000);
    cy.get('button[title="Cut"]').should('be.visible').should('be.enabled');
    cy.location('pathname').should('match', /\/rec$/);
    // Hit cut!
    cy.get('button[title="Cut"]').click();
    // Should return to /edit
    cy.location('pathname').should('match', /\/edit$/);
    cy.task('findDownloadedFile', 'My Movie').should('exist');
  });
});
