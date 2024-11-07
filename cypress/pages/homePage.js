class HomePage {
    visit() {
      cy.visit("/");
    }
  
    verifyTitle() {
      cy.title().should("include", "WCOA Rides");
    }

    clickLogin() {
      cy.contains('button', "Log In").click();
    }

    clickLogout() {
      cy.contains('button', "Log Out").click();
    }
  }
  
  export default new HomePage();
  