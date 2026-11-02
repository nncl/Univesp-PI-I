const pages = [
  { path: "/", name: "home" },
  { path: "/portfolio", name: "portfólio" },
  { path: "/quem-sou-eu", name: "quem sou eu" },
  { path: "/agenda-orcamento", name: "agendar orçamento" },
  { path: "/pagina-inexistente", name: "404" },
];

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 812 },
] as const;

describe("Acessibilidade — páginas públicas (WCAG 2.1 AA)", () => {
  viewports.forEach((vp) => {
    context(vp.name, () => {
      beforeEach(() => {
        cy.viewport(vp.width, vp.height);
      });

      pages.forEach(({ path, name }) => {
        it(`${name} (${path}) não tem violações`, () => {
          cy.visit(path, { failOnStatusCode: path !== "/pagina-inexistente" });
          cy.get("h1").should("be.visible");
          cy.checkA11yPage();
        });
      });

      it("detalhe de um trabalho do portfólio não tem violações", () => {
        cy.visit("/portfolio");
        cy.get('main a[href^="/portfolio/"]').first().click();
        cy.location("pathname").should("match", /^\/portfolio\/\d+$/);
        cy.get("h1").should("be.visible");
        cy.checkA11yPage();
      });
    });
  });
});
