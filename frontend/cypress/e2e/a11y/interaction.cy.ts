describe("Acessibilidade — teclado e interação", () => {
  it("o link 'Pular para o conteúdo' é o primeiro foco e leva ao <main>", () => {
    cy.visit("/");
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should("have.text", "Pular para o conteúdo").and("be.visible");
    cy.press(Cypress.Keyboard.Keys.ENTER);
    cy.focused().should("have.prop", "tagName", "MAIN");
  });

  it("no mobile, o menu abre e fecha com o botão e expõe aria-expanded", () => {
    cy.viewport(375, 812);
    cy.visit("/");
    cy.contains("button", "Menu")
      .should("have.attr", "aria-expanded", "false")
      .and("have.attr", "aria-controls")
      .then((id) => {
        cy.get(`#${id}`).should("not.be.visible");
        cy.contains("button", "Menu").click().should("have.attr", "aria-expanded", "true");
        cy.get(`#${id}`).should("be.visible").within(() => {
          cy.contains("a", "Portfólio").should("be.visible");
        });
        cy.checkA11yPage();
        cy.press(Cypress.Keyboard.Keys.ESC);
        cy.contains("button", "Menu").should("have.attr", "aria-expanded", "false");
        cy.focused().should("contain.text", "Menu");
      });
  });

  describe("formulário de orçamento", () => {
    beforeEach(() => {
      cy.visit("/agenda-orcamento");
    });

    it("todos os campos têm rótulo associado", () => {
      [
        "Nome",
        "Tamanho da tatuagem",
        "WhatsApp",
        "E-mail",
        "Descreva sua ideia",
      ].forEach((label) => {
        cy.findField(label).should("be.visible");
      });
    });

    it("erros de validação são anunciados e marcam os campos", () => {
      cy.contains("button", "Enviar solicitação").click();
      cy.get('[role="alert"]').should("contain.text", "Preencha nome, WhatsApp e descrição.");
      cy.checkA11yPage();
    });

    it("horários indicam qual está selecionado (aria-pressed)", () => {
      // Always move to next month so there are future weekdays with free slots.
      cy.get('button[aria-label="Ir para o próximo mês"]').click();
      cy.get(".rdp-day:not([disabled])").first().click();
      cy.get('[aria-label="Horários disponíveis"] button')
        .first()
        .should("have.attr", "aria-pressed", "false")
        .click()
        .should("have.attr", "aria-pressed", "true");
      cy.checkA11yPage();
    });
  });
});
