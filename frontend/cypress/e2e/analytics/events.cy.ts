// Configura gtag.js fake em ambiente de testes

type GaEvent = { name: string; params: Record<string, string> };

function gaEvents(): Cypress.Chainable<GaEvent[]> {
  return cy.window().then((win) =>
    (win.dataLayer ?? [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((args) => args[0] === "event")
      .map((args) => ({
        name: args[1] as string,
        params: args[2] as Record<string, string>,
      })),
  );
}

function shouldHaveEvent(name: string, params: Record<string, string>) {
  // Retries until the event shows up, since events are pushed asynchronously.
  cy.window().should((win) => {
    const found = (win.dataLayer ?? [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .some(
        (args) =>
          args[0] === "event" &&
          args[1] === name &&
          Object.entries(params).every(
            ([k, v]) => (args[2] as Record<string, string>)[k] === v,
          ),
      );
    expect(found, `${name} ${JSON.stringify(params)}`).to.be.true;
  });
}

describe("Analytics — eventos do GA4", () => {
  it("o GA está configurado sem page_view automático", () => {
    cy.visit("/");
    cy.window().should((win) => {
      expect(win.gtag, "gtag — o build tem NEXT_PUBLIC_GA_MEASUREMENT_ID?").to.be.a("function");
      const config = (win.dataLayer ?? [])
        .map((entry) => Array.from(entry as ArrayLike<unknown>))
        .find((args) => args[0] === "config");
      expect(config?.[2]).to.have.property("send_page_view", false);
    });
  });

  it("envia um page_view por navegação", () => {
    cy.visit("/");
    shouldHaveEvent("page_view", { page_path: "/", page_title: "Início" });

    cy.get('nav[aria-label="Principal"]').contains("a", "Portfólio").click();
    cy.location("pathname").should("eq", "/portfolio");
    shouldHaveEvent("user_interaction", {
      action: "nav_click",
      page_path: "/",
      description: "Portfólio (desktop)",
      step: "",
    });
    shouldHaveEvent("page_view", { page_path: "/portfolio", page_title: "Portfólio" });

    gaEvents().then((events) => {
      const views = events.filter((e) => e.name === "page_view").map((e) => e.params.page_path);
      expect(views).to.deep.equal(["/", "/portfolio"]);
    });
  });

  it("registra o menu mobile", () => {
    cy.viewport(375, 812);
    cy.visit("/");
    cy.contains("button", "Menu").click();
    shouldHaveEvent("user_interaction", { action: "menu_toggle", description: "open" });
    cy.contains("button", "Menu").click();
    shouldHaveEvent("user_interaction", { action: "menu_toggle", description: "close" });
  });

  it("registra o funil de agendamento sem dados pessoais", () => {
    cy.env<{ apiUrl: string }>(["apiUrl"]).then(({ apiUrl }) => {
      cy.intercept("POST", `${apiUrl}/contact/`, {
        statusCode: 201,
        body: { message: "Recebemos sua solicitação." },
      }).as("createContact");
    });

    cy.visit("/agenda-orcamento");
    shouldHaveEvent("page_view", {
      page_path: "/agenda-orcamento",
      page_title: "Agendar orçamento",
    });

    cy.contains("button", "Enviar solicitação").click();
    shouldHaveEvent("user_interaction", { action: "booking_submit", step: "3" });
    shouldHaveEvent("user_interaction", {
      action: "booking_error",
      description: "missing_fields",
      step: "3",
    });

    cy.get('button[aria-label="Ir para o próximo mês"]').click();
    cy.get(".rdp-day:not([disabled])").first().click();
    shouldHaveEvent("user_interaction", { action: "booking_date_select", step: "1" });
    cy.get('[aria-label="Horários disponíveis"] button').first().click();
    shouldHaveEvent("user_interaction", { action: "booking_time_select", step: "2" });

    cy.findField("Nome").type("Maria Teste");
    cy.findField("WhatsApp").type("19987654321");
    cy.findField("E-mail").type("maria@example.com");
    cy.findField("Descreva sua ideia").type("Uma andorinha no pulso");
    cy.contains("button", "Enviar solicitação").click();
    cy.wait("@createContact");
    shouldHaveEvent("user_interaction", { action: "booking_success", step: "4" });

    gaEvents().then((events) => {
      const sent = JSON.stringify(events);
      ["Maria", "98765", "maria@example.com", "andorinha"].forEach((pii) => {
        expect(sent, `nenhum evento contém "${pii}"`).not.to.contain(pii);
      });
    });
  });

  it("não rastreia a área administrativa", () => {
    cy.visit("/admin/login");
    cy.contains("h1", "Entrar").should("be.visible");
    gaEvents().then((events) => {
      expect(events.filter((e) => e.params.page_path?.startsWith("/admin"))).to.be.empty;
    });
  });
});
