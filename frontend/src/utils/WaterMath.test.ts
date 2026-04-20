import { calcularMetaDiaria } from "./WaterMath";
import { calcularPorcentagem } from "./WaterMath";

describe("Cálculos do Módulo de Água", () => {
  it("Deve calcular 2800ml para uma pessoa de 80kg", () => {
    const resultado = calcularMetaDiaria(80);
    expect(resultado).toBe(2800);
  });

  it("Deve retornar 2000ml se o peso for undefined, 0 ou negativo", () => {
    expect(calcularMetaDiaria(undefined)).toBe(2000);
    expect(calcularMetaDiaria(0)).toBe(2000);
    expect(calcularMetaDiaria(-50)).toBe(2000);
  });

  it("Deve calcular 50% para ingestão de 1000ml com meta de 2000ml", () => {
    const resultado = calcularPorcentagem(1000, 2000);
    expect(resultado).toBe(50);
  });
  it("Deve retornar 100% para ingestão de 2000ml com meta de 2000ml", () => {
    expect(calcularPorcentagem(2000, 2000)).toBe(100);
  });
});
