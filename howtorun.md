# How to Run Namma Local Fix on Your Local Machine

A step-by-step guide to downloading, configuring, and running **Namma Local Fix** locally on **macOS (MacBook)** and **Windows**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Downloading the Project to Your Local Disc](#2-downloading-the-project-to-your-local-disc)
3. [Setup & Running on macOS (MacBook)](#3-setup--running-on-macos-macbook)
4. [Setup & Running on Windows](#4-setup--running-on-windows)
5. [Configuring the Gemini API Key](#5-configuring-the-gemini-api-key)
6. [Available npm Commands](#6-available-npm-commands)
7. [Troubleshooting & Common Issues](#7-troubleshooting--common-issues)

---

## 1. Prerequisites

Before running the application, make sure your computer has **Node.js** installed:

- **Node.js**: Version **20.x or higher** (LTS recommended)
  - Verify by opening Terminal (macOS) or Command Prompt / PowerShell (Windows) and running:
    ```bash
    node -v
    npm -v
    ```
  - If you don't have Node.js installed:
    - Download and install the LTS version from: [https://nodejs.org/](https://nodejs.org/)

---

## 2. Downloading the Project to Your Local Disc

### Option A: Export from Google AI Studio (ZIP)
1. In the AI Studio interface, go to the top-right menu (Settings / Export).
2. Click **Export to ZIP** or download the project archive.
3. Move the downloaded `.zip` file to your preferred folder (e.g., `Documents` or `Projects`).
4. Extract (unzip) the file.

### Option B: Clone via Git
If you pushed or connected this repository to GitHub:
```bash
git clone https://github.com/your-username/namma-local-fix.git
cd namma-local-fix
```

---

## 3. Setup & Running on macOS (MacBook)

### Step 1: Open Terminal
- Press `Cmd + Space` (Spotlight), type **Terminal**, and press `Enter`.

### Step 2: Navigate into the Project Folder
Use the `cd` command to enter the extracted project directory. For example:
```bash
cd ~/Downloads/namma-local-fix
# or if placed in Documents:
cd ~/Documents/namma-local-fix
```

### Step 3: Install Dependencies
Run npm install to download all required packages into `node_modules`:
```bash
npm install
```

### Step 4: Set Up Environment Variables (Optional but Recommended)
Copy the template `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Open `.env` in any text editor (TextEdit, VS Code, Nano):
```bash
nano .env
```
Add your Google Gemini API Key:
```env
GEMINI_API_KEY=AIzaSy...your_real_key_here
```
*(Note: If you don't have an API key yet, the app will still run in local heuristic fallback mode).*

### Step 5: Start the Development Server
```bash
npm run dev
```

### Step 6: View the App in Your Browser
- Open Safari, Chrome, or Firefox.
- Go to: **[http://localhost:3000](http://localhost:3000)**

---

## 4. Setup & Running on Windows

### Step 1: Open Terminal (PowerShell or Command Prompt)
- Press `Windows Key`, type **PowerShell** or **Terminal**, and click to open.
*(You can also use Git Bash or VS Code's integrated terminal).*

### Step 2: Navigate into the Project Folder
Use `cd` to navigate to where you extracted the project. For example:
```powershell
cd C:\Users\YourUsername\Downloads\namma-local-fix
# or if located on D: drive:
d:
cd D:\Projects\namma-local-fix
```

### Step 3: Install Dependencies
Run:
```powershell
npm install
```

### Step 4: Set Up the `.env` File
In PowerShell, run:
```powershell
Copy-Item .env.example .env
```
*(Or in Command Prompt: `copy .env.example .env`)*

Open the `.env` file in Notepad:
```powershell
notepad .env
```
Paste your Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...your_real_key_here
```
Save the file (`Ctrl + S`) and close Notepad.

### Step 5: Start the Server
```powershell
npm run dev
```

### Step 6: View the App in Your Browser
- Open Chrome, Edge, or Firefox.
- Navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 5. Configuring the Gemini API Key

The application uses Gemini 3.7 Flash on the server (`server.ts`) for:
- Automatic civic hazard classification from citizen photos (potholes, garbage piles, etc.).
- Dual-image Before/After cleanup verification.

### How to obtain a free key:
1. Visit **[Google AI Studio](https://aistudio.google.com/)**.
2. Sign in with your Google account.
3. Click **"Get API key"** and create a new key.
4. Paste the key into your local `.env` file:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
5. Restart your server (`Ctrl + C` then `npm run dev`).

> 💡 **Graceful Fallback**: If `GEMINI_API_KEY` is not provided, the app will **not** crash. The server automatically uses an intelligent local heuristic classifier so you can still test the entire workflow offline.

---

## 6. Available npm Commands

| Command | What it does | When to use |
|---|---|---|
| `npm run dev` | Runs the full-stack app using `tsx server.ts` with Vite middleware | Daily local development |
| `npm run build` | Compiles the React client with Vite and bundles `server.ts` to `dist/server.cjs` with `esbuild` | Testing production deployment |
| `npm start` | Runs the compiled production server `node dist/server.cjs` | Running in production mode |
| `npm run lint` | Runs TypeScript compiler type-check (`tsc --noEmit`) | Verifying code integrity |

---

## 7. Troubleshooting & Common Issues

### Issue 1: `Port 3000 is already in use` (EADDRINUSE)
Another program or previous instance is running on port 3000.

- **On macOS**:
  ```bash
  # Find what is using port 3000
  lsof -i :3000
  # Kill the process (replace <PID> with the PID number shown)
  kill -9 <PID>
  ```
- **On Windows (PowerShell)**:
  ```powershell
  # Find what is using port 3000
  netstat -ano | findstr :3000
  # Kill the process (replace <PID> with the number at the right end of the line)
  taskkill /PID <PID> /F
  ```

### Issue 2: `command not found: node` or `'node' is not recognized`
- Node.js is either not installed or not added to your system's PATH.
- Re-download the installer from [https://nodejs.org/](https://nodejs.org/) and restart your terminal window.

### Issue 3: Camera or Geolocation not prompting in browser
- Browsers allow Camera and Geolocation access on `http://localhost` automatically.
- Ensure you open `http://localhost:3000` (not an arbitrary local IP address) and allow permissions when prompted by your browser.

### Issue 4: Stopping the Local Server
- In your terminal window, press **`Ctrl + C`** to stop the server at any time.

---

*Enjoy running Namma Local Fix on your local machine! 🚀*
