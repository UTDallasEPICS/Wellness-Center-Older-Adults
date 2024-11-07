Feature: Homepage Load

  Scenario: User logs in successfully
    Given I am on the homepage
    When the user clicks the login button
    Then the user should be redirected to the Auth0 login page
    And the user logs in with valid credentials
    Then the user is authenticated and redirected back to the dashboard

  Scenario: User logs out successfully
    Given the user is logged in
    When the user clicks the logout button
    Then the user should be logged out and see the login button
    And the user should not be able to access the dashboard
