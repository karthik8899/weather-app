import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({ lat: null, lon: null, loading: true, error: null });

  useEffect(() => {
    if (!navigator.geolocation) {
      const timer = setTimeout(() => {
        setState({ lat: null, lon: null, loading: false, error: 'Geolocation not supported' });
      }, 0);
      return () => clearTimeout(timer);
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({ lat: null, lon: null, loading: false, error: err.message });
      }
    );
  }, []);

  return state;
}
