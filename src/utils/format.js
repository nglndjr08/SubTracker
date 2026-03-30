export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat(
    currency === "PHP" ? "en-PH" : "en-US",
    {
      style: "currency",
      currency,
    }
  ).format(amount);
}

const rates = {
  USD: 1,
  PHP: 60,
  EUR: 0.92,
  GBP: 0.79,
};

export function convertCurrency(amount, from, to) {
  if (!rates[from] || !rates[to]) return amount;
  if (from === to) return amount;

  return (amount / rates[from]) * rates[to];
}