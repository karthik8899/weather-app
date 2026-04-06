export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-lg px-6 py-5 flex flex-col items-center gap-2 text-white/70 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-white/90">
        <span>8899</span>
        <span className="text-white/50 text-[10px]">™</span>
        <span className="text-white/40">·</span>
        <span>Weather</span>
      </div>

      <a
        href="mailto:karthikkumar.j2ee@gmail.com"
        className="flex items-center gap-1.5 hover:text-white transition-colors underline underline-offset-2 decoration-white/30"
        aria-label="Send email to karthikkumar.j2ee@gmail.com"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Contact Us
      </a>

      <p className="text-white/35">
        © {year} 8899™ · Data by OpenWeatherMap
      </p>
    </footer>
  );
}
