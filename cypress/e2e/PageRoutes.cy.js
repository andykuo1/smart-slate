describe('Page routing to /', () => {
  it('shold go to / on launch', () => {
    cy.visit('/');
    cy.location('pathname').should('match', /\/smart-slate\/$/);
  });
});

describe('Page routing to /new', () => {
  it('should go to /new from New Project click', () => {
    cy.visit('/');
    cy.contains('New Project').should('be.visible').click();
    cy.location('pathname').should('match', /\/new$/);
  });
});

describe('Page routing to /edit', () => {
  it('should go to /edit from existing project select', () => {
    // Create the project first.
    cy.visit('/');
    cy.contains('New Project').click();
    // NOTE: Click start, otherwise it will delete itself
    //  when going back with an empty project.
    cy.contains('Start!').click();
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
    cy.contains('Start!').click();
    // Create a new scene
    cy.contains('New Scene').click();

    // TODO: Fix this test.
    /*
    // Hit record
    cy.get('button[title="Record"]').click();
    cy.get('button[title="Start recording"]').click();
    // Wait a few seconds
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3_000);
    cy.location('pathname').should('match', /\/rec$/);
    // Hit cut!
    cy.get('button[title="Stop recording"]').should('be.enabled').click();
    cy.contains('Back').click();
    // Should return to /edit
    cy.location('pathname').should('match', /\/edit$/);
    cy.task('findDownloadedFile', 'MYMOVIE').should('exist');
    */
  });
});
