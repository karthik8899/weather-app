const BASE_URL = 'https://api.openweathermap.org';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getCurrentWeather(lat, lon, units = 'metric') {
  const res = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to fetch current weather');
  return res.json();
}

export async function getForecast(lat, lon, units = 'metric') {
  const res = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to fetch forecast');
  return res.json();
}

export async function geocodeCity(query) {
  const res = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to geocode city');
  return res.json();
}

/** Resolves a US 5-digit zip code to { name, lat, lon, country, zip } */
export async function geocodeZip(zip) {
  const res = await fetch(
    `${BASE_URL}/geo/1.0/zip?zip=${encodeURIComponent(zip)},US&appid=${API_KEY}`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`No location found for ZIP code "${zip}"`);
    throw new Error('Failed to look up ZIP code');
  }
  return res.json();
}

export async function getAirPollution(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error('Failed to fetch air quality');
  return res.json();
}
