import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { IssueCategory, IssueSeverity, IssueStatus } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    issues,
    setSelectedIssueId,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');

  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = iss.title.toLowerCase().includes(q);
        const matchesDesc = iss.description.toLowerCase().includes(q);
        const matchesArea = iss.area.toLowerCase().includes(q);
        const matchesAddress = iss.streetAddress.toLowerCase().includes(q);
        const matchesCat = iss.category.toLowerCase().includes(q);
        const matchesId = iss.id.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesAddress && !matchesCat && !matchesId) {
          return false;
        }
      }

      if (categoryFilter !== 'All' && iss.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && iss.status !== statusFilter) return false;
      if (severityFilter !== 'All' && iss.severity !== severityFilter) return false;
      if (areaFilter !== 'All' && !iss.area.toLowerCase().includes(areaFilter.toLowerCase())) return false;

      return true;
    });
  }, [issues, searchQuery, categoryFilter, statusFilter, severityFilter, areaFilter]);

  // Breakdown counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredIssues.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [filteredIssues]);

  if (!isSearchOpen) return null;

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="global-search-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-cyan-600 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, locations, streets (e.g. 'pothole koramangala', 'garbage')..."
            className="w-full bg-transparent border-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage">Garbage</option>
            <option value="Broken Streetlight">Streetlights</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Traffic Signal">Traffic Signals</option>
            <option value="Illegal Dumping">Illegal Dumping</option>
            <option value="Pollution">Pollution</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Area Filter */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Areas</option>
            {BENGALURU_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {(categoryFilter !== 'All' || statusFilter !== 'All' || severityFilter !== 'All' || areaFilter !== 'All') && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
                setSeverityFilter('All');
                setAreaFilter('All');
              }}
              className="text-cyan-700 hover:underline text-[11px] font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dynamic Breakdown Summary */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              {filteredIssues.length} issues found
            </span>
            {Object.keys(categoryCounts).length > 0 && (
              <span className="text-slate-500 hidden sm:inline">
                ({Object.entries(categoryCounts)
                  .map(([cat, count]) => `${count} ${cat}`)
                  .join(', ')})
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Bengaluru Ward Explorer</span>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500">
              <p className="text-sm font-medium">No issues found matching your query.</p>
              <p className="text-xs">Try searching for "Koramangala", "Indiranagar", "Pothole", or "Garbage".</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSelectedIssueId(issue.id);
                }}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-700 font-bold">
                        #{issue.id}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {issue.category}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                          issue.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate font-['Outfit'] group-hover:text-cyan-700 transition-colors mt-0.5">
                      {issue.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                      <span>{issue.area} • {issue.streetAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    {issue.supportersCount} supporters
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
