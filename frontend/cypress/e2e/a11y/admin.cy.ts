describe("Acessibilidade — área administrativa (WCAG 2.1 AA)", () => {
  before(() => {
    const suggested = new Date();
    suggested.setDate(suggested.getDate() + 7);
    cy.env<{ apiUrl: string }>(["apiUrl"]).then(({ apiUrl }) => {
      cy.request("POST", `${apiUrl}/contact/`, {
        name: "Teste A11y",
        phone: "(19) 99999-9999",
        description: "Solicitação criada pelos testes de acessibilidade.",
        suggested_date: suggested.toISOString(),
      });
    });
  });

  it("login não tem violações, inclusive com erro", () => {
    cy.visit("/admin/login");
    cy.checkA11yPage();
    cy.findField("Usuário").type("nao-existe");
    cy.findField("Senha").type("senha-errada");
    cy.contains("button", "Entrar").click();
    cy.get('[role="alert"]').should("contain.text", "Usuário ou senha inválidos.");
    cy.checkA11yPage();
  });

  describe("autenticado", () => {
    beforeEach(() => {
      cy.adminLogin();
    });

    it("painel", () => {
      cy.visit("/admin");
      cy.contains("h1", "Painel").should("be.visible");
      // Counters render "—" until the API responds.
      cy.get("main").should("not.contain.text", "—");
      cy.checkA11yPage();
    });

    it("lista de portfólio", () => {
      cy.visit("/admin/portfolio");
      cy.contains("h1", "Portfólio").should("be.visible");
      cy.contains("Carregando…").should("not.exist");
      cy.checkA11yPage();
    });

    it("novo trabalho, inclusive com erro de validação", () => {
      cy.visit("/admin/portfolio/new");
      cy.findField("Título").should("be.visible");
      cy.findField("Descrição").should("be.visible");
      cy.findField("URL da imagem").should("be.visible");
      cy.checkA11yPage();
      cy.contains("button", "Criar").click();
      cy.get('[role="alert"]').should("contain.text", "Preencha todos os campos.");
      cy.checkA11yPage();
    });

    it("edição de trabalho", () => {
      cy.visit("/admin/portfolio");
      cy.contains("a", "Editar").first().click();
      cy.location("pathname").should("match", /\/admin\/portfolio\/\d+\/edit$/);
      cy.findField("Título").should("not.have.value", "");
      cy.checkA11yPage();
    });

    it("lista e detalhe de solicitações", () => {
      cy.visit("/admin/contacts");
      cy.contains("h1", "Solicitações").should("be.visible");
      cy.contains("Carregando…").should("not.exist");
      cy.checkA11yPage();

      cy.contains("a", "Teste A11y").click();
      cy.contains("h1", "Teste A11y").should("be.visible");
      cy.checkA11yPage();
    });
  });
});
