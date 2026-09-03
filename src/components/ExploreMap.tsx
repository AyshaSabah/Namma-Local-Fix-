import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  LocateFixed,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Issue, IssueCategory } from '../types';

export type MapStyleKey =
  | 'osm-voyager'
  | 'osm-standard'
  | 'osm-humanitarian'
  | 'osm-light'
  | 'osm-dark'
  | 'satellite';

export interface MapStyleOption {
  key: MapStyleKey;
  label: string;
  url: string;
  subdomains?: string[];
  maxZoom: number;
  attribution: string;
  description: string;
  theme: 'light' | 'dark' | 'color';
}

export type MapViewMode = 'both' | 'heatmap' | 'pins';

export const MAP_STYLES: MapStyleOption[] = [
  {
    key: 'osm-voyager',
    label: 'OpenStreetMap India (Voyager)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    description: 'Crisp retina OpenStreetMap cartography with Bengaluru wards, roads & landmarks',
    theme: 'color',
  },
  {
    key: 'osm-standard',
    label: 'OSM Standard (openstreetmap.in)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    description: 'Official standard OpenStreetMap India tile cartography',
    theme: 'light',
  },
  {
    key: 'osm-humanitarian',
    label: 'OSM Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    subdomains: ['a', 'b'],
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> (HOT)',
    description: 'Humanitarian high-contrast civic map highlighting civic infrastructure',
    theme: 'light',
  },
  {
    key: 'osm-light',
    label: 'Carto Light (Clean)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    description: 'Minimalist high-contrast light cartography for pinpoint accuracy',
    theme: 'light',
  },
  {
    key: 'osm-dark',
    label: 'Dark Mode Cartography',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    description: 'Sleek dark basemap ideal for neon severity pin visualization',
    theme: 'dark',
  },
  {
    key: 'satellite',
    label: 'Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    description: 'High-resolution aerial satellite imagery of Bengaluru',
    theme: 'dark',
  },
];

interface ExploreMapProps {
  height?: string;
  isCompact?: boolean;
  onSelectIssue?: (issue: Issue) => void;
  showControls?: boolean;
  initialStyleKey?: MapStyleKey;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  height = 'calc(100vh - 4rem)',
  isCompact = false,
  onSelectIssue,
  showControls = true,
  initialStyleKey = 'osm-voyager',
}) => {
  const {
    issues,
    selectedCategory,
    setSelectedCategory,
    selectedArea,
    setSelectedArea,
    setSelectedIssueId,
    setIsReportModalOpen,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentStyleKey, setCurrentStyleKey] = useState<MapStyleKey>(initialStyleKey);
  const [viewMode, setViewMode] = useState<MapViewMode>('both');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPinIssue, setSelectedPinIssue] = useState<Issue | null>(null);
  const [mapSearchText, setMapSearchText] = useState('');
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
  const [isHotspotPanelOpen, setIsHotspotPanelOpen] = useState<boolean>(!isCompact);
  const [currentZoom, setCurrentZoom] = useState<number>(isCompact ? 11 : 12);
  const [currentCenter, setCurrentCenter] = useState<{ lat: number; lng: number }>({
    lat: 12.9902,
    lng: 77.5554,
  });
  const [isLocating, setIsLocating] = useState(false);

  // Category Color and SVG Icon helper
  const getCategoryTheme = (category: IssueCategory) => {
    switch (category) {
      case 'Pothole':
        return {
          color: '#8b5cf6', // Violet
          bgColor: 'rgba(139, 92, 246, 0.15)',
          label: 'Pothole',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
        };
      case 'Garbage':
      case 'Illegal Dumping':
        return {
          color: '#10b981', // Emerald
          bgColor: 'rgba(16, 185, 129, 0.15)',
          label: 'Garbage',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        };
      case 'Broken Streetlight':
      case 'Traffic Signal':
        return {
          color: '#f59e0b', // Amber
          bgColor: 'rgba(245, 158, 11, 0.15)',
          label: 'Lighting',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        };
      case 'Water Leakage':
        return {
          color: '#06b6d4', // Cyan
          bgColor: 'rgba(6, 182, 212, 0.15)',
          label: 'Water',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
        };
      case 'Pollution':
      case 'Overgrown Area':
        return {
          color: '#84cc16', // Lime
          bgColor: 'rgba(132, 204, 22, 0.15)',
          label: 'Environment',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
        };
      default:
        return {
          color: '#ec4899', // Pink
          bgColor: 'rgba(236, 72, 153, 0.15)',
          label: 'Civic',
          iconSvg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
        };
    }
  };

  // Filtered Issues list
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Category Filter
      if (activeFilter === 'Potholes' && issue.category !== 'Pothole') return false;
      if (
        activeFilter === 'Garbage' &&
        issue.category !== 'Garbage' &&
        issue.category !== 'Illegal Dumping'
      )
        return false;
      if (
        activeFilter === 'Streetlights' &&
        issue.category !== 'Broken Streetlight' &&
        issue.category !== 'Traffic Signal'
      )
        return false;
      if (activeFilter === 'Water' && issue.category !== 'Water Leakage') return false;
      if (
        activeFilter === 'Traffic' &&
        issue.category !== 'Traffic Signal' &&
        issue.category !== 'Pothole'
      )
        return false;
      if (
        activeFilter === 'Environment' &&
        issue.category !== 'Pollution' &&
        issue.category !== 'Overgrown Area'
      )
        return false;

      // Area / Text Search Filter
      if (mapSearchText.trim()) {
        const query = mapSearchText.toLowerCase();
        const matchesArea = issue.area.toLowerCase().includes(query);
        const matchesAddress = issue.streetAddress.toLowerCase().includes(query);
        const matchesTitle = issue.title.toLowerCase().includes(query);
        const matchesCat = issue.category.toLowerCase().includes(query);
        if (!matchesArea && !matchesAddress && !matchesTitle && !matchesCat) return false;
      }

      return true;
    });
  }, [issues, activeFilter, mapSearchText]);

  // Hotspots grouped by area
  const hotspots = useMemo(() => {
    const map: Record<string, { count: number; criticalCount: number; lat: number; lng: number }> =
      {};
    issues.forEach((i) => {
      if (!map[i.area]) {
        map[i.area] = { count: 0, criticalCount: 0, lat: i.lat, lng: i.lng };
      }
      map[i.area].count += 1;
      if (i.severity === 'Critical' || i.severity === 'High') {
        map[i.area].criticalCount += 1;
      }
    });

    return Object.entries(map)
      .map(([area, data]) => ({
        area,
        count: data.count,
        criticalCount: data.criticalCount,
        lat: data.lat,
        lng: data.lng,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [issues]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialStyleObj =
      MAP_STYLES.find((s) => s.key === currentStyleKey) || MAP_STYLES[0];

    const map = L.map(mapContainerRef.current, {
      center: [12.9902, 77.5554], // Exact OpenStreetMap Bengaluru center
      zoom: isCompact ? 11 : 12,
      minZoom: 9,
      maxZoom: 19,
      zoomControl: false, // We render custom modern control pills
      attributionControl: true,
    });

    // Add Tile Layer
    const tileLayer = L.tileLayer(initialStyleObj.url, {
      maxZoom: initialStyleObj.maxZoom,
      subdomains: initialStyleObj.subdomains || 'abc',
      attribution: initialStyleObj.attribution,
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Create Layer Groups
    const heatmapGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    heatmapLayerGroupRef.current = heatmapGroup;
    markersLayerGroupRef.current = markersGroup;

    // Track movement
    map.on('move', () => {
      const center = map.getCenter();
      setCurrentCenter({
        lat: parseFloat(center.lat.toFixed(4)),
        lng: parseFloat(center.lng.toFixed(4)),
      });
      setCurrentZoom(map.getZoom());
    });

    // Invalidate size immediately and after delay for tab switches
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    mapInstanceRef.current = map;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const styleObj = MAP_STYLES.find((s) => s.key === currentStyleKey) || MAP_STYLES[0];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(styleObj.url, {
      maxZoom: styleObj.maxZoom,
      subdomains: styleObj.subdomains || 'abc',
      attribution: styleObj.attribution,
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [currentStyleKey]);

  // Render Markers and Heatmap Circles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const heatmapGroup = heatmapLayerGroupRef.current;

    if (markersGroup) markersGroup.clearLayers();
    if (heatmapGroup) heatmapGroup.clearLayers();

    // 1. Render Heatmap halos / density circles if viewMode is 'both' or 'heatmap'
    if (heatmapGroup && (viewMode === 'both' || viewMode === 'heatmap')) {
      hotspots.forEach((hs) => {
        const radius = Math.min(2400, Math.max(800, hs.count * 350));
        const circle = L.circle([hs.lat, hs.lng], {
          color: hs.criticalCount > 0 ? '#f43f5e' : '#f97316',
          fillColor: hs.criticalCount > 0 ? '#f43f5e' : '#f97316',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '4, 6',
          radius: radius,
        });

        circle.bindTooltip(
          `<div class="text-xs font-bold text-slate-900">${hs.area}</div>
           <div class="text-[10px] text-orange-600 font-semibold">${hs.count} reported issues (${hs.criticalCount} critical)</div>`,
          { className: 'leaflet-custom-tooltip', direction: 'top', offset: [0, -10] }
        );

        circle.on('click', () => {
          map.flyTo([hs.lat, hs.lng], 14, { duration: 1 });
        });

        circle.addTo(heatmapGroup);
      });
    }

    // 2. Render Pin Markers if viewMode is 'both' or 'pins'
    if (markersGroup && (viewMode === 'both' || viewMode === 'pins')) {
      filteredIssues.forEach((issue) => {
        const theme = getCategoryTheme(issue.category);
        const isResolved = issue.status === 'Resolved';
        const isCritical = issue.severity === 'Critical' || issue.severity === 'High';

        const customIcon = L.divIcon({
          className: 'custom-leaflet-civic-marker',
          html: `
            <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
              <!-- Pulse ring for critical issues -->
              ${
                isCritical && !isResolved
                  ? `<div class="absolute -inset-1.5 rounded-full animate-ping opacity-60 pointer-events-none" style="background-color: ${theme.color};"></div>`
                  : ''
              }
              
              <!-- Main Pin Container -->
              <div class="relative flex items-center justify-center transition-transform transform group-hover:scale-115"
                style="
                  width: ${isCompact ? '32px' : '38px'};
                  height: ${isCompact ? '38px' : '44px'};
                "
              >
                <svg viewBox="0 0 100 120" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.25));">
                  <path d="M50 115 C50 115 15 72 15 45 C15 22.9 30.7 5 50 5 C69.3 5 85 22.9 85 45 C85 72 50 115 50 115 Z"
                    fill="${isResolved ? '#10b981' : theme.color}"
                    stroke="#ffffff"
                    stroke-width="3"
                  />
                  <circle cx="50" cy="45" r="22" fill="#ffffff" />
                </svg>

                <!-- Centered Category Icon -->
                <div class="absolute top-[10px] left-[9px] sm:top-[12px] sm:left-[12px] text-slate-800" style="color: ${
                  isResolved ? '#10b981' : theme.color
                };">
                  ${theme.iconSvg}
                </div>

                <!-- Support Count Badge -->
                ${
                  issue.supportersCount > 5
                    ? `<div class="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-white font-black text-[9px] border border-white shadow-xs">
                        ${issue.supportersCount}
                      </div>`
                    : ''
                }
              </div>
            </div>
          `,
          iconSize: [isCompact ? 32 : 38, isCompact ? 38 : 44],
          iconAnchor: [isCompact ? 16 : 19, isCompact ? 38 : 44],
        });

        const marker = L.marker([issue.lat, issue.lng], {
          icon: customIcon,
          title: `${issue.category}: ${issue.title}`,
        });

        // Click handler: opens issue drawer / selects issue
        marker.on('click', () => {
          setSelectedPinIssue(issue);
          if (onSelectIssue) {
            onSelectIssue(issue);
          }
        });

        // Hover tooltip
        marker.bindTooltip(
          `<div class="p-1 min-w-[140px]">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="w-2 h-2 rounded-full" style="background-color: ${theme.color};"></span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${issue.category}</span>
            </div>
            <div class="text-xs font-bold text-slate-900 line-clamp-1">${issue.title}</div>
            <div class="text-[10px] text-slate-500 truncate">${issue.area}</div>
          </div>`,
          {
            className: 'leaflet-custom-tooltip',
            direction: 'top',
            offset: [0, -40],
          }
        );

        marker.addTo(markersGroup);
      });
    }
  }, [filteredIssues, viewMode, hotspots, isCompact, onSelectIssue]);

  // Recenter on OpenStreetMap Bengaluru center [12.9902, 77.5554]
  const handleRecenterBengaluru = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([12.9902, 77.5554], 12, {
        duration: 1.2,
      });
    }
  };

  // Locate User Position
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15, {
            duration: 1.2,
          });

          // Add temporary pulsing location marker
          const userPin = L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#06b6d4',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 1,
          }).addTo(mapInstanceRef.current);

          userPin.bindPopup('<b>Your Current Location</b>').openPopup();
        }
      },
      () => {
        setIsLocating(false);
        // Fallback to Bengaluru Central
        handleRecenterBengaluru();
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Fly to Hotspot
  const handleFlyToHotspot = (hs: { lat: number; lng: number }) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hs.lat, hs.lng], 14.5, {
        duration: 1.2,
      });
    }
  };

  const currentStyle = MAP_STYLES.find((s) => s.key === currentStyleKey) || MAP_STYLES[0];

  return (
    <div
      id="osm-explore-container"
      className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-2xl"
      style={{ height }}
    >
      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" tabIndex={0} />

      {/* Floating Top Controls Overlay */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pointer-events-none">
          {/* Search bar & Category Quick Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            {/* Search Input inside Map */}
            <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl shadow-lg w-full sm:w-72">
              <Search className="w-4 h-4 text-cyan-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search area (e.g. Koramangala, Indiranagar)..."
                value={mapSearchText}
                onChange={(e) => setMapSearchText(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-full font-medium"
              />
              {mapSearchText && (
                <button
                  onClick={() => setMapSearchText('')}
                  className="text-[10px] text-slate-400 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Potholes', 'Garbage', 'Streetlights', 'Water', 'Traffic', 'Environment'].map(
                (filterName) => {
                  const isActive = activeFilter === filterName;
                  return (
                    <button
                      key={filterName}
                      id={`osm-filter-${filterName.toLowerCase()}`}
                      onClick={() => setActiveFilter(filterName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-white/95 text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {filterName}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Right Top Bar: Heatmap Layer Mode & Style Switcher */}
          <div className="pointer-events-auto flex items-center gap-2 self-end md:self-auto flex-wrap sm:flex-nowrap">
            {/* View Mode Segmented Selector (Both / Heatmap / Pins) */}
            <div className="flex items-center p-1 rounded-2xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-xl">
              <button
                id="map-mode-both-btn"
                onClick={() => setViewMode('both')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'both'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show both heatmap concentration density and pin markers"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden sm:inline">Both</span>
              </button>
              <button
                id="map-mode-heatmap-btn"
                onClick={() => setViewMode('heatmap')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'heatmap'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show heatmap density concentration layer only"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Heatmap</span>
              </button>
              <button
                id="map-mode-pins-btn"
                onClick={() => setViewMode('pins')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'pins'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Show individual pinpoint markers only"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Pins</span>
              </button>
            </div>

            {/* Map Style Selector Dropdown */}
            <div className="relative">
              <button
                id="map-style-dropdown-btn"
                onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-xl shadow-lg text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-600" />
                <span>{currentStyle.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isStyleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Style Dropdown Menu */}
              {isStyleDropdownOpen && (
                <div
                  id="map-style-menu"
                  className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-white/98 border border-slate-200 shadow-2xl backdrop-blur-2xl z-30 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    OpenStreetMap Cartography
                  </div>
                  <div className="space-y-1">
                    {MAP_STYLES.map((style) => {
                      const isSelected = currentStyleKey === style.key;
                      return (
                        <button
                          key={style.key}
                          onClick={() => {
                            setCurrentStyleKey(style.key);
                            setIsStyleDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-cyan-50 border border-cyan-300 text-cyan-900'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                              style.key === 'osm-voyager'
                                ? 'bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white'
                                : style.key === 'osm-standard'
                                ? 'bg-teal-600 text-white'
                                : style.key === 'osm-humanitarian'
                                ? 'bg-orange-500 text-white'
                                : style.key === 'osm-light'
                                ? 'bg-slate-200 text-slate-800'
                                : style.key === 'osm-dark'
                                ? 'bg-slate-900 text-white'
                                : 'bg-emerald-800 text-white'
                            }`}
                          >
                            OSM
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {style.label}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-tight truncate">
                              {style.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[10px] text-slate-400">
                    <span>OpenStreetMap India / Leaflet</span>
                    <span className="font-mono text-emerald-700 font-bold">100% Online</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Controls (Right Bottom) */}
      {showControls && (
        <div className="absolute right-4 bottom-8 z-10 flex flex-col gap-2 pointer-events-auto items-end">
          {/* Live OpenStreetMap coordinates pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-[10px] font-mono text-slate-600 shadow-md backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {currentCenter.lat.toFixed(4)}°N, {currentCenter.lng.toFixed(4)}°E
            </span>
            <span className="text-slate-300">|</span>
            <span>z{currentZoom}</span>
          </div>

          {/* User Location Button */}
          <button
            id="osm-locate-btn"
            onClick={handleUseMyLocation}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-cyan-700 flex items-center justify-center shadow-lg hover:bg-slate-50 transition-all backdrop-blur-xl"
            title="Locate my position"
          >
            {isLocating ? (
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-600" />
            ) : (
              <LocateFixed className="w-5 h-5" />
            )}
          </button>

          {/* Zoom In & Zoom Out Buttons */}
          <div className="flex flex-col rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden backdrop-blur-xl">
            <button
              id="osm-zoom-in-btn"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-10 h-9 text-slate-800 font-black text-base hover:bg-slate-50 border-b border-slate-100 flex items-center justify-center"
              title="Zoom In"
            >
              +
            </button>
            <button
              id="osm-zoom-out-btn"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-10 h-9 text-slate-800 font-black text-base hover:bg-slate-50 flex items-center justify-center"
              title="Zoom Out"
            >
              −
            </button>
          </div>

          {/* Recenter Bengaluru (OpenStreetMap.in Coordinates: 12.9902, 77.5554) */}
          <button
            id="osm-bengaluru-btn"
            onClick={handleRecenterBengaluru}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shadow-lg hover:bg-slate-50 transition-all backdrop-blur-xl"
            title="Center on Bengaluru (12.9902°N, 77.5554°E)"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Open in OpenStreetMap India */}
          <a
            id="open-in-osm-btn"
            href={`https://www.openstreetmap.in/#${currentZoom}/${currentCenter.lat}/${currentCenter.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 shadow-lg hover:bg-slate-50 transition-all backdrop-blur-xl group"
            title="Open current location on OpenStreetMap India (openstreetmap.in)"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">OSM.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </a>
        </div>
      )}

      {/* Interactive Bengaluru Civic Heatmap & Hotspots Drawer (Bottom Left) */}
      {!isCompact && (
        <div className="absolute left-4 bottom-4 z-10 pointer-events-auto max-w-sm sm:max-w-md w-full">
          <div className="rounded-3xl bg-white/95 border border-slate-200 backdrop-blur-2xl shadow-xl overflow-hidden text-slate-800 transition-all">
            {/* Hotspot Header */}
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Flame className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 font-['Outfit']">
                      Bengaluru Civic Heatmap
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 font-bold">
                      {filteredIssues.length} issues
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {viewMode === 'pins'
                      ? 'Heatmap paused (Pins Mode)'
                      : 'Density concentration across wards'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHotspotPanelOpen(!isHotspotPanelOpen)}
                className="text-xs font-bold text-cyan-700 hover:text-cyan-800 px-2 py-1 rounded-lg hover:bg-cyan-50 transition-colors flex items-center gap-1"
              >
                <span>{isHotspotPanelOpen ? 'Collapse' : 'Hotspots'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isHotspotPanelOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Density Gradient Scale Bar */}
            <div className="px-3.5 py-2 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                <span>Low Density</span>
                <span>Medium</span>
                <span className="text-orange-600">High Concentration</span>
                <span className="text-rose-600 font-black">Critical Hotspot</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 via-orange-500 to-rose-600 shadow-inner" />
            </div>

            {/* Top Hotspots Quick Jump List */}
            {isHotspotPanelOpen && (
              <div className="p-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Top Concentration Clusters</span>
                  <span>Click to Focus</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {hotspots.map((hs, idx) => (
                    <button
                      key={hs.area}
                      onClick={() => handleFlyToHotspot(hs)}
                      className="group flex items-center justify-between p-2 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 group-hover:border-orange-300 flex items-center justify-center text-[10px] font-black text-slate-700 group-hover:text-orange-600 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-orange-700 truncate">
                            {hs.area}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {hs.count} reported {hs.count === 1 ? 'issue' : 'issues'}
                          </p>
                        </div>
                      </div>

                      {hs.criticalCount > 0 && (
                        <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 flex-shrink-0">
                          {hs.criticalCount} crit
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Category Legend Pill row */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Pothole</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Garbage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Lighting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Traffic</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Pin Issue Preview Card Drawer */}
      {selectedPinIssue && (
        <div
          id="osm-selected-issue-card"
          className="absolute left-3 right-3 sm:left-4 sm:right-auto sm:w-96 bottom-16 sm:bottom-4 z-20 p-4 rounded-3xl bg-white/98 border border-slate-200 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getCategoryTheme(selectedPinIssue.category).color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">
                {selectedPinIssue.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                #{selectedPinIssue.id}
              </span>
            </div>

            <button
              onClick={() => setSelectedPinIssue(null)}
              className="text-slate-400 hover:text-slate-800 text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <h4 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1 font-['Outfit']">
            {selectedPinIssue.title}
          </h4>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {selectedPinIssue.description}
          </p>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="truncate">
              {selectedPinIssue.area} • {selectedPinIssue.streetAddress}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedPinIssue.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : selectedPinIssue.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                }`}
              >
                {selectedPinIssue.status}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedPinIssue.supportersCount} supporters
              </span>
            </div>

            <button
              id={`osm-view-issue-${selectedPinIssue.id}`}
              onClick={() => {
                setSelectedIssueId(selectedPinIssue.id);
                setSelectedPinIssue(null);
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
