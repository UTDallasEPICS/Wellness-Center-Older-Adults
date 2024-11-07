import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../../pages/homePage";

Given("I am on the homepage", () => {
  HomePage.visit();
});

Then("I should see the homepage title", () => {
  HomePage.verifyTitle();
});
