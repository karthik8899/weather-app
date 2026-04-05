# 🌤 Weather App

A React + Vite weather app with current conditions, hourly forecasts, and a 5-day forecast. Uses browser geolocation with a manual city search fallback. Styled with Tailwind CSS.

## Features

- 📍 Auto-detect location via browser geolocation
- 🔍 City search with live geocoding suggestions
- 🌡 Current temperature, feels like, humidity, wind, visibility
- ⏰ Hourly forecast (next 24 hours)
- 📅 5-day forecast with daily high/low
- 🎨 Dynamic background gradient based on weather condition

## Setup

### 1. Get an API key
Sign up at [openweathermap.org](https://openweathermap.org/api) and get a free API key.

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your key:
# VITE_OPENWEATHER_API_KEY=your_key_here
```

### 3. Install and run
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)
