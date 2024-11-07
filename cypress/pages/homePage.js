class HomePage {
    visit() {
      cy.visit("/");
    }
  
    verifyTitle() {
      cy.title().should("include", "WCOA Rides");
    }
  }
  
  export default new HomePage();
  