import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
    '2xl': 'text-3xl sm:text-4xl',
  };

  return (
    <div
      id="namma-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* High-Fidelity 3D Vibrant City Map Pin & Road Logo */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* 3D Rainbow Pin Main Gradient */}
            <linearGradient id="pinRainbowGrad" x1="20" y1="15" x2="180" y2="175" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="18%" stopColor="#3b82f6" />
              <stop offset="35%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="65%" stopColor="#f43f5e" />
              <stop offset="78%" stopColor="#ff5722" />
              <stop offset="88%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Glossy Pin Highlight */}
            <linearGradient id="pinGloss" x1="70" y1="20" x2="130" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Inner Ring Depth Shadow */}
            <linearGradient id="pinInnerShadow" x1="100" y1="40" x2="100" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>

            {/* Platform Base Rim Rainbow Gradient */}
            <linearGradient id="baseRainbowRim" x1="30" y1="140" x2="170" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Road Surface Gradient */}
            <linearGradient id="roadSurfaceGrad" x1="140" y1="110" x2="70" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Road Rainbow Border Ribbon */}
            <linearGradient id="roadRibbonGrad" x1="60" y1="160" x2="160" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="30%" stopColor="#f97316" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Target Pulse Drop Radial Gradient */}
            <radialGradient id="targetRipple" cx="100" cy="130" r="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
            </radialGradient>

            {/* Soft Ambient Platform Shadow */}
            <radialGradient id="dropShadow" cx="100" cy="175" r="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Base Shadow on ground */}
          <ellipse cx="100" cy="175" rx="75" ry="18" fill="url(#dropShadow)" />

          {/* 2. City Skyline Background Buildings (Behind Pin) */}
          <g id="city-skyline" className="opacity-95">
            {/* Far Left Sprout Leaf */}
            <path
              d="M48 95 C40 85 45 76 56 78 C62 88 56 97 48 95 Z"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="1"
            />
            <path d="M49 93 C53 87 56 80 56 78" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" />

            {/* Left Building Small */}
            <rect x="40" y="108" width="16" height="32" rx="2" fill="#1e3a8a" />
            <rect x="44" y="112" width="3" height="4" rx="0.5" fill="#93c5fd" />
            <rect x="50" y="112" width="3" height="4" rx="0.5" fill="#93c5fd" />
            <rect x="44" y="118" width="3" height="4" rx="0.5" fill="#93c5fd" />
            <rect x="50" y="118" width="3" height="4" rx="0.5" fill="#93c5fd" />

            {/* Left Building Medium */}
            <rect x="54" y="96" width="18" height="44" rx="2" fill="#2563eb" />
            <rect x="58" y="100" width="3.5" height="5" rx="0.5" fill="#dbeafe" />
            <rect x="64" y="100" width="3.5" height="5" rx="0.5" fill="#dbeafe" />
            <rect x="58" y="108" width="3.5" height="5" rx="0.5" fill="#dbeafe" />
            <rect x="64" y="108" width="3.5" height="5" rx="0.5" fill="#dbeafe" />

            {/* Right Building Tall Tower with Spire */}
            <path d="M147 63 L147 74" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
            <rect x="139" y="74" width="22" height="66" rx="3" fill="#1d4ed8" />
            <rect x="143" y="80" width="4.5" height="6" rx="0.8" fill="#eff6ff" />
            <rect x="151" y="80" width="4.5" height="6" rx="0.8" fill="#eff6ff" />
            <rect x="143" y="90" width="4.5" height="6" rx="0.8" fill="#eff6ff" />
            <rect x="151" y="90" width="4.5" height="6" rx="0.8" fill="#eff6ff" />
            <rect x="143" y="100" width="4.5" height="6" rx="0.8" fill="#eff6ff" />
            <rect x="151" y="100" width="4.5" height="6" rx="0.8" fill="#eff6ff" />

            {/* Right Building Mid */}
            <rect x="129" y="90" width="16" height="50" rx="2" fill="#3b82f6" />
            <rect x="133" y="96" width="3.5" height="4.5" rx="0.5" fill="#bfdbfe" />
            <rect x="133" y="104" width="3.5" height="4.5" rx="0.5" fill="#bfdbfe" />

            {/* Far Right Building */}
            <rect x="154" y="93" width="14" height="47" rx="2" fill="#1e40af" />
            <rect x="158" y="98" width="3" height="4" rx="0.5" fill="#93c5fd" />
            <rect x="158" y="106" width="3" height="4" rx="0.5" fill="#93c5fd" />

            {/* Right Foliage Dome */}
            <path
              d="M128 126 C128 108 160 108 166 126 Z"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth="1.5"
            />
            {/* Left Foliage Dome */}
            <path
              d="M36 136 C36 114 80 114 84 136 Z"
              fill="#4ade80"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
          </g>

          {/* 3. Circular 3D Map Base Platform */}
          <g id="base-platform">
            {/* Bottom Bevel Thickness */}
            <path
              d="M37 142 C37 172 163 172 163 142 L163 150 C163 182 37 182 37 150 Z"
              fill="url(#baseRainbowRim)"
            />

            {/* Top Map Surface Ellipse */}
            <ellipse cx="100" cy="142" rx="63" ry="24" fill="#a7f3d0" stroke="#ffffff" strokeWidth="2" />

            {/* Map Grid Roads & Zones */}
            <path
              d="M50 134 Q75 142 100 138 Q125 134 150 142"
              stroke="#ffffff"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M65 148 L90 128"
              stroke="#ffffff"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M38 143 C42 153 65 158 75 152 C80 144 65 136 50 138 Z"
              fill="#38bdf8"
              opacity="0.9"
            />

            {/* Concentric Center Drop Target Ring */}
            <ellipse cx="100" cy="132" rx="28" ry="11" fill="url(#targetRipple)" />
            <ellipse cx="100" cy="132" rx="20" ry="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="100" cy="132" rx="11" ry="4.5" fill="#0369a1" />
            <ellipse cx="100" cy="132" rx="5" ry="2" fill="#38bdf8" />
          </g>

          {/* 4. Curving 3D Asphalt Road with Center Dashes */}
          <g id="winding-road">
            {/* Outer Rainbow Road Border */}
            <path
              d="M128 114 C155 125 168 140 148 160 C125 182 72 178 58 164 C50 156 55 148 70 145"
              stroke="url(#roadRibbonGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />

            {/* Asphalt Road Body */}
            <path
              d="M128 114 C155 125 168 140 148 160 C125 182 72 178 58 164 C50 156 55 148 70 145"
              stroke="url(#roadSurfaceGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* White Dashed Center Lane Line */}
            <path
              d="M128 114 C155 125 168 140 148 160 C125 182 72 178 58 164 C50 156 55 148 70 145"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
          </g>

          {/* 5. The Grand 3D Glossy Rainbow Pin Marker */}
          <g id="rainbow-pin">
            {/* Drop Pin Shadow on Platform */}
            <ellipse cx="100" cy="130" rx="14" ry="4" fill="#0f172a" opacity="0.4" />

            {/* Main Rainbow Pin Body */}
            <path
              d="M100 130 C100 130 58 88 58 56 C58 32.8 76.8 14 100 14 C123.2 14 142 32.8 142 56 C142 88 100 130 100 130 Z"
              fill="url(#pinRainbowGrad)"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Inner Hollow Center Circle (3D Donut Effect) */}
            <circle cx="100" cy="56" r="21" fill="#ffffff" />
            <circle cx="100" cy="56" r="18" fill="url(#pinInnerShadow)" />
            <circle cx="100" cy="56" r="17" fill="url(#pinRainbowGrad)" opacity="0.25" />

            {/* Top Gloss Reflection / Highlight Arc */}
            <path
              d="M100 18 C80 18 64 34 64 56 C64 68 70 82 82 98 C76 84 72 72 72 58 C72 42 84 28 100 28 C116 28 128 42 128 58 C128 72 124 84 118 98 C130 82 136 68 136 56 C136 34 120 18 100 18 Z"
              fill="url(#pinGloss)"
            />

            {/* Specular White Rim Shine on Top Left */}
            <path
              d="M75 32 C82 24 91 20 100 20 C109 20 118 24 125 32"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Soft Inner Highlight Sparkle */}
            <ellipse cx="94" cy="46" rx="4" ry="7" fill="#ffffff" transform="rotate(-30 94 46)" opacity="0.75" />
          </g>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${titleSizes[size]} text-slate-900 font-['Outfit'] whitespace-nowrap`}>
            Namma
          </span>
          <span
            className={`font-black tracking-tight ${titleSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 font-['Outfit'] whitespace-nowrap inline-block`}
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Local Fix
          </span>
        </div>

        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] tracking-wider uppercase font-bold text-slate-500 font-['Cairo_Play']">
            <span className="text-cyan-600">Report.</span>
            <span className="text-blue-600">Track.</span>
            <span className="text-emerald-600">Transform.</span>
          </div>
        )}
      </div>
    </div>
  );
};
