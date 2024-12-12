# Gherkin Documentation
[Gherkin Documentation](https://cucumber.io/docs/gherkin/reference/)

Please read the Gherkin Documentation to familiarize yourself with the syntax and begin writing your first feature files.

## Capitalization Conventions when using Gherkin

- **Capitalize Controls:** Buttons, links, fields, and other user-facing elements should be capitalized in order to clearly indicate that they are an atomic UI concept.

    - **Example:**
        - "Then the Log Out button will display"
        - Capitalizing "Log Out" clarifies that this is a specific UI element that the user interacts with.
- **Capitalize Page Names:** When referring to a specific page in the application, capitalize them (e.g. Employee Dashboard page, Volunteer Dashboard page) to indicate their role.
    - **Example:**
        - "When I am on the Employee Dashboard page"

## Gherkin Best Practices

Gherkin is a domain-specific language used to define behavior in applications utilizing human-readable text. By adhering to Behavior-Driven Development principles, Gherkin bridges the gap between our technical team and our client, allowing them to easily understand how we are testing their software.

Five practices to keep in mind:

1. **Use Business-Oriented Terminology**

    Use terminology that the client is familiar with, rather than technical wordage/details.

2. **Write Declarative, Not Imperative Scenarios**

    Write scenarios that describe what the system should do, not how the user interacts with the UI.

**Example:**
- **Imperative**
    ```
    When I click the login button
    Then I enter "username" into the user id field
    ```
- **Declarative**
    ```
    When the user logs in with valid credentials
    ```

3. **Ensure Readability and Clarity**

    Good grammar, clear formatting, and consistent phrasing are key to making scenarios readable, and preventing misunderstandings. Poorly written scenarios can lead to confusion during development!

4. **One Scenario per Feature**

    Each scenario should only test one behavior or feature. Avoid combining multiple actions or outcomes into a single scenario.

5. **Write a Meaningful Narrative in Every Feature File**

    Each feature file should include a narrative that provides context, purpose, and clarity about why the tests in the file exist. Avoid writing vague narratives that don't provide the reader with any information, or require context to understand.

# Cypress Wiki
[Cypress E2E Testing](https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test)

Please read the Cypress wiki to familiarize yourself with some of Cypress' library utilities. You can refer to the existing tests in order to understand how we structure our E2E tests.

## File Structure

All Gherkin syntax tests are located in the `e2e/features` folder.

The code files which refer to the Gherkin tests are located in the `support/step_definitions` folder. Here, you can write high level code associated with each step for every scenario written into the feature file.

The code files which contain the lower level code (e.g. finding elements, clicking buttons, navigating to pages) is stored in exported classes within page files located in the `pages` folder The step definition files can refer to their respective page folders in order to make calls to methods containing the actual code.

If you would like to create your own Cypress commands, this can be done in the `commands.ts` file, and the commands can be initialized in the `cypress.d.ts` file. Please refer to official Cypress documentation if you wish to learn how to write the code for these commands.