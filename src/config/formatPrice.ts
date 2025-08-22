export const formatPrice = (value: number) => {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const parseCurrency = (value: string) => {
  return Number(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
};

export default { formatPrice, parseCurrency };
