import {
  Award,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck,
  Flame,
  Globe,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const AboutView: React.FC = () => {
  const { setActiveTab, setIsReportModalOpen } = useApp();

  const steps = [
    { title: '1. SEE', desc: 'Spot civic hazards, potholes, or garbage on Bengaluru streets.', icon: Eye, color: 'text-cyan-700 bg-cyan-100 border-cyan-200' },
    { title: '2. REPORT', desc: 'Snap photo with camera. Gemini AI detects category & severity instantly.', icon: Sparkles, color: 'text-blue-700 bg-blue-100 border-blue-200' },
    { title: '3. VERIFY', desc: 'Community cross-verifies & checks duplicate reports within 300m.', icon: FileCheck, color: 'text-purple-700 bg-purple-100 border-purple-200' },
    { title: '4. SUPPORT', desc: 'Neighbors upvote issues to escalate BBMP ward priority.', icon: Users, color: 'text-pink-700 bg-pink-100 border-pink-200' },
    { title: '5. ACT', desc: 'Join volunteer cleanups or municipal maintenance squads.', icon: HeartHandshake, color: 'text-orange-700 bg-orange-100 border-orange-200' },
    { title: '6. FIX', desc: 'Physical repair or trash removal executed on the ground.', icon: CheckCircle2, color: 'text-amber-700 bg-amber-100 border-amber-200' },
    { title: '7. EARN', desc: 'Receive Namma Points, unlock badges & top the Bengaluru leaderboard.', icon: Award, color: 'text-emerald-700 bg-emerald-100 border-emerald-200' },
    { title: '8. IMPROVE', desc: 'Live civic impact metrics show neighborhood transformation.', icon: TrendingUp, color: 'text-teal-700 bg-teal-100 border-teal-200' },
  ];

  return (
    <div id="about-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <Logo size="lg" showTagline={true} className="justify-center" />

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] tracking-tight">
          "Don't just report your city's problems.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 font-['Cairo_Play']">
            Help fix them."
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Namma Local Fix is Bengaluru's next-generation civic action platform. We bridge the gap between active citizens, volunteer squads, and municipal authorities through intelligent technology and gamified community impact.
        </p>
      </div>

      {/* The 8-Step Transformation Loop */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
            The Civic Transformation Engine
          </span>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit'] mt-1">
            How Namma Local Fix Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-2 shadow-xs"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-2.5 ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Mission Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center border border-cyan-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
            AI-Assisted Verification
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Gemini vision models auto-classify street defects, prevent duplicate entries, and verify genuine before/after cleanup transformations.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
            Action-Oriented Cleanups
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Instead of passive complaints, citizens mobilize into weekend cleanup squads to remove thousands of kilograms of road waste.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
            Namma Civic Reputation
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Points, level titles, and verified badges turn active citizenship into a celebrated civic culture across Karnataka.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-50 via-sky-50 to-emerald-50 border border-slate-200 text-center space-y-4 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">
          Ready to transform your neighborhood?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
          Start by reporting a civic defect or joining the next community cleanup drive in your ward.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 shadow-lg shadow-cyan-500/20"
          >
            + Report First Issue
          </button>
          <button
            onClick={() => setActiveTab('cleancity')}
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs"
          >
            Explore Cleanups
          </button>
        </div>
      </div>
    </div>
  );
};
