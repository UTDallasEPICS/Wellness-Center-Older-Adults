export class AuthPage {
  static enterUsername(username) {
    cy.origin(
      'https://dev-5qwmxmrqa1bl88h4.us.auth0.com',
      { args: { username } },
      ({ username }) => {
        cy.get('input[name="username"]').type(username);
      }
    );
  }

  static enterPassword(password) {
    cy.origin(
      'https://dev-5qwmxmrqa1bl88h4.us.auth0.com',
      { args: { password } },
      ({ password }) => {
        cy.get('input[name="password"]').type(password);
      }
    );
  }

  static submit() {
    cy.origin('https://dev-5qwmxmrqa1bl88h4.us.auth0.com', () => {
      cy.get('button[type="submit"]').click();
    });
  }
}
