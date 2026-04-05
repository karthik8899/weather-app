const pulse = 'animate-pulse bg-white/20 rounded-2xl';

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-6">

      {/* CurrentWeather skeleton */}
      <div className="text-center flex flex-col items-center gap-4">
        {/* City name */}
        <div className={`${pulse} h-5 w-32`} />
        {/* Icon + temp row */}
        <div className="flex items-center justify-center gap-6">
          <div className={`${pulse} w-20 h-20 rounded-full`} />
          <div className="flex flex-col gap-2 items-start">
            <div className={`${pulse} h-16 w-36`} />
            <div className={`${pulse} h-4 w-24`} />
          </div>
        </div>
        {/* Feels like */}
        <div className={`${pulse} h-4 w-28`} />
        {/* Stat grid */}
        <div className="grid grid-cols-3 gap-3 max-w-sm w-full mx-auto mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${pulse} h-20`} />
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div className="w-full">
        <div className={`${pulse} h-4 w-32 mb-3`} />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${pulse} min-w-[72px] h-24 shrink-0`} />
          ))}
        </div>
      </div>

      {/* 5-day skeleton */}
      <div className="w-full">
        <div className={`${pulse} h-4 w-28 mb-3`} />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${pulse} h-14 w-full`} />
          ))}
        </div>
      </div>

    </div>
  );
}
