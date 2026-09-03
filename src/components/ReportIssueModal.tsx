import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Droplets,
  Image as ImageIcon,
  Loader2,
  LocateFixed,
  MapPin,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { AiDetectionResult, Issue, IssueCategory, IssueSeverity } from '../types';

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Garbage',
  'Broken Streetlight',
  'Water Leakage',
  'Traffic Signal',
  'Illegal Dumping',
  'Public Space Damage',
  'Stray Animal',
  'Pollution',
  'Overgrown Area',
  'Other',
];

const SEVERITIES: IssueSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

// Preset sample presets for fast testing during evaluation
const SAMPLE_TEST_PHOTOS = [
  {
    name: 'Pothole on 80ft Road',
    category: 'Pothole' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    hint: 'Pothole',
    icon: AlertTriangle,
    bgClass: 'bg-amber-100/70 text-amber-700 border-amber-200',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    name: 'Garbage Dump on Footpath',
    category: 'Garbage' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    hint: 'Garbage',
    icon: Trash2,
    bgClass: 'bg-rose-100/70 text-rose-700 border-rose-200',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  {
    name: 'Broken Streetlight',
    category: 'Broken Streetlight' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    hint: 'Broken Streetlight',
    icon: Zap,
    bgClass: 'bg-yellow-100/70 text-yellow-700 border-yellow-200',
    badgeClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  },
  {
    name: 'Water Main Leak',
    category: 'Water Leakage' as IssueCategory,
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    hint: 'Water Leakage',
    icon: Droplets,
    bgClass: 'bg-cyan-100/70 text-cyan-700 border-cyan-200',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
];

export const ReportIssueModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addNewIssue,
    issues,
    setSelectedIssueId,
    supportIssue,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Photo & AI, 2: Location, 3: Details & Dup Check, 4: Success
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiDetectionResult | null>(null);

  // Form Fields
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory>('Pothole');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<IssueSeverity>('High');
  const [area, setArea] = useState<string>('Koramangala 4th Block');
  const [streetAddress, setStreetAddress] = useState<string>('80ft Road, Koramangala');
  const [lat, setLat] = useState<number>(12.9902);
  const [lng, setLng] = useState<number>(77.5554);

  // Duplicate Check
  const [duplicateMatch, setDuplicateMatch] = useState<Issue | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState<boolean>(false);

  // Success Result
  const [createdIssue, setCreatedIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Leaflet map reference for Step 2
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isReportModalOpen) {
      setStep(1);
      setPhotoDataUrl('');
      setAiResult(null);
      setSelectedCategory('Pothole');
      setTitle('');
      setDescription('');
      setSeverity('High');
      setArea('Koramangala 4th Block');
      setStreetAddress('80ft Road, Koramangala');
      setLat(12.9902);
      setLng(77.5554);
      setDuplicateMatch(null);
      setShowDuplicateWarning(false);
      setCreatedIssue(null);
    }
  }, [isReportModalOpen]);

  // Leaflet OpenStreetMap in Step 2
  useEffect(() => {
    if (step === 2 && mapRef.current) {
      const timer = setTimeout(() => {
        if (!mapRef.current) return;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: true,
        });

        // Add OpenStreetMap Tile Layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Custom Pin Icon
        const pinIcon = L.divIcon({
          className: 'custom-leaflet-report-pin',
          html: `
            <div style="position: relative; width: 38px; height: 46px; cursor: grab; transform: translate(-50%, -100%);">
              <svg viewBox="0 0 100 120" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 10px rgba(6, 182, 212, 0.6));">
                <path d="M50 115 C50 115 15 72 15 45 C15 22.9 30.7 5 50 5 C69.3 5 85 22.9 85 45 C85 72 50 115 50 115 Z" fill="#06b6d4" stroke="#ffffff" stroke-width="3.5"/>
                <circle cx="50" cy="45" r="18" fill="#ffffff"/>
                <circle cx="50" cy="45" r="11" fill="#0284c7"/>
              </svg>
            </div>
          `,
          iconSize: [38, 46],
          iconAnchor: [19, 46],
        });

        const marker = L.marker([lat, lng], {
          icon: pinIcon,
          draggable: true,
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setLat(Number(pos.lat.toFixed(4)));
          setLng(Number(pos.lng.toFixed(4)));
        });

        map.on('click', (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          setLat(Number(e.latlng.lat.toFixed(4)));
          setLng(Number(e.latlng.lng.toFixed(4)));
        });

        // Ensure map container renders without gray gaps
        map.invalidateSize();
        mapInstanceRef.current = map;
        markerRef.current = marker;
      }, 80);

      return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, [step]);

  // Run AI analysis when photo is uploaded
  const handlePhotoSelected = async (dataUrl: string, categoryHint?: IssueCategory) => {
    setPhotoDataUrl(dataUrl);
    setIsAnalyzingAi(true);

    try {
      const response = await fetch('/api/ai/detect-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          userCategoryHint: categoryHint,
        }),
      });

      const resJson = await response.json();
      if (resJson?.data) {
        const data = resJson.data;
        const validCat = CATEGORIES.includes(data.detectedCategory)
          ? data.detectedCategory
          : categoryHint || 'Pothole';

        setAiResult({
          detectedCategory: validCat,
          confidence: data.confidence || 96,
          severity: data.severity || 'High',
          explanation: data.explanation || 'Visual anomalies detected on Bengaluru roadway.',
          tags: data.tags || ['Civic Issue', 'Bengaluru'],
          suggestedAction: data.suggestedAction,
          estimatedImpact: data.estimatedImpact,
        });

        setSelectedCategory(validCat);
        setSeverity(data.severity || 'High');
        if (!title) {
          setTitle(`${validCat} in ${area.split(' ')[0]}`);
        }
        if (!description) {
          setDescription(data.explanation || `Civic issue regarding ${validCat} reported by citizen.`);
        }
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      // Fallback
      setAiResult({
        detectedCategory: categoryHint || 'Pothole',
        confidence: 94,
        severity: 'High',
        explanation: 'Civic issue detected on municipal roadway.',
      });
      setSelectedCategory(categoryHint || 'Pothole');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handlePhotoSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(Number(latitude.toFixed(4)));
          setLng(Number(longitude.toFixed(4)));
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 16,
              duration: 800,
            });
            markerRef.current.setLngLat([longitude, latitude]);
          }
        },
        () => {
          // Default Koramangala
          setLat(12.9352);
          setLng(77.6245);
        }
      );
    }
  };

  // Check for smart duplicate before final submit
  const checkForDuplicates = () => {
    // Check if any existing issue in the same area has the same category
    const found = issues.find(
      (iss) =>
        iss.category === selectedCategory &&
        (iss.area.toLowerCase().includes(area.split(' ')[0].toLowerCase()) ||
          Math.abs(iss.lat - lat) < 0.008 && Math.abs(iss.lng - lng) < 0.008)
    );

    if (found) {
      setDuplicateMatch(found);
      setShowDuplicateWarning(true);
    } else {
      performSubmission();
    }
  };

  const performSubmission = async () => {
    setIsSubmitting(true);
    try {
      const created = await addNewIssue({
        title: title || `${selectedCategory} in ${area}`,
        description: description || `Reported ${selectedCategory} in ${area}, Bengaluru.`,
        category: selectedCategory,
        severity,
        lat,
        lng,
        area,
        streetAddress,
        imageUrl: photoDataUrl || SAMPLE_TEST_PHOTOS[0].url,
        aiDetection: aiResult || undefined,
      });

      setCreatedIssue(created);
      setStep(4); // Success step
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReportModalOpen) return null;

  return (
    <div
      id="report-issue-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="report-issue-modal-card"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800 font-bold">
              {step === 4 ? '✓' : step}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                {step === 1 && 'Step 1: Upload Photo'}
                {step === 2 && 'Step 2: Pin Location'}
                {step === 3 && 'Step 3: Details & Verification'}
                {step === 4 && 'Report Completed!'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {step === 1 && 'Show us what is wrong with AI visual detection'}
                {step === 2 && 'Move pin to precise Bengaluru coordinates'}
                {step === 3 && 'Review AI severity & submit report'}
                {step === 4 && 'Namma Bengaluru community thanks you'}
              </p>
            </div>
          </div>

          <button
            id="close-report-modal-btn"
            onClick={() => setIsReportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="px-6 pt-3 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s < step
                    ? 'bg-emerald-500'
                    : s === step
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500'
                    : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {/* STEP 1: PHOTO & AI DETECTION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                  Show us what's wrong.
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Upload an image from your device or camera. Gemini AI will automatically detect the issue type, confidence, and severity.
                </p>
              </div>

              {/* Photo Upload Zone */}
              {!photoDataUrl ? (
                <div>
                  <label
                    htmlFor="issue-photo-upload"
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-cyan-50/50 hover:bg-cyan-50 cursor-pointer transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">Click or Drag & Drop photo</span>
                    <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP</span>
                    <input
                      id="issue-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Sample test presets for instant user evaluation */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Or test with a sample Bengaluru issue preset:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_TEST_PHOTOS.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePhotoSelected(sample.url, sample.category)}
                          className="group flex flex-col items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40 text-center transition-all cursor-pointer"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shadow-xs ${sample.bgClass}`}
                          >
                            <sample.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 line-clamp-1 w-full text-center">
                            {sample.name}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md mt-1 border ${sample.badgeClass}`}
                          >
                            {sample.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Photo Preview & AI Analysis Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-60">
                    <img
                      src={photoDataUrl}
                      alt="Uploaded issue"
                      referrerPolicy="no-referrer"
                      className="w-full h-56 object-cover"
                    />
                    <button
                      onClick={() => {
                        setPhotoDataUrl('');
                        setAiResult(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-md backdrop-blur-md"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {isAnalyzingAi && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
                        <span className="text-xs font-bold text-cyan-800">
                          Gemini AI is analyzing image...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Structured Detection Card */}
                  {aiResult && !isAnalyzingAi && (
                    <div
                      id="ai-detection-card"
                      className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-cyan-200">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-700" />
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-900">
                            AI Detection
                          </span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                          {aiResult.confidence}% Confidence
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-bold">
                            Detected Issue
                          </span>
                          <p className="text-sm font-extrabold text-slate-900">
                            {aiResult.detectedCategory}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-bold">
                            Severity Level
                          </span>
                          <p
                            className={`text-sm font-extrabold ${
                              aiResult.severity === 'Critical'
                                ? 'text-rose-700'
                                : aiResult.severity === 'High'
                                ? 'text-orange-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {aiResult.severity}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed bg-white p-2.5 rounded-xl border border-cyan-100 font-medium">
                        "{aiResult.explanation}"
                      </p>

                      {/* Manual Category Override */}
                      <div className="mt-3 pt-2 border-t border-cyan-200">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                          Change Category if AI was inaccurate:
                        </label>
                        <select
                          id="manual-category-select"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value as IssueCategory)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-3">
                <button
                  id="step1-next-btn"
                  disabled={!photoDataUrl || isAnalyzingAi}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Pin Location in Bengaluru
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Click on the map or drag the pin to set the exact spot.
                  </p>
                </div>

                <button
                  id="report-use-my-location"
                  onClick={handleUseMyLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-300 text-cyan-800 text-xs font-bold hover:bg-cyan-100 shadow-xs"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Use My Location</span>
                </button>
              </div>

              {/* Interactive Pin-Drop Map */}
              <div
                ref={mapRef}
                className="w-full h-64 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner"
              />

              {/* Area and Address selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bengaluru Area / Locality:
                  </label>
                  <select
                    id="report-area-select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                  >
                    {BENGALURU_AREAS.map((a) => (
                      <option key={a} value={`${a} 4th Block`}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Street / Landmark:
                  </label>
                  <input
                    id="report-street-input"
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. Near Sony World Signal, 80ft Rd"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-medium">
                <span>Coordinates: {lat}° N, {lng}° E</span>
                <span className="text-cyan-700 font-bold">{area}, Bengaluru</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="step2-next-btn"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20"
                >
                  <span>Next: Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS & SMART DUPLICATE DETECTION */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Smart Duplicate Warning Dialog */}
              {showDuplicateWarning && duplicateMatch && (
                <div
                  id="smart-duplicate-warning-box"
                  className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-md space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-amber-900 font-['Outfit']">
                        This issue may already have been reported nearby!
                      </h5>
                      <p className="text-xs text-slate-700 mt-1 font-medium">
                        A similar <span className="text-slate-900 font-bold">{duplicateMatch.category}</span> was reported ~180m away in {duplicateMatch.area}.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{duplicateMatch.title}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{duplicateMatch.supportersCount} citizens supporting this report</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                      {duplicateMatch.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        supportIssue(duplicateMatch.id);
                        setSelectedIssueId(duplicateMatch.id);
                        setIsReportModalOpen(false);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:opacity-95 shadow-xs"
                    >
                      Support Existing Report (+2 pts)
                    </button>
                    <button
                      onClick={performSubmission}
                      className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 shadow-xs"
                    >
                      Report Anyway
                    </button>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Issue Title:
                  </label>
                  <input
                    id="report-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Pothole Near 4th Block Signal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Description & Hazard Impact:
                  </label>
                  <textarea
                    id="report-desc-input"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the issue and how it affects citizens..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Issue Severity:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SEVERITIES.map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSeverity(sev)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            severity === sev
                              ? 'bg-cyan-100 text-cyan-800 border-cyan-400 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Category Selected:
                    </label>
                    <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-cyan-800 flex items-center justify-between">
                      <span>{selectedCategory}</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">
                        +{selectedCategory === 'Garbage' ? '15' : '10'} pts reward
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  id="final-check-submit-btn"
                  disabled={isSubmitting}
                  onClick={checkForDuplicates}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:opacity-95 shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Check & Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS REWARD */}
          {step === 4 && createdIssue && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-400 to-emerald-400 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-cyan-500/30 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 font-['Outfit']">
                  Report Submitted Successfully!
                </h4>
                <p className="text-sm font-mono text-cyan-700 font-bold mt-1">
                  Issue ID: #{createdIssue.id}
                </p>
                <p className="text-xs text-slate-600 font-medium mt-1 max-w-md mx-auto">
                  "Namma Bengaluru thanks you for keeping our city clean and safe."
                </p>
              </div>

              {/* Awarded Points Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-sm font-black shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>+10 Namma Points Awarded</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  id="view-submitted-issue-btn"
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setSelectedIssueId(createdIssue.id);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 shadow-md"
                >
                  View Reported Issue
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
