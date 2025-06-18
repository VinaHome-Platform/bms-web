export const formatCurrency = (value: number): string => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};
