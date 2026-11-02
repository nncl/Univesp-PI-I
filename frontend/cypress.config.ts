import { defineConfig } from "cypress";

// baseUrl and the admin credentials can be overridden from the environment:
// CYPRESS_BASE_URL, CYPRESS_adminUsername, CYPRESS_adminPassword, CYPRESS_apiUrl.
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      // Lets the a11y helper print violations to the terminal running Cypress,
      // which is what shows up in the GitHub Actions log.
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
        table(rows: Record<string, unknown>[]) {
          console.table(rows);
          return null;
        },
      });
    },
  },
  env: {
    adminUsername: "yara",
    adminPassword: "changeme",
    apiUrl: "http://localhost:8000/api",
  },
});
