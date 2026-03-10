export const formatCurrency = (amount) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
};

export const formatPercentage = (rate) => {
  const safeRate = Number.isFinite(rate) ? rate : 0;
  return `${safeRate.toFixed(2)}%`;
};

export const sanitizeNumber = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) || num < 0 ? 0 : num;
};
