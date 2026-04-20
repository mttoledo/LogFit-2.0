export const calcularMetaDiaria = (peso: number | undefined): number => {
  if (!peso || peso <= 0) return 2000;
  return peso * 35;
};

export const calcularPorcentagem = (
  totalIngerido: number,
  metaDiaria: number,
): number => {
  return Math.min((totalIngerido / metaDiaria) * 100, 100);
};
