# 🌤 Weather App — 8899™

A modern React + Vite weather app with live conditions, hourly & 5-day forecasts, Air Quality Index, international postal code search, and dynamic glassmorphism UI. Also available as a **native iOS & Android app** via Capacitor.

**Live:** https://weather8899.vercel.app  
**Repo:** https://github.com/karthik8899/weather-app

---

## Architecture

```mermaid
graph TD
    subgraph Client["Client (Web + Native)"]
        A[main.jsx] --> B[App.jsx]

        subgraph Hooks
            B --> H1[useGeolocation]
            B --> H2[useWeather]
            B --> H3[useRecentSearches]
            B --> H4[usePushNotifications]
        end

        subgraph Components
            B --> C1[SearchBar]
            B --> C2[CurrentWeather]
            B --> C3[HourlyForecast]
            B --> C4[FiveDayForecast]
            B --> C5[AirQuality]
            B --> C6[SkeletonLoader]
            B --> C7[Footer]
        end

        subgraph Services
            H2 --> S[weatherApi.js]
            C1 --> S
        end
    end

    subgraph OWM["OpenWeatherMap API"]
        S -->|GET /data/2.5/weather| OWM1[Current Weather]
        S -->|GET /data/2.5/forecast| OWM2[5-Day Forecast]
        S -->|GET /geo/1.0/direct| OWM3[City Geocoding]
        S -->|GET /geo/1.0/zip| OWM4[Postal Code Geocoding]
        S -->|GET /air_pollution| OWM5[Air Quality AQI]
    end

    subgraph Storage["Device Storage"]
        H3 -->|read/write| LS[localStorage]
        H1 -->|native GPS| CAP_GEO[Capacitor Geolocation]
        H1 -->|web fallback| GEO[Browser Geolocation API]
        H4 -->|register token| APNS[APNS / FCM]
    end

    subgraph Native["Native Shell — Capacitor"]
        CAP_GEO
        APNS
        SPLASH[Splash Screen]
    end

    subgraph Deploy["Deployment"]
        WEB[Vercel — Web] 
        IOS[iOS — Xcode]
        AND[Android — Android Studio]
    end
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant SearchBar
    participant weatherApi
    participant OWM as OpenWeatherMap
    participant App
    participant UI as Weather Components

    User->>SearchBar: Types city or postal code + selects country
    SearchBar->>weatherApi: geocodeCity() or geocodeZip(zip, country)
    weatherApi->>OWM: GET /geo/1.0/direct or /geo/1.0/zip
    OWM-->>weatherApi: { lat, lon, name }
    weatherApi-->>SearchBar: Location results
    SearchBar->>App: onSelect(lat, lon, name)
    App->>weatherApi: getCurrentWeather + getForecast + getAirPollution
    weatherApi->>OWM: Parallel API calls (Promise.allSettled)
    OWM-->>weatherApi: Weather data
    weatherApi-->>App: current, forecast, airQuality
    App->>UI: Render CurrentWeather, HourlyForecast, FiveDayForecast, AirQuality
```

### Mobile (Capacitor) Flow

```mermaid
sequenceDiagram
    participant Device
    participant Capacitor
    participant App as React App
    participant APNS as APNS/FCM

    Device->>Capacitor: App launch
    Capacitor->>App: Load web assets from dist/
    App->>Capacitor: Geolocation.getCurrentPosition()
    Capacitor->>Device: Native GPS request
    Device-->>Capacitor: { lat, lon }
    Capacitor-->>App: coords
    App->>Capacitor: PushNotifications.register()
    Capacitor->>APNS: Register device
    APNS-->>Capacitor: Device push token
    Capacitor-->>App: token (log / send to backend)
```

---

## Features

| Feature | Details |
|---|---|
| 📍 Auto-location | Native GPS (Capacitor) on mobile, Browser API on web |
| 🔍 Smart search | City name or international postal code + country selector |
| 🌡 Current weather | Temp, feels like, humidity, wind bearing, visibility |
| 🌅 Sunrise / Sunset | Formatted local times on the current weather card |
| 💨 Wind direction | Cardinal direction (N, NE, SW…) from wind degrees |
| ⏰ Hourly forecast | Next 24 hours with feels-like line |
| 📅 5-day forecast | Daily high/low per day |
| 🌿 Air Quality | AQI badge (1–5), PM2.5, PM10, NO₂, O₃ chips |
| 🕑 Recent searches | Last 5 searches persisted in localStorage |
| 🌡 Unit toggle | °C / °F switch in header |
| 🎨 Dynamic gradients | Background changes per weather condition |
| 💎 Glassmorphism | Consistent `bg-white/10 backdrop-blur-md` card styling |
| 🌍 International | 20-country postal code support (US, GB, CA, AU, IN, DE, FR, JP…) |
| 📱 Native mobile | iOS + Android via Capacitor with custom 8899™ icon & splash |
| 🔔 Push notifications | Device push token registration (APNS / FCM) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/api) |
| Mobile | [Capacitor](https://capacitorjs.com/) (iOS + Android) |
| Testing | [Playwright](https://playwright.dev/) (E2E) |
| Web Deployment | [Vercel](https://vercel.com/) |

---

## Project Structure

```
src/
├── App.jsx                   # Root: state, routing, gradient logic
├── components/
│   ├── SearchBar.jsx         # City/postal search with country selector
│   ├── CurrentWeather.jsx    # Main weather card (temp, stats, sunrise/sunset)
│   ├── HourlyForecast.jsx    # Next 24h horizontal scroll
│   ├── FiveDayForecast.jsx   # Daily high/low rows
│   ├── AirQuality.jsx        # AQI badge + pollutant chips
│   ├── SkeletonLoader.jsx    # Animate-pulse loading placeholders
│   ├── Footer.jsx            # 8899™ brand + Contact Us + copyright
│   └── Logo.jsx              # 8899™ SVG wordmark
├── hooks/
│   ├── useWeather.js         # Fetches weather + AQI, cancellation guard
│   ├── useGeolocation.js     # Native GPS (Capacitor) with browser fallback
│   ├── useRecentSearches.js  # localStorage recent searches (max 5)
│   └── usePushNotifications.js  # APNS/FCM token registration
└── services/
    └── weatherApi.js         # All OWM API calls (weather, forecast, geo, AQI)

assets/
├── icon.png                  # 1024×1024 app icon (8899™ branded)
└── splash.png                # 2732×2732 splash screen

ios/                          # Native iOS project (Xcode)
android/                      # Native Android project (Android Studio)

tests/
├── search.spec.js            # City search, ZIP, invalid ZIP, recents
├── ui.spec.js                # Unit toggle, skeleton, city pill
└── weather-display.spec.js   # Sunrise/sunset, wind, feels-like, AQI
```

---

## Setup

### 1. Get an API key
Sign up at [openweathermap.org](https://openweathermap.org/api) and create a free API key.

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env:
# VITE_OPENWEATHER_API_KEY=your_key_here
```

### 3. Install and run (web)
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run tests
```bash
npm run test:e2e
```

---

## 📱 Mobile App (Capacitor)

### Prerequisites
- **iOS:** Xcode installed (Mac only)
- **Android:** Android Studio installed

### Run on iOS
```bash
npm run cap:ios
# This runs: npm run build → npx cap sync ios → npx cap open ios
```
Then in Xcode:
1. Select a simulator or physical device from the device dropdown
2. Press ▶️ **Run**

### Run on Android
```bash
npm run cap:android
# This runs: npm run build → npx cap sync android → npx cap open android
```
Then in Android Studio, click ▶️ **Run**.

### Sync web changes to native (without reopening IDE)
```bash
npm run cap:sync
# Builds the web app and syncs to both iOS and Android
```

### Mobile scripts reference
| Script | Description |
|---|---|
| `npm run cap:ios` | Build + sync + open Xcode |
| `npm run cap:android` | Build + sync + open Android Studio |
| `npm run cap:sync` | Build + sync both platforms |
| `npm run cap:copy` | Copy web assets only (no plugin update) |

### Native features on mobile
| Feature | Native implementation |
|---|---|
| 📍 GPS | `@capacitor/geolocation` — high-accuracy native GPS |
| 🔔 Push notifications | `@capacitor/push-notifications` — APNS (iOS) / FCM (Android) |
| 🖼 Splash screen | `@capacitor/splash-screen` — 8899™ branded, 2s display |
| 🏷 App icon | 8899™ wordmark — all sizes generated for iOS + Android |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OPENWEATHER_API_KEY` | ✅ | Your OpenWeatherMap API key |

---

*8899™ — Built with ❤️ · [Contact Us](mailto:karthikkumar.j2ee@gmail.com)*


A modern React + Vite weather app with live conditions, hourly & 5-day forecasts, Air Quality Index, international postal code search, and dynamic glassmorphism UI.

**Live:** https://weather8899.vercel.app  
**Repo:** https://github.com/karthik8899/weather-app

---

## Architecture

```mermaid
graph TD
    subgraph Browser
        A[main.jsx] --> B[App.jsx]

        subgraph Hooks
            B --> H1[useGeolocation]
            B --> H2[useWeather]
            B --> H3[useRecentSearches]
        end

        subgraph Components
            B --> C1[SearchBar]
            B --> C2[CurrentWeather]
            B --> C3[HourlyForecast]
            B --> C4[FiveDayForecast]
            B --> C5[AirQuality]
            B --> C6[SkeletonLoader]
            B --> C7[Footer]
        end

        subgraph Services
            H2 --> S[weatherApi.js]
            C1 --> S
        end
    end

    subgraph OpenWeatherMap API
        S -->|GET /data/2.5/weather| OWM1[Current Weather]
        S -->|GET /data/2.5/forecast| OWM2[5-Day Forecast]
        S -->|GET /geo/1.0/direct| OWM3[City Geocoding]
        S -->|GET /geo/1.0/zip| OWM4[Postal Code Geocoding]
        S -->|GET /air_pollution| OWM5[Air Quality AQI]
    end

    subgraph Storage
        H3 -->|read/write| LS[localStorage]
        H1 -->|read| GEO[Browser Geolocation API]
    end
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant SearchBar
    participant weatherApi
    participant OWM as OpenWeatherMap
    participant App
    participant UI as Weather Components

    User->>SearchBar: Types city or postal code
    SearchBar->>weatherApi: geocodeCity() or geocodeZip(zip, country)
    weatherApi->>OWM: GET /geo/1.0/direct or /geo/1.0/zip
    OWM-->>weatherApi: { lat, lon, name }
    weatherApi-->>SearchBar: Location results
    SearchBar->>App: onSelect(lat, lon, name)
    App->>weatherApi: getCurrentWeather + getForecast + getAirPollution
    weatherApi->>OWM: Parallel API calls (Promise.allSettled)
    OWM-->>weatherApi: Weather data
    weatherApi-->>App: current, forecast, airQuality
    App->>UI: Render CurrentWeather, HourlyForecast, FiveDayForecast, AirQuality
```

---

## Features

| Feature | Details |
|---|---|
| 📍 Auto-location | Browser Geolocation API with graceful fallback |
| 🔍 Smart search | City name or international postal code + country selector |
| 🌡 Current weather | Temp, feels like, humidity, wind bearing, visibility, UV |
| 🌅 Sunrise / Sunset | Formatted local times on the current weather card |
| 💨 Wind direction | Cardinal direction (N, NE, SW…) from wind degrees |
| ⏰ Hourly forecast | Next 24 hours with feels-like line |
| 📅 5-day forecast | Daily high/low per day |
| 🌿 Air Quality | AQI badge (1–5), PM2.5, PM10, NO₂, O₃ chips |
| 🕑 Recent searches | Last 5 searches persisted in localStorage |
| 🌡 Unit toggle | °C / °F switch in header |
| 🎨 Dynamic gradients | Background changes per weather condition |
| 💎 Glassmorphism | Consistent `bg-white/10 backdrop-blur-md` card styling |
| 🌍 International | 20-country postal code support (US, GB, CA, AU, IN, DE, FR, JP…) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) |
| Weather Data | [OpenWeatherMap API](https://openweathermap.org/api) |
| Testing | [Playwright](https://playwright.dev/) (E2E) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Project Structure

```
src/
├── App.jsx                   # Root: state, routing, gradient logic
├── components/
│   ├── SearchBar.jsx         # City/postal search with country selector
│   ├── CurrentWeather.jsx    # Main weather card (temp, stats, sunrise/sunset)
│   ├── HourlyForecast.jsx    # Next 24h horizontal scroll
│   ├── FiveDayForecast.jsx   # Daily high/low rows
│   ├── AirQuality.jsx        # AQI badge + pollutant chips
│   ├── SkeletonLoader.jsx    # Animate-pulse loading placeholders
│   ├── Footer.jsx            # 8899™ brand + Contact Us + copyright
│   └── Logo.jsx              # 8899™ SVG wordmark
├── hooks/
│   ├── useWeather.js         # Fetches weather + AQI, cancellation guard
│   ├── useGeolocation.js     # Browser geolocation with error handling
│   └── useRecentSearches.js  # localStorage recent searches (max 5)
└── services/
    └── weatherApi.js         # All OWM API calls (weather, forecast, geo, AQI)

tests/
├── search.spec.js            # City search, ZIP, invalid ZIP, recents
├── ui.spec.js                # Unit toggle, skeleton, city pill
└── weather-display.spec.js   # Sunrise/sunset, wind, feels-like, AQI
```

---

## Setup

### 1. Get an API key
Sign up at [openweathermap.org](https://openweathermap.org/api) and create a free API key.

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env:
# VITE_OPENWEATHER_API_KEY=your_key_here
```

### 3. Install and run
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run tests
```bash
npm run test:e2e
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OPENWEATHER_API_KEY` | ✅ | Your OpenWeatherMap API key |

---

*8899™ — Built with ❤️ · [Contact Us](mailto:karthikkumar.j2ee@gmail.com)*
