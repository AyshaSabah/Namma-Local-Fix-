# Namma Local Fix — Deep Architectural & Codebase Guide (EXPLAIN.md)

Welcome to the comprehensive, line-by-line and component-by-component architectural documentation for **Namma Local Fix** (*"Report. Track. Transform."*).

This document explains **WHAT** every file and subsystem does, **WHY** it was built that way, and **HOW** the code functions under the hood.

---

## Table of Contents
1. [Project Overview & Core Mission](#1-project-overview--core-mission)
2. [High-Level Architecture & Data Flow](#2-high-level-architecture--data-flow)
3. [Technology Stack & Architectural Rationale](#3-technology-stack--architectural-rationale)
4. [File-by-File Breakdown: Root & Configuration](#4-file-by-file-breakdown-root--configuration)
   - `server.ts`
   - `index.html`
   - `metadata.json`
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `.env.example`
5. [File-by-File Breakdown: Core Application Logic](#5-file-by-file-breakdown-core-application-logic)
   - `src/main.tsx`
   - `src/App.tsx`
   - `src/index.css`
   - `src/types.ts`
   - `src/context/AppContext.tsx`
   - `src/data/bengaluruData.ts`
6. [File-by-File Breakdown: UI Components](#6-file-by-file-breakdown-ui-components)
   - `Navbar.tsx` & `MobileNav.tsx`
   - `LoadingScreen.tsx` & `Logo.tsx`
   - `HeroSection.tsx` & `QuickImpactCards.tsx`
   - `CategoryFilterGrid.tsx` & `CommunityStats.tsx`
   - `ExploreMap.tsx`
   - `ReportIssueModal.tsx`
   - `IssueDetailModal.tsx`
   - `CleanCityDashboard.tsx`
   - `LeaderboardView.tsx`
   - `PointsDashboard.tsx`
   - `CommunityFeed.tsx`
   - `AdminDashboard.tsx`
   - `AboutView.tsx` & `ProfileView.tsx`
   - `GlobalSearchModal.tsx` & `ToastContainer.tsx`
   - Gradient Vector Icons (`Gradient*.tsx`)
7. [Step-by-Step Functional Workflows](#7-step-by-step-functional-workflows)
   - Flow A: Cold Boot & Splash Animation
   - Flow B: Citizen Issue Reporting with Gemini Multimodal AI
   - Flow C: Dual-Engine Mapping & Tile Proxying
   - Flow D: Clean City Before/After AI Transformation Verification
   - Flow E: Gamification, Point Calculations & Level Progressions
   - Flow F: Municipal BBMP Admin Triage
8. [Security, Resilience & Performance Safeguards](#8-security-resilience--performance-safeguards)

---

## 1. Project Overview & Core Mission

**Namma Local Fix** is a civic-technology platform built specifically for the city of **Bengaluru (Bangalore), Karnataka, India**. It addresses urban civic issues such as potholes, hazardous open drains, uncollected garbage dumps, broken streetlights, water pipeline leaks, and traffic signal failures.

### The Problem in Bengaluru
- Citizens encounter civic issues daily across BBMP (Bruhat Bengaluru Mahanagara Palike) wards, BESCOM (electricity), and BWSSB (water supply).
- Traditional complaint avenues are bureaucratic, lack visual tracking, and offer zero feedback or community solidarity.
- Clean-up volunteer groups lack a centralized platform to mobilize squads and prove verified civic impact.

### The Solution: "SEE → REPORT → VERIFY → FIX → EARN"
1. **See**: A citizen spots an issue anywhere in Bengaluru.
2. **Report**: The citizen takes or uploads a photo. The app uses GPS or manual pin drops to tag exact ward coordinates.
3. **Verify**: Multimodal Gemini 3.7 Flash analyzes the photo, classifies the category, assigns severity, and suggests municipal action.
4. **Fix**: The issue enters the community map and municipal queue. Clean City squads mobilize for volunteer cleanups or BBMP civic teams resolve the ticket.
5. **Earn**: Citizens receive **Namma Points**, climb community tiers (from *Civic Explorer* to *Bengaluru Guardian*), earn digital badges, and climb the ward leaderboard.

---

## 2. High-Level Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                  BROWSER CLIENT                                   |
|                                                                                   |
|   +-------------------+     +---------------------+     +---------------------+   |
|   |  React 19 Views   | <-> |  AppContext Store   | <-> | LocalStorage Cache  |   |
|   | (ExploreMap, Feed)|     | (Issues, User, Pts) |     |  (Offline Fallback) |   |
|   +-------------------+     +---------------------+     +---------------------+   |
|             |                          |                                          |
|             | React State Events       | REST API Requests                        |
|             v                          v                                          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         EXPRESS BACKEND SERVER (Port 3000)                        |
|                                                                                   |
|  +--------------------+   +---------------------+   +--------------------------+  |
|  |   Vite Middleware  |   | OpenStreetMap Proxy |   |    Gemini AI Pipeline    |  |
|  |  (Dev SPA Serving) |   |  (OSM User-Agent)   |   |   (@google/genai SDK)    |  |
|  +--------------------+   +---------------------+   +--------------------------+  |
|                                      |                           |                |
+-----------------------------------------------------------------------------------+
                                       |                           |
                 +---------------------+                           +----------------+
                 |                                                                  |
                 v                                                                  v
+-----------------------------------+             +----------------------------------+
|    OpenStreetMap / CARTO Tiles     |             |       Google Gemini Model        |
|  (Retina Cartography & GeoJSON)   |             |        (gemini-3.7-flash)        |
+-----------------------------------+             +----------------------------------+
```

### Data Flow Cycles
1. **User Interaction Cycle**: UI Components trigger actions in `AppContext.tsx` (`addNewIssue`, `supportIssue`, `joinCleanupDrive`, `submitCleanupProof`).
2. **State Synchronization Cycle**: Every state mutation is instantly updated in React memory, propagated down through React hooks, and serialized into `localStorage` (`nlf_issues`, `nlf_cleanups`, `nlf_user`, `nlf_stats`).
3. **AI Vision Cycle**: Photo inputs (base64) are sent via `POST /api/ai/detect-issue` or `POST /api/ai/verify-cleanup` to the Node.js Express server, which prompts the Gemini API using system instructions tuned for Bengaluru municipal infrastructure.
4. **Map Streaming Cycle**: Map views (`ExploreMap.tsx`) request raster tiles from either CARTO Voyager, OSM Standard, or the local tile proxy `/api/map/tile/:z/:x/:y.png` to adhere to OpenStreetMap attribution and rate limits.

---

## 3. Technology Stack & Architectural Rationale

| Layer | Technology | Why Chosen |
|---|---|---|
| **Runtime** | Node.js (v20+) | Native async I/O, fast JSON parsing for images, universal TypeScript support via `tsx`. |
| **Server Framework** | Express 4.21 | Lightweight, reliable HTTP routing, robust middleware pipeline, streaming file support. |
| **Frontend Framework** | React 19 + TypeScript | Concurrent rendering, type safety across complex civic data models, seamless state hooks. |
| **Build & Tooling** | Vite 6 + esbuild | Instant cold starts, sub-second HMR in development, single-bundle CommonJS output via `esbuild`. |
| **Styling** | Tailwind CSS v4 | Utility-first styling with `@import "tailwindcss";`, zero unused CSS in production, custom gradients. |
| **Mapping Engine** | Leaflet 1.9 + MapLibre GL | Dual-engine capability: Leaflet for resilient, lightweight DOM pins, and MapLibre GL for vector styling. |
| **AI Vision Engine** | Google GenAI SDK (`@google/genai`) | Official modern SDK for Gemini models (`gemini-3.7-flash`) with structured JSON schema outputs. |
| **Icons & Micro-animations**| `lucide-react` + `canvas-confetti` | Accessible vector icons and celebratory confetti triggers on point milestones and submissions. |

---

## 4. File-by-File Breakdown: Root & Configuration

### `server.ts`
- **What it does**: The central server entry point. Sets up an Express application running on port `3000` (`0.0.0.0`), attaches body parsers (25MB limit to allow high-resolution phone photos), configures Vite middleware in development, handles static fallback in production, and provides backend API endpoints.
- **Why it was built this way**:
  - *Port 3000 hardcoding*: The deployment container requires port 3000 for public reverse proxy routing.
  - *API Secret Isolation*: The `GEMINI_API_KEY` is kept exclusively on the server side. It is never prefixed with `VITE_` or leaked to the client browser.
  - *Tile Proxying*: OpenStreetMap's Tile Usage Policy prohibits generic browser user-agents from hammering their tile servers. The server proxy attaches a compliant `User-Agent: NammaLocalFix/1.0`.
- **How the Code Works**:
  - `getGenAI()`: Uses a lazy-initialization pattern. If `process.env.GEMINI_API_KEY` is missing or the client has not made an AI request yet, no crash occurs on boot.
  - `GET /api/health`: Returns server status, timestamp, and city verification.
  - `GET /api/map/style`: Proxies and sanitizes MapTiler and OSM style configurations. Fixes missing API keys and removes broken vector sources that trigger MapLibre fetch errors.
  - `GET /api/map/osm-style`: Serves pre-configured MapLibre style JSON with standard, voyager, and light raster layers.
  - `GET /api/map/tile/:z/:x/:y.png`: Fetches OSM tiles across subdomains (`a`, `b`, `c`) with round-robin hashing and returns PNG buffers with a 7-day browser cache header (`Cache-Control: public, max-age=604800`).
  - `POST /api/ai/detect-issue`: Receives `imageBase64`. Strips data URI prefixes (`data:image/jpeg;base64,`). Prompts `gemini-3.7-flash` with strict JSON schemas to classify issues into one of 11 valid Bengaluru categories, compute confidence (70-99%), determine severity, and return action steps. If no API key is present, falls back gracefully to a heuristic engine so testing is uninterrupted.
  - `POST /api/ai/verify-cleanup`: Multimodal dual-image analysis. Receives `beforeImage` and `afterImage`. Compares ground clearance, verifies location scenery, estimates kilograms of waste removed, and awards 50 points.
  - `startServer()`: Checks `process.env.NODE_ENV !== 'production'`. If dev, mounts `createViteServer({ server: { middlewareMode: true }, appType: 'spa' })`. If production, serves static assets from `dist/`.

### `index.html`
- **What it does**: Primary HTML5 entry point.
- **Why it was built this way**:
  - *Zero White-Screen Cold Starts*: Contains an inline SVG splash screen within `<div id="root">`. Even before Vite or React scripts finish loading, the user sees the animated gradient 3D pin, Bengaluru skyline, and loading bar.
  - *Typography*: Pre-connects to Google Fonts and loads `Outfit` (headings), `Plus Jakarta Sans` (body UI), `Vast Shadow` & `Niconne` (branding accents), and `JetBrains Mono` (ticket codes).
  - *CDN CSS*: Loads Leaflet and MapLibre GL stylesheets.

### `metadata.json`
- **What it does**: Configures AI Studio platform metadata, container permissions (`camera`, `geolocation`), and platform capability flags (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).
- **Why it was built this way**: Informs the container sandbox to permit GPS location tracking and webcam/camera uploads inside the embedded iframe.

### `package.json`
- **What it does**: Defines application metadata, dependency trees, and scripts:
  - `"dev": "tsx server.ts"`: Boots the Express server with TypeScript execution.
  - `"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"`: Creates both client static assets (`dist/`) and a self-contained CommonJS backend executable.
  - `"start": "node dist/server.cjs"`: Container deployment execution.

### `tsconfig.json` & `vite.config.ts`
- **What it does**: Configures TypeScript compiler settings (target ES2020, strict type-checking, JSX transform) and Vite plugins (`@vitejs/plugin-react` and `@tailwindcss/vite`).

---

## 5. File-by-File Breakdown: Core Application Logic

### `src/types.ts`
- **What it does**: The central type contract for the entire application.
- **Why it was built this way**: Prevents runtime bugs by enforcing strict typing across all components.
- **Key Types & Interfaces**:
  - `IssueCategory`: Union of `'Pothole' | 'Garbage' | 'Broken Streetlight' | 'Water Leakage' | 'Traffic Signal' | 'Illegal Dumping' | 'Public Space Damage' | 'Stray Animal' | 'Pollution' | 'Overgrown Area' | 'Other'`.
  - `IssueStatus`: `'Reported' | 'Verified' | 'In Progress' | 'Resolved'`.
  - `IssueSeverity`: `'Low' | 'Medium' | 'High' | 'Critical'`.
  - `Issue`: Complete entity containing ID (`NLF-XXXXX`), GPS coordinates (`lat`, `lng`), ward name, before/after images, upvoter array (`supporters`), comments thread, and AI detection metadata.
  - `CleanupDrive`: Event entity for volunteer squads with participant counts, targets (`targetWasteKg`), coordinates, equipment checklist, and RSVP arrays.
  - `UserProfile`: Citizen record tracking points, level titles, badge collections, report counts, and rank.

### `src/context/AppContext.tsx`
- **What it does**: The state management engine of Namma Local Fix. Provides global data and dispatch methods via React Context (`useApp()`).
- **Why it was built this way**: Eliminates prop-drilling across modals, headers, maps, and dashboards while syncing all user activity to `localStorage`.
- **Core State Properties**:
  - `activeTab`: Current visible view (`'home' | 'map' | 'report' | 'cleancity' | 'leaderboard' | 'about' | 'admin' | 'profile' | 'feed' | 'points'`).
  - `issues`: Array of active and resolved issues initialized from `INITIAL_ISSUES` or cached storage.
  - `user`: Active citizen profile (`Rahul Sharma`, 1240 Namma Points, Level 5).
  - `cleanupDrives`: Community volunteer events.
  - `stats`: City-wide aggregate impact figures (total reports, resolved count, waste removed in kg).
  - `toasts`: Dynamic queue of notification toasts.
- **Key Methods & Logic**:
  - `addNewIssue(issueData)`: Generates an ID `NLF-XXXXX`, sets status to `'Reported'`, awards +10 to +15 Namma Points, triggers confetti, posts a toast, and logs a notification.
  - `supportIssue(issueId)`: Handles citizen petition upvoting. Prevents duplicate votes, toggles citizen ID in `supporters[]`, and awards +2 points for community validation.
  - `submitCleanupProof(proofData)`: Sends before and after images to `/api/ai/verify-cleanup`. On AI verification, awards +50 points, updates global waste metrics, and increments user stats.
  - `updateIssueStatus(issueId, newStatus, officialNote)`: Admin action. Updates status pipeline, optionally appends an official BBMP comment, and updates resolution stats.
  - `awardPoints(points, actionName, iconType)`: Recalculates user level based on thresholds:
    - `0 - 249`: Level 1 (Civic Explorer)
    - `250 - 599`: Level 2 (Local Helper)
    - `600 - 999`: Level 3 (City Contributor)
    - `1000 - 1799`: Level 4 (Community Champion)
    - `1800+`: Level 5 (Bengaluru Guardian)

### `src/data/bengaluruData.ts`
- **What it does**: Realistic dataset pre-seeded with 10+ real Bengaluru civic issues, community drives, badges, and ward coordinates.
- **Why it was built this way**: Gives the app instant life. Instead of an empty screen, users see actual Bengaluru locations: *Koramangala 80ft Road, Indiranagar 100ft Road, HSR Layout Sector 2, Whitefield Main Road, Jayanagar 4th Block, Bellandur Outer Ring Road, and MG Road*.
- **Contents**:
  - `BENGALURU_AREAS`: List of 25 major BBMP wards and neighborhoods.
  - `INITIAL_ISSUES`: Complete issues with high-resolution Unsplash photos, GPS coordinates, real BBMP ward assignments, and citizen comment threads.
  - `INITIAL_CLEANUP_DRIVES`: Scheduled volunteer drives (*Agara Lake Perimeter Cleanup*, *Cubbon Park Waste Drive*).
  - `INITIAL_LEADERBOARD_USERS`: Top Bengaluru contributors ranked by points.

---

## 6. File-by-File Breakdown: UI Components

### `Navbar.tsx` & `MobileNav.tsx`
- **What they do**: Primary navigation chrome across desktop and mobile form factors.
- **How they work**:
  - `Navbar.tsx`: Contains the interactive logo, navigation links (`Home`, `Live Map`, `Clean City Squads`, `Leaderboard`, `Community Feed`), global search trigger with `⌘K` keyboard badge, unread notification counter dropdown, user point badge, and `Report Issue` CTA.
  - `MobileNav.tsx`: Fixed bottom tab bar for mobile viewports. Features 44px minimum touch targets and custom vibrant gradient vector icons (`GradientHome`, `GradientMapFold`, `GradientCamera`, `GradientTrashBin`, `GradientStar`).

### `LoadingScreen.tsx` & `Logo.tsx`
- **What they do**: Establish the visual brand identity of Namma Local Fix.
- **How they work**:
  - `LoadingScreen.tsx`: Displays an animated glowing logo wrapper, percentage counter (0% to 100%), dynamic civic status tips, and trust credentials before fading out.
  - `Logo.tsx`: Custom vector artwork featuring a 3D rainbow location pin, layered Bengaluru skyscraper skyline silhouettes, curved asphalt road, and bilingual-style typography (`Outfit` and `Vast Shadow` fonts).

### `ExploreMap.tsx`
- **What it does**: The central interactive mapping dashboard.
- **Why it was built this way**: Maps are the backbone of civic technology. Citizens need to visually locate clusters of potholes, trash dumps, and water leaks.
- **Key Features**:
  - *Layer Switcher*: 6 basemap styles including OpenStreetMap India (Voyager), OSM Standard, OSM Humanitarian, Carto Light, Dark Mode, and Satellite Imagery.
  - *Custom Markers*: Color-coded HTML pins with dynamic SVG icons corresponding to severity (amber for Low, red for Critical) and status badges.
  - *Interactive Popups*: Clicking any marker reveals issue photos, ward tags, upvote counts, and a direct `View Full Details` trigger.
  - *GPS Geolocation*: `LocateFixed` button uses the browser's Geolocation API to pan and zoom directly to the user's current Bengaluru position.
  - *Filter Toolbar*: Live filters for category, status, and ward.

### `ReportIssueModal.tsx`
- **What it does**: The reporting engine where citizens submit new tickets.
- **How it works**:
  - Step 1: **Photo Input**: Supports drag-and-drop, camera file picker, or instant selection of sample Bengaluru test issues with vector badges.
  - Step 2: **AI Scan**: Automatically calls `/api/ai/detect-issue`. An animated scan beam runs over the photo while Gemini analyzes visual hazards.
  - Step 3: **Category & Location**: Fills detected category, allows user refinement, and provides GPS detection or ward selection.
  - Step 4: **Submission**: Dispatches to `addNewIssue()`, awards points, fires confetti, and navigates to the live ticket.

### `IssueDetailModal.tsx`
- **What it does**: Full-page dialog displaying an issue's complete lifecycle.
- **How it works**:
  - Shows high-resolution photos, before/after resolution tabs, ward metadata, assigned authority (e.g. *BBMP Ward 151 Infra*), and estimated resolution days.
  - Allows citizens to click **Support Issue (Petition)**, boosting municipal priority.
  - Includes a live discussion thread where citizens and verified BBMP officials post status updates.
  - Supports one-click clipboard link sharing.

### `CleanCityDashboard.tsx`
- **What it does**: Organizes community clean-up squads and handles AI before/after verification.
- **How it works**:
  - *Drives Tab*: Lists upcoming weekend cleanups with dates, coordinates, participant RSVP toggles, and equipment lists.
  - *Verify Cleanup Tab*: Enables citizens who cleared an illegal garbage dump to upload a Before photo and an After photo. Sends both to Gemini AI, estimates kilograms removed, and credits +50 Namma Points to the citizen.
  - *Hotspots Radar*: Shows areas in Bengaluru with the highest concentration of open reports requiring volunteer intervention.

### `LeaderboardView.tsx` & `PointsDashboard.tsx`
- **What they do**: The gamification and civic pride engine.
- **How they work**:
  - `LeaderboardView.tsx`: Displays top 10 Bengaluru citizens by points, top wards by resolution rates (e.g. *Koramangala 88% resolved vs Whitefield 74%*), and recent achievements.
  - `PointsDashboard.tsx`: Personal reward hub showing user tier, points history ledger, progress bar toward next tier, and redeemable community perks (e.g., BMTC bus pass vouchers, Sapling plantation certificates).

### `CommunityFeed.tsx`
- **What it does**: A social stream of real-time civic activity across Bengaluru.
- **How it works**: Renders reports chronologically, displays before/after cards for resolved issues, and enables community upvoting and commenting.

### `AdminDashboard.tsx`
- **What it does**: Municipal interface for BBMP ward officers and civic engineers.
- **How it works**:
  - Provides quick KPI stat cards (Pending Review, In Progress, Resolved Today).
  - Searchable, filterable table by ward, category, and severity.
  - One-click status transition buttons (`Verify`, `Mark In Progress`, `Resolve`) that automatically post official BBMP verification notes.

### `AboutView.tsx` & `ProfileView.tsx`
- **What they do**:
  - `AboutView.tsx`: Explains the vision of Namma Local Fix, the "See-Report-Verify-Fix-Earn" model, and agency integration with BBMP, BESCOM, and BWSSB.
  - `ProfileView.tsx`: Personal citizen dashboard displaying unlocked badges, bookmarked issues, and user statistics.

### `GlobalSearchModal.tsx` & `ToastContainer.tsx`
- **What they do**:
  - `GlobalSearchModal.tsx`: Command-palette style search triggered by `Cmd/Ctrl + K` or clicking search in the navbar. Searches issues, wards, categories, and cleanup drives in real time.
  - `ToastContainer.tsx`: Fixed floating notification stack displaying animated success, point bonus, and informational toasts.

---

## 7. Step-by-Step Functional Workflows

### Flow A: Cold Boot & Splash Animation
1. The browser requests `/`.
2. `index.html` loads immediately. The user sees the inline HTML/SVG splash screen instantly.
3. React bundles load and mount `main.tsx` into `#root`.
4. `App.tsx` initializes with `isInitialLoading = true`.
5. `LoadingScreen.tsx` mounts, simulating ward data syncing, displaying rotating civic tips, and incrementing progress to 100%.
6. After 1200ms, `onLoaded` fires, smoothly fading the screen out to reveal the active dashboard.

### Flow B: Citizen Issue Reporting with Gemini Multimodal AI
```
[User Selects/Snaps Photo]
           |
           v
[FileReader converts to Base64]
           |
           v
[POST /api/ai/detect-issue]
           |
           v
[Express server sends image to Gemini 3.7 Flash]
           |
           v
[Gemini returns JSON: category, confidence, severity, action]
           |
           v
[ReportIssueModal auto-fills fields & presents AI badge]
           |
           v
[User submits -> AppContext.addNewIssue() -> Confetti & +10 Points]
```

### Flow C: Dual-Engine Mapping & Tile Proxying
1. `ExploreMap.tsx` mounts with default center `[12.9716, 77.5946]` (Bengaluru coordinates).
2. Leaflet loads CARTO Voyager tiles with retina `@2x` resolution.
3. `issues` array is filtered by active category, status, and search query.
4. Leaflet `divIcon` elements are generated with color-coded severity rings.
5. Clicking a pin opens a popup with thumbnail, title, upvotes, and details trigger.
6. The user can switch to Satellite, Dark Mode, or Humanitarian layers with zero re-rendering delays.

### Flow D: Clean City Before/After AI Transformation Verification
1. User cleans an area and navigates to **Clean City Squads -> Verify Transformation**.
2. User provides both a "Before" photo (dirty) and "After" photo (cleaned).
3. Both images are transmitted to `POST /api/ai/verify-cleanup`.
4. Gemini compares the background scenery to ensure location parity, checks for waste removal, and estimates total kilograms cleared.
5. On success, `submitCleanupProof()` awards **+50 Namma Points**, increments city waste stats, and posts a celebratory toast.

### Flow E: Gamification, Point Calculations & Level Progressions
- Points are strictly tracked and audited:
  - Reporting an issue: **+10 Points** (+15 for Garbage)
  - Upvoting/Supporting a neighbor's issue: **+2 Points**
  - Joining a scheduled cleanup drive: **+50 Points**
  - Verifying a completed cleanup with photo proof: **+50 Points**
  - Issue resolved confirmation: **+20 Points**
- Level thresholds automatically upgrade user badge titles from *Civic Explorer* up to *Bengaluru Guardian*.

### Flow F: Municipal BBMP Admin Triage
1. Officer opens the **BBMP Portal** tab (`AdminDashboard.tsx`).
2. Triage board groups tickets by status.
3. Officer reviews photo evidence and AI confidence score.
4. Officer clicks **Mark In Progress**, assigning road or electrical squads.
5. Once fixed, officer clicks **Mark Resolved**, automatically notifying the original reporter and awarding resolution points.

---

## 8. Security, Resilience & Performance Safeguards

1. **API Key Isolation**:
   - `GEMINI_API_KEY` is strictly accessed in `server.ts` via `process.env`. No secret is ever exposed in client bundles.
2. **Graceful Fallbacks**:
   - If the Gemini API is unreachable, has quota exhaustion, or lacks an API key, the server automatically switches to heuristic mode, ensuring user testing is never broken.
   - If MapTiler remote styles fail, the server falls back to OpenStreetMap raster cartography.
3. **Payload Sanitization**:
   - Express body size limits are set to 25MB to prevent memory denial-of-service while accommodating modern smartphone camera resolutions.
4. **LocalStorage Self-Healing**:
   - If stored local state becomes corrupted, `AppContext.tsx` falls back to `INITIAL_*` data from `bengaluruData.ts`.
5. **Accessible Design & Anti-Slop Principles**:
   - High color contrast compliant with WCAG AA.
   - Minimum 44px mobile touch targets.
   - Distinctive typography pairings (`Outfit`, `Plus Jakarta Sans`, `Vast Shadow`).
   - Clean spacing with no generic low-effort UI cliches.

---

*Authored for Namma Local Fix — Empowering citizens to Report, Track, and Transform Bengaluru.*
