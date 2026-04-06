import { convertTemp, tempLabel } from '../utils/units';

export default function FiveDayForecast({ forecastData, unit }) {
  const days = aggregateByDay(forecastData.list);
  const tLabel = tempLabel(unit);

  return (
    <div className="w-full">
      <h2 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">
        5-Day Forecast
      </h2>
      <div className="flex flex-col gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3 text-white shadow-lg"
          >
            <p className="w-24 font-medium text-sm">{day.label}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-10 h-10"
            />
            <p className="text-xs opacity-70 flex-1 text-center capitalize hidden sm:block">{day.description}</p>
            <div className="flex gap-3 text-sm font-semibold">
              <span className="text-blue-200">{convertTemp(day.min, unit)}{tLabel}</span>
              <span>/</span>
              <span>{convertTemp(day.max, unit)}{tLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function aggregateByDay(list) {
  const map = {};

  list.forEach((slot) => {
    const date = new Date(slot.dt * 1000);
    const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (!map[key]) {
      map[key] = { date: key, temps: [], icon: slot.weather[0].icon, description: slot.weather[0].description };
    }
    map[key].temps.push(slot.main.temp);

    // Prefer daytime icon (slots around noon)
    const hour = date.getHours();
    if (hour >= 11 && hour <= 14) {
      map[key].icon = slot.weather[0].icon;
      map[key].description = slot.weather[0].description;
    }
  });

  return Object.entries(map)
    .slice(0, 5)
    .map(([key, val]) => ({
      date: key,
      label: key.split(',')[0], // weekday only
      icon: val.icon,
      description: val.description,
      min: Math.min(...val.temps),
      max: Math.max(...val.temps),
    }));
}
