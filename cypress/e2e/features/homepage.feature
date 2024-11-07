Feature: Homepage Load
  Scenario: User loads the homepage
    Given I am on the homepage
    Then I should see the homepage title

Feature: User Login
  Scenario: User logs in successfully
    Given I am on the homepage
    When the user clicks the login button
    Then the user should be redirected to the Auth0 login page
    And the user logs in with the test credentials
