import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../../pages/homePage";
import AuthPage from "../../pages/authPage";

const username = Cypress.env("AUTH0_USERNAME");
const password = Cypress.env("AUTH0_PASSWORD");

Given("I am on the homepage", () => {
  HomePage.visit();
});

When("the user clicks the login button", () => {
  cy.wait(1000);
  HomePage.clickLogin();
});

Then("the user should be redirected to the Auth0 login page", () => {
  cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", () => {
    cy.url().should("include", "auth0");
  });
});

Then("the user logs in with valid credentials", () => {
  AuthPage.enterUsername(username);
  AuthPage.enterPassword(password);
  AuthPage.submit();
});

Then("the user is authenticated and redirected back to the dashboard", () => {
  cy.wait(1000);
  HomePage.verifyTitle();
  cy.url().should("include", "dashboard");
});

Given("the user is logged in", () => {
  AuthPage.login();
});

When("the user clicks the logout button", () => {
  HomePage.visit();
  cy.wait(1000);
  HomePage.clickLogout();
});

Then("the user should be logged out and see the login button", () => {
  HomePage.verifyTitle();
  cy.contains('button', 'Log In');

});

Then("the user should not be able to access the dashboard", () => {
  cy.visit("/dashboardEmployee");
  cy.origin("https://dev-5qwmxmrqa1bl88h4.us.auth0.com", () => {
    cy.url().should("include", "auth0");
  });
});
