export const formatRupiah = (value, includeRp = true) => {
    const formattedValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);

    return includeRp ? formattedValue : formattedValue.replace('Rp', '').trim();
};