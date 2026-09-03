import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BENGALURU_AREAS } from '../data/bengaluruData';
import { IssueCategory, IssueStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    issues,
    updateIssueStatus,
    stats,
    setSelectedIssueId,
  } = useApp();

  const [searchAdmin, setSearchAdmin] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredIssues = issues.filter((iss) => {
    if (searchAdmin.trim()) {
      const q = searchAdmin.toLowerCase();
      if (
        !iss.title.toLowerCase().includes(q) &&
        !iss.id.toLowerCase().includes(q) &&
        !iss.area.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (selectedWard !== 'All' && !iss.area.toLowerCase().includes(selectedWard.toLowerCase())) return false;
    if (selectedCat !== 'All' && iss.category !== selectedCat) return false;
    if (statusFilter !== 'All' && iss.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (issueId: string, newStatus: IssueStatus) => {
    updateIssueStatus(
      issueId,
      newStatus,
      `Official status changed to "${newStatus}" by BBMP Civic Control Unit.`
    );
  };

  return (
    <div id="admin-dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-purple-50 border border-purple-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider border border-purple-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>BBMP & Municipal Civic Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            Bengaluru Civic Dispatch & Resolution Control
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Real-time management portal for municipal officers, ward engineers, and civic leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-xs">
            198 Wards Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">Total Reports</span>
          <p className="text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
            {issues.length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-cyan-700 font-bold">Open / Reported</span>
          <p className="text-2xl font-black text-cyan-700 font-['Outfit'] mt-1">
            {issues.filter((i) => i.status === 'Reported').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-amber-700 font-bold">In Progress</span>
          <p className="text-2xl font-black text-amber-700 font-['Outfit'] mt-1">
            {issues.filter((i) => i.status === 'In Progress').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-bold">Resolved</span>
          <p className="text-2xl font-black text-emerald-700 font-['Outfit'] mt-1">
            {issues.filter((i) => i.status === 'Resolved').length}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchAdmin}
            onChange={(e) => setSearchAdmin(e.target.value)}
            placeholder="Search by ID, title, or area..."
            className="w-full bg-transparent border-none text-xs text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Ward filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium text-xs"
          >
            <option value="All">All BBMP Areas</option>
            {BENGALURU_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Verified">Verified</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View (shown on screens < md) */}
      <div className="md:hidden space-y-3">
        {filteredIssues.map((iss) => (
          <div
            key={iss.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={iss.imageUrl}
                alt={iss.title}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-cyan-700 text-xs">#{iss.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      iss.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : iss.severity === 'High'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {iss.severity}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate font-['Outfit'] mt-0.5">
                  {iss.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {iss.area} • <span className="text-purple-700 font-semibold">{iss.assignedAuthority || 'BBMP'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <select
                value={iss.status}
                onChange={(e) => handleStatusChange(iss.id, e.target.value as IssueStatus)}
                className={`flex-1 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                  iss.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : iss.status === 'In Progress'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                }`}
              >
                <option value="Reported">Reported</option>
                <option value="Verified">Verified</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button
                onClick={() => setSelectedIssueId(iss.id)}
                className="min-h-[40px] px-4 py-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 border border-cyan-300 rounded-xl hover:bg-cyan-50 shadow-xs"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Management Table (shown on screens >= md) */}
      <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Issue ID & Photo</th>
                <th className="p-4">Title & Details</th>
                <th className="p-4">Area & Authority</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Status Dispatch</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((iss) => (
                <tr key={iss.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={iss.imageUrl}
                        alt={iss.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-mono font-bold text-cyan-700">#{iss.id}</span>
                        <p className="text-[10px] text-slate-500 font-medium">{iss.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 max-w-xs">
                    <p className="font-bold text-slate-900 truncate font-['Outfit']">{iss.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{iss.description}</p>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <p className="font-semibold text-slate-800">{iss.area}</p>
                    <p className="text-[10px] text-purple-700 font-semibold">{iss.assignedAuthority || 'BBMP'}</p>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        iss.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : iss.severity === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {iss.severity}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <select
                      value={iss.status}
                      onChange={(e) => handleStatusChange(iss.id, e.target.value as IssueStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                        iss.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : iss.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-300'
                      }`}
                    >
                      <option value="Reported">Reported</option>
                      <option value="Verified">Verified</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedIssueId(iss.id)}
                      className="px-3 py-1 text-xs font-bold text-cyan-700 hover:text-cyan-800 border border-cyan-300 rounded-lg hover:bg-cyan-50 shadow-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
