import { useState, useEffect, useRef } from 'react';
import { geocodeCity, geocodeZip } from '../services/weatherApi';
import { useRecentSearches } from '../hooks/useRecentSearches';

// Postal codes always contain at least one digit — this prevents city names
// like "Mumbai" or "London" from being mistakenly treated as postal codes.
const POSTAL_REGEX = /^(?=.*\d)[A-Z0-9][A-Z0-9\s\-]{2,9}$/i;

const COUNTRIES = [
  { code: 'US', label: '🇺🇸 US' },
  { code: 'GB', label: '🇬🇧 GB' },
  { code: 'CA', label: '🇨🇦 CA' },
  { code: 'AU', label: '🇦🇺 AU' },
  { code: 'IN', label: '🇮🇳 IN' },
  { code: 'DE', label: '🇩🇪 DE' },
  { code: 'FR', label: '🇫🇷 FR' },
  { code: 'JP', label: '🇯🇵 JP' },
  { code: 'BR', label: '🇧🇷 BR' },
  { code: 'MX', label: '🇲🇽 MX' },
  { code: 'IT', label: '🇮🇹 IT' },
  { code: 'ES', label: '🇪🇸 ES' },
  { code: 'NL', label: '🇳🇱 NL' },
  { code: 'SE', label: '🇸🇪 SE' },
  { code: 'NO', label: '🇳🇴 NO' },
  { code: 'DK', label: '🇩🇰 DK' },
  { code: 'CH', label: '🇨🇭 CH' },
  { code: 'SG', label: '🇸🇬 SG' },
  { code: 'NZ', label: '🇳🇿 NZ' },
  { code: 'ZA', label: '🇿🇦 ZA' },
];

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [zipError, setZipError] = useState('');
  const debounceRef = useRef(null);
  const { recents, addRecent, clearRecents } = useRecentSearches();

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query.trim().length < 3) return;

    debounceRef.current = setTimeout(async () => {
      setZipError('');
      const trimmed = query.trim();
      const looksLikePostal = POSTAL_REGEX.test(trimmed) && !/\s{2,}/.test(trimmed) && trimmed.split(' ').length <= 2;

      try {
        if (looksLikePostal) {
          const result = await geocodeZip(trimmed, country);
          const city = { name: result.name, lat: result.lat, lon: result.lon, country: result.country, state: '' };
          setSuggestions([city]);
          setOpen(true);
        } else {
          // Try with country filter first; fall back to global search if no results
          let results = await geocodeCity(query, country);
          if (results.length === 0 && country) {
            results = await geocodeCity(query);
          }
          setSuggestions(results);
          setOpen(results.length > 0);
        }
      } catch (err) {
        setSuggestions([]);
        setOpen(false);
        if (looksLikePostal) setZipError(err.message);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, country]);

  function handleSelect(city) {
    const displayName = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
    addRecent({ name: displayName, lat: city.lat, lon: city.lon });
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setZipError('');
    onSelect(city.lat, city.lon, displayName);
  }

  function handleRecentSelect(recent) {
    addRecent(recent);
    setFocused(false);
    onSelect(recent.lat, recent.lon, recent.name);
  }

  const showRecents = focused && query.trim().length < 3 && recents.length > 0;

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-3 gap-2 shadow-lg transition-all focus-within:bg-white/20 focus-within:border-white/40">
        <svg className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>

        {/* Country selector */}
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-white/25 text-white text-xs font-semibold rounded-lg border border-white/50 px-2 py-1.5 outline-none cursor-pointer hover:bg-white/35 transition-colors shrink-0 shadow"
          aria-label="Select country for postal code search"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: '#1e293b', color: '#fff' }}>
              {c.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="City or postal code…"
          className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm min-w-0"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); setZipError(''); }}
            className="text-white/50 hover:text-white text-lg leading-none transition-colors shrink-0"
            aria-label="Clear search"
          >✕</button>
        )}
      </div>

      {zipError && (
        <p className="mt-1.5 text-xs text-red-300 px-1">{zipError}</p>
      )}

      {showRecents && (
        <div className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden text-gray-800 text-sm border border-white/40">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</span>
            <button
              onClick={clearRecents}
              className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
            >Clear</button>
          </div>
          {recents.map((recent, i) => (
            <button
              key={i}
              onClick={() => handleRecentSelect(recent)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span className="font-medium truncate">{recent.name}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length >= 3 && (
        <ul className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden text-gray-800 text-sm border border-white/40">
          {suggestions.map((city, i) => (
            <li key={i}>
              <button
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <span>
                  <span className="font-medium">{city.name}</span>
                  {city.state && <span className="text-gray-500">, {city.state}</span>}
                  <span className="text-gray-400">, {city.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
