import type { Result } from "axe-core";

// WCAG 2.1 level A + AA — o target de conformidade para todo o site
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Injeta e falha qualquer teste com uma violação a WCAG 2.1 AA. */
      checkA11yPage(context?: string): Chainable<void>;
      adminLogin(): Chainable<void>;
      findField(label: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

function reportViolations(violations: Result[]) {
  cy.location("pathname").then((pathname) => {
    cy.task("log", `${violations.length} accessibility violation(s) on ${pathname}`);
    cy.task(
      "table",
      violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
        targets: v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join(" | "),
      })),
    );
  });
}

Cypress.Commands.add("checkA11yPage", (context?: string) => {
  cy.injectAxe();
  cy.checkA11y(context, { runOnly: { type: "tag", values: WCAG_TAGS } }, reportViolations);
});

Cypress.Commands.add("findField", (label: string) => {
  return cy
    .contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      expect(id, `label "${label}" has a for attribute`).to.be.a("string").and.not.be.empty;
      return cy.get(`[id="${id}"]`);
    });
});

Cypress.Commands.add("adminLogin", () => {
  cy.env<{ adminUsername: string; adminPassword: string }>([
    "adminUsername",
    "adminPassword",
  ]).then(({ adminUsername, adminPassword }) => {
    cy.session(adminUsername, () => {
      cy.visit("/admin/login");
      cy.findField("Usuário").type(adminUsername);
      cy.findField("Senha").type(adminPassword, { log: false });
      cy.contains("button", "Entrar").click();
      cy.location("pathname").should("eq", "/admin");
      cy.contains("h1", "Painel").should("be.visible");
    });
  });
});

export {};
