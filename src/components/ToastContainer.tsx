import { AlertCircle, Award, CheckCircle2, Info, X } from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'points' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                <Award className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800">
                <Info className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'warning' && (
              <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900 font-['Outfit']">{toast.title}</h4>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
