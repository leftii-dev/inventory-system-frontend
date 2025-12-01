export const formatPrice = (amount: (number | string)) => {
    const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericValue)) {
        return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(numericValue);
};