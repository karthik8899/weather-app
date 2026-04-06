/**
 * Convert Celsius (from OWM metric API) to the desired unit.
 * @param {number} celsius
 * @param {'metric'|'imperial'} unit
 * @returns {number} rounded converted temperature
 */
export function convertTemp(celsius, unit) {
  if (unit === 'imperial') return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

/**
 * Convert wind speed from m/s (OWM metric) to the desired unit.
 * @param {number} ms - wind speed in m/s
 * @param {'metric'|'imperial'} unit
 * @returns {number} rounded converted wind speed
 */
export function convertWind(ms, unit) {
  if (unit === 'imperial') return Math.round(ms * 2.23694);
  return Math.round(ms);
}

/** @returns {'°C'|'°F'} */
export function tempLabel(unit) {
  return unit === 'imperial' ? '°F' : '°C';
}

/** @returns {'mph'|'m/s'} */
export function windLabel(unit) {
  return unit === 'imperial' ? 'mph' : 'm/s';
}
