// Formata um valor numerico (formato reais), de string para number
export const numberPrice = (valor: string): number => {
  if (!valor) return 0;
  // remove tudo que não seja número, vírgula ou ponto
  let numeroLimpo = String(valor).replace(/[^\d,.-]/g, '');
  // remove pontos de milhar
  numeroLimpo = numeroLimpo.replace(/\./g, '');
  // substitui vírgula por ponto para parseFloat
  numeroLimpo = numeroLimpo.replace(',', '.');
  return parseFloat(numeroLimpo) || 0;
};
