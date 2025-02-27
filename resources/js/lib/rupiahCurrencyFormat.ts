export const formatRupiah = (
  value: string | number,
  includeCurrencySymbol: boolean = true,
): string => {
  const stringValue = value.toString();
  const decimalPlaces = stringValue.includes('.') ? stringValue.split('.')[1].length : 0;

  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
    .format(Number(value))
    .replace(',', '.');

  return includeCurrencySymbol ? formattedValue : formattedValue.replace(/^Rp\s*/, '');
};
