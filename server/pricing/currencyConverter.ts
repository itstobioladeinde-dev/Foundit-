/**
 * Reference exchange rates against USD for market quote normalization.
 * In production, this can be linked to live FX feeds or bank mid-market rates.
 */
export const EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  CAD: 0.74,
  AUD: 0.65,
  NGN: 0.00067, // ~1500 NGN per USD
  INR: 0.012,
  CNY: 0.14,
  JPY: 0.0068,
  ZAR: 0.055,
  KES: 0.0077,
};

/**
 * Converts an amount from one currency to another using standard benchmark rates.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromUpper = fromCurrency.toUpperCase();
  const toUpper = toCurrency.toUpperCase();

  if (fromUpper === toUpper) return amount;

  const fromRate = EXCHANGE_RATES_TO_USD[fromUpper] || 1.0;
  const toRate = EXCHANGE_RATES_TO_USD[toUpper] || 1.0;

  // Amount in USD = amount * fromRate
  const inUSD = amount * fromRate;
  // Amount in target = inUSD / toRate
  const converted = inUSD / toRate;

  return Math.round(converted * 100) / 100;
}
