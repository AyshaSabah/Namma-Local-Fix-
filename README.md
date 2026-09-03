# Namma Local Fix (ನಮ್ಮ ಲೋಕಲ್ ಫಿಕ್ಸ್)

> **Report. Track. Transform.**  
> An AI-powered, hyper-local civic-technology platform empowering citizens across **Bengaluru, Karnataka, India** to report infrastructure hazards, organize neighborhood clean-up squads, track municipal resolution, and earn gamified Namma Points.

---

## 🌟 Key Highlights

- 📸 **AI Civic Hazard Detection**: Powered by **Gemini 3.7 Flash** (`@google/genai`). Citizen photos of potholes, garbage piles, or broken streetlights are instantly classified with confidence ratings, severity tags, and municipal action recommendations.
- 🗺️ **Interactive Bengaluru Live Map**: Built with **Leaflet & MapLibre GL** with 6 cartography layers (OpenStreetMap India Voyager, OSM Standard, OSM Humanitarian, Carto Light, Dark Mode, Satellite) and real-time ward filtering.
- 🧹 **Clean City Squads & Before/After Verification**: Mobilize volunteer cleanups. Citizens upload "Before" and "After" photos; our dual-image AI model validates surface clearance, estimates waste removed in kilograms, and awards bonus points.
- 🏆 **Gamification & Namma Points**: Earn points for reporting (+10 to +15 pts), supporting community petitions (+2 pts), attending cleanup drives (+50 pts), and verifying transformations (+50 pts). Climb from *Civic Explorer* to *Bengaluru Guardian*.
- 🏛️ **BBMP & Municipal Ward Portal**: Dedicated administrative triage dashboard for civic authorities to manage status lifecycles (`Reported` → `Verified` → `In Progress` → `Resolved`) and publish official municipal notes.
- ⚡ **Zero-Wait UX**: Instant HTML/SVG splash screen on cold start, smooth React 19 concurrent transitions, and real-time optimistic UI updates with automatic `localStorage` synchronization.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (v20+), Express 4.21, TypeScript via `tsx`, esbuild |
| **AI Vision** | Google GenAI SDK (`@google/genai`), Gemini 3.7 Flash |
| **Maps & GIS** | Leaflet 1.9, MapLibre GL, OpenStreetMap India, CARTO Basemaps |
| **Tooling** | Vite 6, Autoprefixer, tsx, esbuild |

---

## 🚀 Quick Start

### Prerequisites
- Node.js `20.x` or higher
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/namma-local-fix.git
cd namma-local-fix
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root based on `.env.example`:
```bash
cp .env.example .env
```
Add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the platform automatically activates an intelligent heuristic mode so all features remain testable).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── server.ts                 # Express backend, Gemini AI endpoints & OSM tile proxy
├── index.html                # HTML entry point with instant inline SVG splash screen
├── metadata.json             # AI Studio applet permissions and capabilities
├── package.json              # Dependencies and build scripts
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite 6 configuration with Tailwind CSS plugin
├── EXPLAIN.md                # Comprehensive codebase architectural guide
│
└── src/
    ├── main.tsx              # React entry point mounting into #root
    ├── App.tsx               # Main view router, keyboard listener, modals & layout
    ├── index.css             # Tailwind v4 directives and typography font classes
    ├── types.ts              # TypeScript interfaces and domain models
    │
    ├── context/
    │   └── AppContext.tsx    # Global React state, storage sync, points engine
    │
    ├── data/
    │   └── bengaluruData.ts  # Pre-seeded Bengaluru issues, wards, cleanups & badges
    │
    └── components/
        ├── Navbar.tsx             # Top header with search, notifications & profile
        ├── MobileNav.tsx          # Touch-optimized bottom navigation bar
        ├── LoadingScreen.tsx      # Branded animated boot loader with civic tips
        ├── Logo.tsx               # 3D vector rainbow pin & Bengaluru skyline artwork
        ├── HeroSection.tsx        # High-impact civic CTA & ward quick stats
        ├── QuickImpactCards.tsx   # Entry cards for core platform workflows
        ├── CategoryFilterGrid.tsx # Category filter pills with live counters
        ├── CommunityStats.tsx     # City-wide aggregate impact counter
        ├── ExploreMap.tsx         # Leaflet/MapLibre map with 6 layers & GPS
        ├── ReportIssueModal.tsx   # Photo capture, AI hazard scan & submission flow
        ├── IssueDetailModal.tsx   # Issue details, comments & petition upvoting
        ├── CleanCityDashboard.tsx # Volunteer cleanups & Before/After verification
        ├── LeaderboardView.tsx    # Citizen & ward leaderboards
        ├── PointsDashboard.tsx    # Gamification center, perks & badge showcase
        ├── CommunityFeed.tsx      # Chronological civic report feed
        ├── AdminDashboard.tsx     # BBMP municipal status progression portal
        ├── AboutView.tsx          # Mission, agency partners (BBMP, BESCOM, BWSSB)
        ├── ProfileView.tsx        # Citizen profile, bookmarks & reports history
        ├── GlobalSearchModal.tsx  # Command-palette search (Cmd/Ctrl + K)
        ├── ToastContainer.tsx     # Floating notification toast queue
        └── Gradient*.tsx          # Custom multi-stop SVG icons for mobile navigation
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check returning status and server timestamp. |
| `GET` | `/api/map/style` | Map style proxy that sanitizes style JSON and injects keys. |
| `GET` | `/api/map/osm-style` | Serves MapLibre JSON configurations for OSM raster variants. |
| `GET` | `/api/map/tile/:z/:x/:y.png` | User-Agent compliant OpenStreetMap tile caching proxy. |
| `POST` | `/api/ai/detect-issue` | Analyzes image Base64 via Gemini 3.7 Flash for category, confidence & severity. |
| `POST` | `/api/ai/verify-cleanup` | Dual-image comparison checking Before vs After waste clearance and kg estimates. |

---

## 🛡️ Civic Values & Open Data Credits

- **OpenStreetMap**: Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, [OpenStreetMap India](https://www.openstreetmap.in/), and [CARTO](https://carto.com/).
- **Municipal Alignment**: Designed in alignment with Bruhat Bengaluru Mahanagara Palike (BBMP), Bangalore Electricity Supply Company (BESCOM), and Bangalore Water Supply and Sewerage Board (BWSSB) civic domains.

---

For in-depth explanations of every code block, rationale, and algorithm, read **[EXPLAIN.md](./EXPLAIN.md)**.
