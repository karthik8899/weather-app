import { useState, useEffect } from 'react';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

export function useWeather(lat, lon, units = 'metric') {
  const [state, setState] = useState({ current: null, forecast: null, loading: false, error: null });

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;

    async function load() {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const [current, forecast] = await Promise.all([
          getCurrentWeather(lat, lon, units),
          getForecast(lat, lon, units),
        ]);
        if (!cancelled) setState({ current, forecast, loading: false, error: null });
      } catch (err) {
        if (!cancelled) setState({ current: null, forecast: null, loading: false, error: err.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [lat, lon, units]);

  return state;
}
