describe('Creating new things with defaults', () => {
  it('has expected defaults', () => {
    // Setup
    cy.visit('/');

    // Should be able to create new projects
    cy.contains('New Project').should('be.visible');
    // But should have no projects available
    cy.contains('My Movie').should('not.exist');
  });

  it('has expected new projects', () => {
    // Setup
    cy.visit('/');

    // Create first new project
    cy.contains('New Project').click();
    // Should then start project
    cy.contains('Start!').click();
    // with document title
    cy.get('input[title="Project title"]')
      .should('be.visible')
      .should('have.value', 'My Movie');
    // with "New Scene" button
    cy.contains('New Scene').should('be.visible');

    // Return to menu
    cy.visit('/');

    // Should have an existing project now
    cy.contains('My Movie').should('be.visible');
    // Should still be able to create new project
    cy.contains('New Project').should('be.visible');

    // Create second new project
    cy.contains('New Project').click();
    // Should then start project
    cy.contains('Start!').click();
    // with document title
    cy.get('input[title="Project title"]')
      .should('be.visible')
      .should('have.value', 'My Movie')
      .clear();
    cy.get('input[title="Project title"]').type('The Wild West');
    // with "New Scene" button
    cy.contains('New Scene').should('be.visible');

    // Return to menu
    cy.visit('/');

    // Should have both existing projects now
    cy.contains('My Movie').should('be.visible');
    cy.contains('The Wild West').should('be.visible');

    // Should still be able to create new project
    cy.contains('New Project').should('be.visible');
  });

  it('has expected new scenes', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('Start!').click();

    // Create first new scene
    cy.contains('New Scene').click();
    cy.contains('01', { matchCase: false });

    // Create a new second scene
    cy.contains('New Scene').click();
    cy.contains('02', { matchCase: false });
  });

  it('has expected new shots', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('Start!').click();
    cy.contains('New Scene').click();

    // Create first new shot
    cy.get('button[title="New shot"]').last().click();
    cy.contains('1A').should('exist');

    // TODO: Fix this test.
  });

  it('has expected new takes', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('Start!').click();
    cy.contains('New Scene').click();

    // TODO: Fix this test.
  });
});
