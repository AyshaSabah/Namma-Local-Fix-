import {
  AlertOctagon,
  AlertTriangle,
  Dog,
  Droplets,
  Flame,
  Lamp,
  Layers,
  Sparkles,
  TrafficCone,
  Trash2,
  TreePine,
  Wind,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { IssueCategory } from '../types';

export const CategoryFilterGrid: React.FC = () => {
  const { setSelectedCategory, setActiveTab, issues } = useApp();

  const categories: {
    id: IssueCategory;
    title: string;
    icon: any;
    color: string;
    desc: string;
  }[] = [
    {
      id: 'Pothole',
      title: 'Potholes & Roads',
      icon: AlertTriangle,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      desc: 'Craters, uneven asphalt & road cave-ins',
    },
    {
      id: 'Garbage',
      title: 'Garbage & Litter',
      icon: Trash2,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      desc: 'Uncollected waste, overflowing bins & street litter',
    },
    {
      id: 'Broken Streetlight',
      title: 'Broken Streetlights',
      icon: Lamp,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      desc: 'Dark streets, flickering bulbs & damaged poles',
    },
    {
      id: 'Water Leakage',
      title: 'Water Leakage',
      icon: Droplets,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      desc: 'Burst BWSSB pipelines & clogged drains',
    },
    {
      id: 'Traffic Signal',
      title: 'Traffic Signals',
      icon: TrafficCone,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      desc: 'Dead timers, missing signage & signal blackouts',
    },
    {
      id: 'Illegal Dumping',
      title: 'Illegal Dumping',
      icon: AlertOctagon,
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      desc: 'Commercial debris & nighttime dumping',
    },
    {
      id: 'Pollution',
      title: 'Lake & Air Quality',
      icon: Wind,
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      desc: 'Frothing lakes, toxic burning & smoke',
    },
    {
      id: 'Overgrown Area',
      title: 'Parks & Footpaths',
      icon: TreePine,
      color: 'bg-lime-100 text-lime-800 border-lime-200',
      desc: 'Broken walkways, wild vegetation & blockages',
    },
  ];

  const getCount = (cat: IssueCategory) => {
    return issues.filter((i) => i.category === cat).length;
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Civic Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              What's happening around Bengaluru?
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('map');
            }}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
          >
            View all categories on map →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = getCount(cat.id);
            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('map');
                }}
                className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md text-left transition-all group flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between w-full mb-2 sm:mb-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${cat.color} border flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:text-cyan-800 group-hover:bg-cyan-50 border border-slate-200 truncate">
                    {count} active
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit'] group-hover:text-cyan-700 transition-colors line-clamp-1 sm:line-clamp-none">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
