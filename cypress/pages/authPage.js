import HomePage from "./homePage";

class AuthPage {
  
  enterUsername(username) {
    cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", { args: { username } }, ({ username }) => {
      cy.get('input[name="username"]').type(username);
    });
  }

  enterPassword(password) {
    cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", { args: { password } }, ({ password }) => {
      cy.get('input[name="password"]').type(password);
    });
  }

  submit() {
    cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", () => {
      cy.get('button[type="submit"]').click();
    });
  }

  login() {
    const username = Cypress.env("AUTH0_USERNAME");
    const password = Cypress.env("AUTH0_PASSWORD");

    cy.session("authSession", () => {
      HomePage.visit();
      cy.wait(1000);
    HomePage.clickLogin();
    cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", () => {
      cy.url().should("include", "auth0");
    });
    this.enterUsername(username);
    this.enterPassword(password);
    this.submit();
    });
  }
}

export default new AuthPage();
