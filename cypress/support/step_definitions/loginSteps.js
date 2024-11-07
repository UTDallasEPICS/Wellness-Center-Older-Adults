import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../../pages/homePage";
import AuthPage from "../../pages/authPage";

const username = Cypress.env("AUTH0_USERNAME");
const password = Cypress.env("AUTH0_PASSWORD");

Given("I am on the homepage", () => {
  HomePage.visit();
});

When("the user clicks the login button", () => {
  HomePage.clickLogin();
});

Then("the user should be redirected to the Auth0 login page", () => {
  cy.url().should("include", "auth0");
});

Then("the user logs in with the test credentials", () => {
  AuthPage.enterUsername(username);
  AuthPage.enterPassword(password);
  AuthPage.submit();
});
