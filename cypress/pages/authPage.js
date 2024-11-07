class AuthPage {
    enterUsername(username) {
      cy.get('input[name="username"]').type(username); // Adjust the selector if needed
    }
  
    enterPassword(password) {
      cy.get('input[name="password"]').type(password); // Adjust the selector if needed
    }
  
    submit() {
      cy.get('button[type="submit"]').click(); // Adjust the selector if needed
    }
  }
  
  export default new AuthPage();
  