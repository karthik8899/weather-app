import { useState, useEffect, useRef } from 'react';
import { geocodeCity, geocodeZip } from '../services/weatherApi';

const ZIP_REGEX = /^\d{5}$/;

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [zipError, setZipError] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query.trim().length < 2) return;

    debounceRef.current = setTimeout(async () => {
      setZipError('');
      try {
        if (ZIP_REGEX.test(query.trim())) {
          const result = await geocodeZip(query.trim());
          const city = { name: result.name, lat: result.lat, lon: result.lon, country: result.country, state: '' };
          setSuggestions([city]);
          setOpen(true);
        } else {
          const results = await geocodeCity(query);
          setSuggestions(results);
          setOpen(results.length > 0);
        }
      } catch (err) {
        setSuggestions([]);
        setOpen(false);
        if (ZIP_REGEX.test(query.trim())) setZipError(err.message);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelect(city) {
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setZipError('');
    onSelect(city.lat, city.lon, `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`);
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 gap-2 shadow-lg transition-all focus-within:bg-white/20 focus-within:border-white/40">
        <svg className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or ZIP code…"
          className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); setZipError(''); }}
            className="text-white/50 hover:text-white text-lg leading-none transition-colors"
            aria-label="Clear search"
          >✕</button>
        )}
      </div>

      {/* ZIP error message */}
      {zipError && (
        <p className="mt-1.5 text-xs text-red-300 px-1">{zipError}</p>
      )}

      {open && query.trim().length >= 2 && (
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
