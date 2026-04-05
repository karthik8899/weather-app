export default function HourlyForecast({ forecastData, unit }) {
  const slots = forecastData.list.slice(0, 8);
  const unitLabel = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="w-full">
      <h2 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">
        Hourly Forecast
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {slots.map((slot, i) => {
          const time = new Date(slot.dt * 1000);
          const label = i === 0 ? 'Now' : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const icon = slot.weather[0].icon;

          return (
            <div
              key={slot.dt}
              className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 min-w-[72px] text-white shadow-lg"
            >
              <p className="text-xs opacity-70 whitespace-nowrap">{label}</p>
              <img
                src={`https://openweathermap.org/img/wn/${icon}.png`}
                alt={slot.weather[0].description}
                className="w-10 h-10"
              />
              <p className="text-sm font-semibold">{Math.round(slot.main.temp)}{unitLabel}</p>
              <p className="text-xs opacity-50">Feels {Math.round(slot.main.feels_like)}{unitLabel}</p>
              <p className="text-xs opacity-60">{slot.pop > 0 ? `${Math.round(slot.pop * 100)}%🌧` : ''}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
