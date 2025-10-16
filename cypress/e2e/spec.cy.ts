//
describe('Site deployment', () => {
    it('passes', () => {
        cy.visit('https://digitalhorizons.club');
    });
});

//
describe('Play track flow', () => {
    it('passes', () => {
        cy.visit('https://digitalhorizons.club');
        cy.get('[data-testid="button.sector-list"]').click();
        cy.get('[data-testid="list.sector-list"]').children().last().click();
        cy.get('[data-testid="button.play-track"]').click();
    });
});
