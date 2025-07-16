export const formatCurrency = (value: number): string => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
export const formatCurrencyWithoutSymbol = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
}
