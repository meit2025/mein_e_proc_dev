export const formatRupiah = (
  value: string | number,
  includeCurrencySymbol: boolean = true,
): string => {
  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(Number(value));

  return includeCurrencySymbol ? formattedValue : formattedValue.replace(/^Rp\s*/, '');
};
