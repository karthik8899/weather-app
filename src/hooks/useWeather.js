import { useState, useEffect } from 'react';
import { getCurrentWeather, getForecast, getAirPollution } from '../services/weatherApi';

export function useWeather(lat, lon) {
  const [state, setState] = useState({ current: null, forecast: null, airQuality: null, loading: false, error: null });

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;

    async function load() {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const [currentResult, forecastResult, aqResult] = await Promise.allSettled([
          getCurrentWeather(lat, lon),
          getForecast(lat, lon),
          getAirPollution(lat, lon),
        ]);
        if (currentResult.status === 'rejected') throw new Error(currentResult.reason.message);
        if (forecastResult.status === 'rejected') throw new Error(forecastResult.reason.message);
        const airQuality = aqResult.status === 'fulfilled' ? aqResult.value : null;
        if (!cancelled) setState({ current: currentResult.value, forecast: forecastResult.value, airQuality, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ current: null, forecast: null, airQuality: null, loading: false, error: err.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [lat, lon]);

  return state;
}
