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
    // with document title
    cy.get('input[title="Project title"]')
      .should('be.visible')
      .should('have.value', 'My Movie');
    // with document id
    cy.contains('ID:').should('be.visible');
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
    // with document title
    cy.get('input[title="Project title"]')
      .should('be.visible')
      .should('have.value', 'My Movie')
      .type('The Wild West');
    // with document id
    cy.contains('ID:').should('be.visible');
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

    // Create first new scene
    cy.contains('New Scene').click();
    cy.contains('Scene 01', { matchCase: false });
    // with default first shot
    cy.contains('S01AT01--').should('be.visible');
    cy.get('button[title="Record"]').should('be.visible');
    // with default first take
    cy.contains('Take 1').should('be.visible');
    cy.contains('New Shot').should('be.visible');

    // Create a new second scene
    cy.contains('New Scene').click();
    // with default first shot
    cy.contains('S02AT01--').should('be.visible');
    cy.contains('S02AT01--')
      .parents('table')
      .parents('li')
      .as('scene2shot1_root');
    cy.get('@scene2shot1_root')
      .find('button[title="Record"]')
      .should('be.visible');
    cy.get('@scene2shot1_root')
      .contains('button', 'New Shot')
      .should('be.visible');
    // with default first take
    cy.get('@scene2shot1_root').contains('Take 1').should('be.visible');
  });

  it('has expected new shots', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('New Scene').click();

    // First already exists by default
    cy.contains('S01AT01--').should('be.visible');

    // Create a new second shot
    cy.contains('New Shot').click();
    cy.contains('S01BT01--').should('be.visible');
    cy.contains('S01BT01--')
      .parents('table')
      .parents('li')
      .as('scene1shot2_root');
    cy.get('@scene1shot2_root')
      .find('button[title="Record"]')
      .should('be.visible');
    cy.get('@scene1shot2_root')
      .contains('button', 'New Shot')
      .should('be.visible');
    // with default first take
    cy.get('@scene1shot2_root').contains('Take 1').should('be.visible');
  });

  it('has expected new takes', () => {
    // Setup
    cy.visit('/');
    cy.contains('New Project').click();
    cy.contains('New Scene').click();

    // Record the first take
    cy.contains('S01AT01--').should('be.visible');
    cy.contains('S01AT01--')
      .parents('table')
      .parents('li')
      .as('scene1shot1_root');
    cy.get('@scene1shot1_root')
      .find('button[title="Record"]')
      .should('be.visible')
      .as('scene1shot1_record');
    cy.get('@scene1shot1_root')
      .find('ul[title="Take list"]')
      .should('be.visible')
      .as('scene1shot1_takelist');
    // with the default first take placeholder
    cy.get('@scene1shot1_takelist').contains('Take 1').should('be.visible');
    // and commence with the click!
    cy.get('@scene1shot1_record').click();
    // and wait a few seconds
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3_000);
    // and hit cut!
    cy.get('button[title="Cut"]').click();
    // Should have a new take ready!
    cy.contains('S01AT02--').should('be.visible');
    cy.contains('S01AT02--')
      .parents('table')
      .parents('li')
      .as('scene1shot1_root');
    cy.get('@scene1shot1_root')
      .find('button[title="Record"]')
      .should('be.visible')
      .as('scene1shot1_record');
    cy.get('@scene1shot1_root')
      .find('ul[title="Take list"]')
      .should('be.visible')
      .as('scene1shot1_takelist');
    // with the first and second takes
    cy.get('@scene1shot1_takelist').contains('Take 1').should('be.visible');
    cy.get('@scene1shot1_takelist').contains('Take 2').should('be.visible');
  });
});
