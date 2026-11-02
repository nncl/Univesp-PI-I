import "cypress-axe";
import "./commands";

// Never load the real gtag.js in tests: no hits reach GA, and events stay queued
// in window.dataLayer for the analytics specs to inspect.
beforeEach(() => {
  cy.intercept("https://www.googletagmanager.com/**", { statusCode: 204, body: "" });
});
