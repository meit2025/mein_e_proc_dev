export const formatRupiah = (
  value: string | number | null | undefined,
  includeCurrencySymbol: boolean = true,
): string => {
  // Jika value null/undefined, ubah jadi 0
  const safeValue = value ?? 0;

  const stringValue = safeValue.toString();
  const decimalPlaces = stringValue.includes('.') ? stringValue.split('.')[1].length : 0;

  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
    .format(Number(safeValue))
    .replace(',', '.');

  return includeCurrencySymbol ? formattedValue : formattedValue.replace(/^Rp\s*/, '');
};
