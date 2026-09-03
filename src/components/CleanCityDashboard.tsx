import {
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Flame,
  Globe,
  HeartHandshake,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { CleanupDrive } from '../types';

export const CleanCityDashboard: React.FC = () => {
  const {
    cleanupDrives,
    joinCleanupDrive,
    submitCleanupProof,
    user,
    setIsReportModalOpen,
    setActiveTab,
    setSelectedCategory,
    issues,
    setSelectedIssueId,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'drives' | 'verify' | 'hotspots'>('drives');

  // Verify Cleanup Modal / Form State
  const [beforePhoto, setBeforePhoto] = useState<string>('');
  const [afterPhoto, setAfterPhoto] = useState<string>('');
  const [cleanupArea, setCleanupArea] = useState<string>('Koramangala');
  const [cleanupNotes, setCleanupNotes] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    points: number;
    wasteKg: number;
    notes?: string;
  } | null>(null);

  // Preset sample before/after pairs for instant user demonstration
  const SAMPLE_CLEANUP_PAIRS = [
    {
      title: 'HSR Sector 2 Footpath',
      area: 'HSR Layout',
      before: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      after: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Indiranagar 100ft Road Corner',
      area: 'Indiranagar',
      before: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
      after: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'before' | 'after'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'before') setBeforePhoto(reader.result as string);
        if (type === 'after') setAfterPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunVerification = async () => {
    if (!beforePhoto || !afterPhoto) return;
    setIsVerifying(true);
    try {
      const res = await submitCleanupProof({
        beforeImage: beforePhoto,
        afterImage: afterPhoto,
        area: cleanupArea,
        notes: cleanupNotes,
      });
      setVerificationResult({
        points: res.pointsEarned,
        wasteKg: res.wasteKgEstimate,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const garbageHotspots = issues.filter(
    (iss) => (iss.category === 'Garbage' || iss.category === 'Illegal Dumping') && iss.status !== 'Resolved'
  );

  return (
    <div id="clean-city-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner with Futuristic Clean Bengaluru Theme */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Namma Clean Bengaluru Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-['Outfit'] tracking-tight leading-tight">
            Let's Make Bengaluru <span className="font-['Cairo_Play'] text-emerald-600">Cleaner</span>.
          </h1>

          <p className="text-sm sm:text-base font-bold text-emerald-700 font-['Cairo_Play']">
            DON'T JUST REPORT WASTE. HELP REMOVE IT.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
            Join weekend cleanup squads, organize neighborhood spot-fixes, and upload Before & After proof. Earn 50 Namma Points and community hero badges for verified transformations.
          </p>

          {/* 3 Main Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              id="clean-report-garbage-btn"
              onClick={() => {
                setSelectedCategory('Garbage');
                setIsReportModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Report Garbage Dump (+15 pts)</span>
            </button>

            <button
              id="clean-verify-proof-btn"
              onClick={() => setActiveSubTab('verify')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 shadow-xs"
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Before & After Cleanup (+50 pts)</span>
            </button>

            <button
              id="clean-find-drives-btn"
              onClick={() => setActiveSubTab('drives')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:text-slate-900 shadow-xs"
            >
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Join Cleanup Squads</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('drives')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'drives'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Active Cleanup Drives ({cleanupDrives.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('verify')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'verify'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>AI Before & After Verification</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hotspots')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'hotspots'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Garbage Hotspots ({garbageHotspots.length})</span>
        </button>
      </div>

      {/* TAB 1: CLEANUP DRIVES */}
      {activeSubTab === 'drives' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Bengaluru Volunteer Cleanup Drives
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Join hands with fellow Bengalureans. Safety gear & garbage bags provided at location.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Earn +50 Namma Points per drive
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cleanupDrives.map((drive) => {
              const isJoined = drive.joinedUserIds.includes(user.id);
              const progressPct = Math.min(
                100,
                Math.round((drive.participantsCount / drive.targetParticipants) * 100)
              );

              return (
                <div
                  key={drive.id}
                  id={`cleanup-card-${drive.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {drive.area}
                      </span>
                      <span className="text-xs font-mono text-cyan-700 font-bold">
                        {drive.date}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-['Outfit'] group-hover:text-emerald-700 transition-colors">
                      {drive.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
                      {drive.description}
                    </p>

                    <div className="space-y-1 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">{drive.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{drive.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                        <span>Host: {drive.hostOrg}</span>
                      </div>
                    </div>

                    {/* Equipment Provided */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">
                        Provided Gear:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {drive.equipmentProvided.map((eq, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar of Volunteers */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Volunteer Slots:</span>
                        <span className="font-bold text-slate-900">
                          {drive.participantsCount} / {drive.targetParticipants} joined
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> +50 pts
                    </span>

                    <button
                      id={`join-drive-${drive.id}`}
                      onClick={() => joinCleanupDrive(drive.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isJoined
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isJoined ? '✓ Registered' : 'Join Cleanup Squad'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AI BEFORE & AFTER VERIFICATION */}
      {activeSubTab === 'verify' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-cyan-800 font-['Cairo_Play']">
              AI Before & After Cleanup Verification
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
              Cleaned up garbage in your street or participated in a spot-fix? Upload both photos. Gemini AI will verify the transformation and credit +50 Namma Points instantly.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
            <p className="text-slate-600 font-bold mb-2">Or test with demo before/after pair:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_CLEANUP_PAIRS.map((pair, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBeforePhoto(pair.before);
                    setAfterPhoto(pair.after);
                    setCleanupArea(pair.area);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 text-left transition-all"
                >
                  <div className="flex -space-x-2">
                    <img src={pair.before} alt="Before" className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300" />
                    <img src={pair.after} alt="After" className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">{pair.title}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">Load sample photos</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Side by Side Upload Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BEFORE PHOTO */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                1. Before Cleanup (Garbage Present)
              </span>

              {beforePhoto ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                  <img src={beforePhoto} alt="Before" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setBeforePhoto('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-slate-800 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 cursor-pointer transition-all">
                  <Camera className="w-6 h-6 text-rose-600 mb-2" />
                  <span className="text-xs font-bold text-slate-900">Upload Before Photo</span>
                  <span className="text-[10px] text-slate-500">Shows waste on ground</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'before')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* AFTER PHOTO */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                2. After Cleanup (Clean Ground)
              </span>

              {afterPhoto ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                  <img src={afterPhoto} alt="After" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setAfterPhoto('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-slate-800 shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 cursor-pointer transition-all">
                  <Sparkles className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs font-bold text-slate-900">Upload After Photo</span>
                  <span className="text-[10px] text-slate-500">Shows cleaned area</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'after')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Area & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Area in Bengaluru:
              </label>
              <select
                value={cleanupArea}
                onChange={(e) => setCleanupArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium"
              >
                {BENGALURU_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Optional Notes (volunteers, bags filled):
              </label>
              <input
                type="text"
                value={cleanupNotes}
                onChange={(e) => setCleanupNotes(e.target.value)}
                placeholder="e.g. 3 bags filled with 2 volunteers"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Verification Result Card */}
          {verificationResult && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-lg space-y-3 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  Transformation Verified by AI!
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Before and After comparison confirmed removal of waste in {cleanupArea}. Estimated waste removed: ~{verificationResult.wasteKg} kg.
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-emerald-200">
                <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                  +{verificationResult.points} Namma Points Added
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                  Clean City Hero Badge Progress +1
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="run-ai-verification-btn"
            disabled={!beforePhoto || !afterPhoto || isVerifying}
            onClick={handleRunVerification}
            className="w-full py-3 rounded-2xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is analyzing before & after photos...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Verification & Claim +50 Points</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 3: GARBAGE HOTSPOTS */}
      {activeSubTab === 'hotspots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Active Garbage Hotspots in Bengaluru
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Needs volunteer citizen squads
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garbageHotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                onClick={() => setSelectedIssueId(hotspot.id)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700">{hotspot.category}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">#{hotspot.id}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] line-clamp-1 group-hover:text-cyan-700">
                  {hotspot.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">{hotspot.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-medium">{hotspot.area}</span>
                  <span className="text-cyan-700 font-bold">{hotspot.supportersCount} supporters</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
