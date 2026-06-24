// Smoke + core flow for the Night Almanac. baseUrl is set in cypress.config.ts
// (localhost by default; override with --config baseUrl=… to hit the deployed site).

describe('Site deployment', () => {
    it('loads the chart', () => {
        cy.visit('/');
        cy.get('[data-testid="app"]').should('be.visible');
    });
});

describe('Play track flow', () => {
    it('opens the catalogue and tunes into a world', () => {
        cy.visit('/');
        cy.get('[data-testid="open-catalogue"]').click();
        cy.get('[data-testid="catalogue-item"]').last().click();
        cy.get('[data-testid="now-playing"]').should('not.have.text', 'No signal');
    });
});
