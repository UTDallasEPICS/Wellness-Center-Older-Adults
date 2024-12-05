/// <reference types="cypress" />

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

export {}; // This is important to avoid issues with module augmentation
