import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { usePushNotifications } from './hooks/usePushNotifications';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import FiveDayForecast from './components/FiveDayForecast';
import AirQuality from './components/AirQuality';
import SkeletonLoader from './components/SkeletonLoader';
import Footer from './components/Footer';

export default function App() {
  const geo = useGeolocation();
  usePushNotifications(); // registers for push on native, no-op on web
  const [override, setOverride] = useState(null); // { lat, lon, name }
  const [unit, setUnit] = useState('metric'); // 'metric' | 'imperial'

  const lat = override?.lat ?? geo.lat;
  const lon = override?.lon ?? geo.lon;

  const { current, forecast, airQuality, loading, error } = useWeather(lat, lon);

  function handleCitySelect(lat, lon, name) {
    setOverride({ lat, lon, name });
  }

  const bg = current ? getBg(current.weather[0].main) : 'from-sky-500 via-indigo-600 to-purple-800';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} transition-all duration-700`}>
      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-white text-2xl font-bold tracking-tight drop-shadow">🌤 Weather</h1>
            <div className="flex items-center gap-3">
              {/* °C / °F toggle */}
              <button
                onClick={() => setUnit(u => u === 'metric' ? 'imperial' : 'metric')}
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-sm font-semibold rounded-full px-4 py-1.5 transition-all duration-200 shadow"
                aria-label="Toggle temperature unit"
              >
                <span className={unit === 'metric' ? 'opacity-100' : 'opacity-40'}>°C</span>
                <span className="opacity-40 mx-0.5">/</span>
                <span className={unit === 'imperial' ? 'opacity-100' : 'opacity-40'}>°F</span>
              </button>
            </div>
          </div>
          <SearchBar onSelect={handleCitySelect} />

          {/* Selected city pill */}
          {override && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs shadow">
              <span>📍</span>
              <span className="font-medium truncate max-w-[220px]">{override.name}</span>
              <button
                onClick={() => setOverride(null)}
                className="text-white/50 hover:text-white transition-colors leading-none ml-1"
                aria-label="Clear selected location"
              >✕</button>
            </div>
          )}

          {geo.error && !override && (
            <p className="text-yellow-200 text-xs text-center bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/20 rounded-xl px-3 py-2">
              📍 Location access denied — search for a city or ZIP code above
            </p>
          )}
        </div>

        {/* Skeleton loading */}
        {(loading || geo.loading) && <SkeletonLoader />}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-white rounded-2xl p-5 text-center shadow-xl">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm opacity-70 mt-1">{error}</p>
            {!import.meta.env.VITE_OPENWEATHER_API_KEY && (
              <p className="text-xs mt-3 bg-black/20 rounded-lg p-2">
                Make sure to add <code>VITE_OPENWEATHER_API_KEY</code> to your <code>.env</code> file.
              </p>
            )}
          </div>
        )}

        {/* No location yet */}
        {!loading && !geo.loading && !lat && !error && (
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-lg p-10 text-white text-center">
            <p className="text-5xl mb-4">🌍</p>
            <p className="font-semibold text-lg mb-1">Welcome to Weather</p>
            <p className="text-sm opacity-60">Allow location access or search for a city / ZIP code to get started.</p>
          </div>
        )}

        {/* Weather content */}
        {current && !loading && (
          <>
            <CurrentWeather data={current} unit={unit} />
            {airQuality && <AirQuality data={airQuality} />}
            {forecast && <HourlyForecast forecastData={forecast} unit={unit} />}
            {forecast && <FiveDayForecast forecastData={forecast} unit={unit} />}
          </>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function getBg(condition) {
  const map = {
    Clear:        'from-amber-400 via-orange-500 to-sky-500',
    Clouds:       'from-blue-300 via-violet-500 to-indigo-700',
    Rain:         'from-blue-600 via-blue-800 to-slate-900',
    Drizzle:      'from-cyan-500 via-blue-600 to-slate-800',
    Thunderstorm: 'from-gray-700 via-purple-900 to-gray-950',
    Snow:         'from-sky-200 via-blue-400 to-indigo-600',
    Mist:         'from-teal-400 via-cyan-500 to-blue-700',
    Fog:          'from-teal-400 via-cyan-500 to-blue-700',
    Haze:         'from-amber-500 via-orange-500 to-red-600',
  };
  return map[condition] || 'from-sky-500 via-indigo-600 to-purple-800';
}
