export default function Logo() {
  return (
    <a
      href="/"
      aria-label="8899 Weather — Home"
      className="shrink-0 select-none"
    >
      <svg
        width="120"
        height="44"
        viewBox="0 0 120 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />   {/* indigo-400 */}
            <stop offset="50%" stopColor="#c084fc" />  {/* purple-400 */}
            <stop offset="100%" stopColor="#f0abfc" /> {/* fuchsia-300 */}
          </linearGradient>
        </defs>

        {/* Left bracket */}
        <path
          d="M10 7 L4 7 L4 37 L10 37"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 8899 wordmark */}
        <text
          x="60"
          y="31"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          8899
        </text>

        {/* Right bracket */}
        <path
          d="M110 7 L116 7 L116 37 L110 37"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gradient underline */}
        <rect x="18" y="38" width="84" height="2.5" rx="1.25" fill="url(#logoGrad)" />

        {/* ™ mark */}
        <text
          x="118"
          y="11"
          fill="url(#logoGrad)"
          fontSize="8"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
        >
          ™
        </text>
      </svg>
    </a>
  );
}
