export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (rate) => {
  return `${rate.toFixed(2)}%`;
};

export const sanitizeNumber = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) || num < 0 ? 0 : num;
};