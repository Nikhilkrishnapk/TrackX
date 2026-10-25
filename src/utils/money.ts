// Money helpers.
//
// Amounts are stored and summed as integer paise (₹1 = 100 paise) so that
// totals are exact. JavaScript numbers are floats: 0.1 + 0.2 !== 0.3, but
// 10 + 20 === 30. Only convert to rupees at the edges (input and display).

// Upper bound for a single amount: ₹1,00,00,000 (one crore).
export const MAX_AMOUNT_MINOR = 1_000_000_000;

const AMOUNT_REGEX = /^\d+(\.\d{0,2})?$/;

export type ParseAmountResult =
  | { ok: true; amountMinor: number }
  | { ok: false; error: string };

// Parses user input such as "120", "120.5" or "1,200.75" into paise
// without going through floating point multiplication.
export function parseAmountToMinor(input: string): ParseAmountResult {
  const cleaned = input.replace(/,/g, '').trim();

  if (!cleaned) {
    return { ok: false, error: 'Enter an amount' };
  }
  if (!AMOUNT_REGEX.test(cleaned)) {
    return { ok: false, error: 'Enter a valid amount (max 2 decimals)' };
  }

  const [rupees, paise = ''] = cleaned.split('.');
  const amountMinor =
    parseInt(rupees, 10) * 100 + parseInt(paise.padEnd(2, '0'), 10);

  if (amountMinor <= 0) {
    return { ok: false, error: 'Amount must be greater than zero' };
  }
  if (amountMinor > MAX_AMOUNT_MINOR) {
    return { ok: false, error: 'Amount is too large' };
  }
  return { ok: true, amountMinor };
}

// Indian digit grouping: 12345678 -> "1,23,45,678"
function groupIndian(digits: string): string {
  if (digits.length <= 3) {
    return digits;
  }
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${lastThree}`;
}

// 845020 -> "₹ 8,450.20", -500 -> "-₹ 5.00"
export function formatCurrency(amountMinor: number): string {
  const sign = amountMinor < 0 ? '-' : '';
  const absolute = Math.abs(Math.round(amountMinor));
  const rupees = Math.floor(absolute / 100).toString();
  const paise = (absolute % 100).toString().padStart(2, '0');
  return `${sign}₹ ${groupIndian(rupees)}.${paise}`;
}

// Short label for chart slices: 845020 -> "₹8,450"
export function formatCurrencyShort(amountMinor: number): string {
  const rupees = Math.round(Math.abs(amountMinor) / 100).toString();
  return `₹${groupIndian(rupees)}`;
}
