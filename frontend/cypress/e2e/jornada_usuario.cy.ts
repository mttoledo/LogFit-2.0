interface IUserTest {
  usuario: string;
  senha: string;
  idade: number;
  peso: number;
}

describe("LogFit - Jornada de Novo Usuário", () => {
  const uniqueId = Date.now();
  const user: IUserTest = {
    usuario: `user_${uniqueId}`,
    senha: "senha123",
    idade: 25,
    peso: 80,
  };

  it("Deve registrar, logar e adicionar água com sucesso", () => {
    cy.visit("/");
    cy.get('[data-testid="input-usuario"]').type(user.usuario);
    cy.get('[data-testid="input-senha"]').type(user.senha);
    cy.get('[data-testid="input-idade"]').type(user.idade);
    cy.get('[data-testid="input-peso"]').type(user.peso);
    cy.get('[data-testid="register-button"]').click();

    cy.url().should("include", "/login");
    cy.get('[data-testid="login-usuario"]').type(user.usuario);
    cy.get('[data-testid="login-senha"]').type(user.senha);
    cy.get('[data-testid="login-button"]').click();

    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="water-input"]').type(500);
    cy.get('[data-testid="water-button"]').click();
    cy.contains("500ml").should("be.visible");
    cy.reload();
    cy.contains("500ml").should("be.visible");
  });
});
