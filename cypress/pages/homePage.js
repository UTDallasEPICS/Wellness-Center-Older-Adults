export class HomePage {
  static visit() {
    cy.visit('/');
  }

  static verifyTitle() {
    cy.title().should('include', 'WCOA Rides');
  }

  static clickLogin() {
    cy.contains('button', 'Log In').click();
  }

  static clickLogout() {
    cy.contains('button', 'Log Out').click();
  }
}