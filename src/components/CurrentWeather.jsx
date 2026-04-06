import { convertTemp, convertWind, tempLabel, windLabel } from '../utils/units';

const bearings = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function CurrentWeather({ data, unit }) {
  const { name, main, weather, wind, sys, visibility } = data;
  const icon = weather[0].icon;
  const description = weather[0].description;
  const tLabel = tempLabel(unit);
  const wLabel = windLabel(unit);
  const bearing = bearings[Math.round(wind.deg / 45) % 8];

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
          <p className="text-8xl font-thin">{convertTemp(main.temp, unit)}{tLabel}</p>
          <p className="text-xl capitalize opacity-80">{description}</p>
        </div>
      </div>

      <p className="text-base opacity-70 mb-6">
        Feels like {convertTemp(main.feels_like, unit)}{tLabel}
      </p>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        <StatCard label="Humidity" value={`${main.humidity}%`} icon="💧" />
        <StatCard label="Wind" value={`${convertWind(wind.speed, unit)} ${wLabel} ${bearing}`} icon="💨" />
        <StatCard label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} icon="👁" />
        <StatCard label="Pressure" value={`${main.pressure} hPa`} icon="🌡" />
        <StatCard label="High" value={`${convertTemp(main.temp_max, unit)}${tLabel}`} icon="🔺" />
        <StatCard label="Low" value={`${convertTemp(main.temp_min, unit)}${tLabel}`} icon="🔻" />
        <StatCard label="Sunrise" value={formatTime(sys.sunrise)} icon="🌅" />
        <StatCard label="Sunset" value={formatTime(sys.sunset)} icon="🌇" />
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
