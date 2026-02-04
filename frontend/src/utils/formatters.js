/**
 * Removes trailing zeros and unnecessary decimal point from a number string
 * @param {string} numStr - Number string with decimals
 * @returns {string} Cleaned number string
 */
function cleanDecimal(numStr) {
  return numStr.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

/**
 * Formats a number as GP (gold pieces) with K/M/B suffix
 * @param {number} amount - Amount to format
 * @returns {string} Formatted string
 */
export function formatGP(amount) {
  if (amount === null || amount === undefined || amount === 0) return '0';

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${cleanDecimal((abs / 1_000_000_000).toFixed(2))}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${cleanDecimal((abs / 1_000_000).toFixed(2))}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${cleanDecimal((abs / 1_000).toFixed(1))}K`;
  }

  return `${sign}${abs.toLocaleString()}`;
}

/**
 * Formats a number with decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export function formatNumber(num, decimals = 1) {
  if (num === null || num === undefined) return '0';
  return cleanDecimal(num.toFixed(decimals));
}

/**
 * Formats XP value
 * @param {number} xp - XP amount
 * @returns {string} Formatted XP
 */
export function formatXP(xp) {
  if (xp >= 1_000_000) {
    return `${cleanDecimal((xp / 1_000_000).toFixed(1))}M`;
  }
  if (xp >= 1_000) {
    return `${cleanDecimal((xp / 1_000).toFixed(1))}K`;
  }
  return xp.toLocaleString();
}
