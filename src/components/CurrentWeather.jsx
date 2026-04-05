export default function CurrentWeather({ data, unit }) {
  const { name, main, weather, wind, sys, visibility } = data;
  const icon = weather[0].icon;
  const description = weather[0].description;
  const unitLabel = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="text-white text-center">
      <p className="text-lg font-medium opacity-80 mb-1 drop-shadow">
        📍 {name}, {sys.country}
      </p>

      <div className="flex items-center justify-center gap-4 my-2">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          className="w-24 h-24 drop-shadow-lg"
        />
        <div>
          <p className="text-8xl font-thin">{Math.round(main.temp)}{unitLabel}</p>
          <p className="text-xl capitalize opacity-80">{description}</p>
        </div>
      </div>

      <p className="text-base opacity-70 mb-6">
        Feels like {Math.round(main.feels_like)}{unitLabel}
      </p>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        <StatCard label="Humidity" value={`${main.humidity}%`} icon="💧" />
        <StatCard label="Wind" value={`${Math.round(wind.speed)} ${windUnit}`} icon="💨" />
        <StatCard label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} icon="👁" />
        <StatCard label="High" value={`${Math.round(main.temp_max)}${unitLabel}`} icon="🔺" />
        <StatCard label="Low" value={`${Math.round(main.temp_min)}${unitLabel}`} icon="🔻" />
        <StatCard label="Pressure" value={`${main.pressure} hPa`} icon="🌡" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center shadow-lg">
      <p className="text-xl mb-1">{icon}</p>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}
