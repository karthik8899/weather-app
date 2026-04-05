const AQI_COLORS = {
  1: 'text-green-300 bg-green-500/20',
  2: 'text-yellow-300 bg-yellow-500/20',
  3: 'text-orange-300 bg-orange-500/20',
  4: 'text-red-300 bg-red-500/20',
  5: 'text-purple-300 bg-purple-500/20',
};

const AQI_LABELS = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };
const AQI_WIDTHS = { 1: 'w-1/5', 2: 'w-2/5', 3: 'w-3/5', 4: 'w-4/5', 5: 'w-full' };

export default function AirQuality({ data }) {
  const aqi = data.list[0].main.aqi;
  const { pm2_5, pm10, no2, o3 } = data.list[0].components;
  const colorClass = AQI_COLORS[aqi];
  const widthClass = AQI_WIDTHS[aqi];

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-lg p-4 text-white">
      <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">Air Quality</h2>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colorClass}`}>
          {AQI_LABELS[aqi]}
        </span>
        <span className="text-xs opacity-60">AQI {aqi}/5</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <div className={`h-2 rounded-full ${colorClass.split(' ')[1]} ${widthClass} transition-all`} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'PM2.5', value: pm2_5 },
          { label: 'PM10', value: pm10 },
          { label: 'NO₂', value: no2 },
          { label: 'O₃', value: o3 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 rounded-xl p-2 text-center">
            <p className="text-xs font-semibold">{Math.round(value)}</p>
            <p className="text-xs opacity-60">µg/m³</p>
            <p className="text-xs opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
