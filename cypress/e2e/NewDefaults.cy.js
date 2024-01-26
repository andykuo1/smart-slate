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
    cy.get('button[title="Shotlist"]').click();

    // Create first new scene
    cy.contains('New Scene').click();
    cy.contains('01', { matchCase: false });
    cy.contains('01').parents('section').as('S1_root');
    // with default first shot
    cy.contains('1A').should('be.visible');
    cy.get('button[title="Record"]').should('be.visible');
    cy.get('@S1_root').contains('New Shot').should('be.visible');
    // with default first take
    cy.contains('T1').should('be.visible');

    // Create a new second scene
    cy.contains('New Scene').click();
    cy.contains('02', { matchCase: false });
    cy.contains('02').parents('section').as('S2_root');
    // with default first shot
    cy.contains('2A').should('exist');
    cy.contains('2A').parents('li').as('S2A_root');
    cy.get('@S2A_root').find('button[title="Record"]').should('exist');
    cy.get('@S2_root').contains('New Shot').should('exist');
    // with default first take
    cy.get('@S2A_root').contains('T1').should('exist');
  });

  it('has expected new shots', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('Start!').click();
    cy.get('button[title="Shotlist"]').click();
    cy.contains('New Scene').click();
    cy.contains('01').parents('section').as('S1_root');

    // First already exists by default
    cy.contains('1A').should('be.visible');

    // Create a new second shot
    cy.contains('New Shot').click();
    cy.contains('1B').should('be.visible');
    cy.contains('1B').parents('li').as('S1B_root');
    cy.get('@S1B_root').find('button[title="Record"]').should('be.visible');
    cy.get('@S1_root').contains('New Shot').should('exist');
    // with default first take
    cy.get('@S1B_root').contains('T1').should('be.visible');
  });

  it('has expected new takes', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('Start!').click();
    cy.get('button[title="Shotlist"]').click();
    cy.contains('New Scene').click();

    // Record the first take
    cy.contains('1A').should('be.visible');
    cy.contains('1A').parents('li').as('S1A_root');
    cy.get('@S1A_root')
      .find('button[title="Record"]')
      .should('be.visible')
      .as('S1A_record');
    cy.get('@S1A_root').find('ul').should('be.visible').as('S1A_takes');
    // with the default first take placeholder
    cy.get('@S1A_takes').contains('T1').should('be.visible');
    // and commence with the click!
    cy.get('@S1A_record').click();
    cy.get('button[title="Start recording"]').click();
    // and wait a few seconds
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3_000);
    // and hit cut!
    cy.get('button[title="Stop recording"]').click();
    cy.contains('Back').click();
    // Should have a new take ready!
    cy.contains('1A').should('be.visible');
    cy.contains('1A').parents('li').as('S1A_root');
    cy.get('@S1A_root')
      .find('button[title="Record"]')
      .should('be.visible')
      .as('S1A_record');
    cy.get('@S1A_root').find('ul').should('be.visible').as('S1A_takes');
    // with the first and second takes
    cy.get('@S1A_takes').contains('T1').should('be.visible');
    cy.get('@S1A_takes').contains('T2').should('be.visible');
  });
});
