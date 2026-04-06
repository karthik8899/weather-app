import { useState, useEffect } from 'react';

// Use Capacitor native geolocation when available, fall back to browser API
async function getNativePosition() {
  try {
    const { Geolocation } = await import('@capacitor/geolocation');
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    return null;
  }
}

export function useGeolocation() {
  const [state, setState] = useState({ lat: null, lon: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function fetchPosition() {
      // Try Capacitor native GPS first
      const native = await getNativePosition();
      if (native && !cancelled) {
        setState({ lat: native.latitude, lon: native.longitude, loading: false, error: null });
        return;
      }

      // Fall back to browser geolocation (web / Vercel)
      if (!navigator.geolocation) {
        if (!cancelled) setState({ lat: null, lon: null, loading: false, error: 'Geolocation not supported' });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!cancelled) setState({ lat: pos.coords.latitude, lon: pos.coords.longitude, loading: false, error: null });
        },
        (err) => {
          if (!cancelled) setState({ lat: null, lon: null, loading: false, error: err.message });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    fetchPosition();
    return () => { cancelled = true; };
  }, []);

  return state;
}
