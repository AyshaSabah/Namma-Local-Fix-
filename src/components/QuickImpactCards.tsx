import { Footprints, Shield, Sparkles, Trees } from 'lucide-react';
import React from 'react';

export const QuickImpactCards: React.FC = () => {
  const impactCards = [
    {
      id: 'cleaner-streets',
      title: 'Cleaner Streets',
      desc: 'Rapid waste removal and citizen spot-fix drives across all BBMP wards.',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badge: '4,350+ spots fixed',
    },
    {
      id: 'safer-roads',
      title: 'Safer Roads',
      desc: 'Fixing hazardous potholes, dark streetlights, and malfunctioning traffic signals.',
      icon: Shield,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      badge: '2,800+ potholes filled',
    },
    {
      id: 'better-living',
      title: 'Better Living',
      desc: 'Restoring public parks, lake surroundings, and resolving chronic water leaks.',
      icon: Footprints,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      badge: '1.4M L water saved',
    },
    {
      id: 'greener-bengaluru',
      title: 'Greener Bengaluru',
      desc: 'Protecting green covers, clearing illegal plastic dumps, and tree canopy health.',
      icon: Trees,
      color: 'bg-lime-100 text-lime-800 border-lime-200',
      badge: '68 tonnes waste cleared',
    },
  ];

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {impactCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                id={`impact-card-${card.id}`}
                className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${card.color} border flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[90px] sm:max-w-none">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Outfit'] group-hover:text-cyan-700 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
