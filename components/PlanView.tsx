
import React from 'react';
import { ActivePlan } from '../types';
import { RefreshCw, Map, Clock, Footprints, Save, Coffee } from 'lucide-react';

interface PlanViewProps {
  plan: ActivePlan;
  onRecalculate: () => void;
  onSave: () => void;
  isLoading: boolean;
}

export const PlanView: React.FC<PlanViewProps> = ({ plan, onRecalculate, onSave, isLoading }) => {
  // If no route but galleries selected, we rely on the parent logic or just show "Recalculate to see route"
  // But typically the AI returns a basic route. If pure empty:
  if (plan.selected_gallery_ids.length === 0 && plan.route.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400 p-8 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          <Map size={24} className="text-stone-300" />
        </div>
        <h3 className="text-stone-900 font-medium text-lg mb-2">Your plan is empty</h3>
        <p className="max-w-xs mx-auto text-sm">
          Switch to "Suggest" mode to add galleries, or ask HALFART to "Add a coffee stop at 2pm".
        </p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Plan Summary Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">
              <Clock size={12} />
              <span>{plan.date_label || "Today"} • {plan.time_window.start || "12:00"} - {plan.time_window.end || "18:00"}</span>
            </div>
            <h2 className="text-2xl font-serif text-stone-900">{plan.area_description || "Custom Route"}</h2>
            <p className="text-stone-500 text-sm">
              {plan.route.length} Stops • {plan.selected_gallery_ids.length} Galleries
            </p>
          </div>
          
          <div className="flex gap-2">
             <button 
              onClick={onSave}
              className="flex items-center gap-2 bg-white border border-stone-200 text-stone-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button 
              onClick={onRecalculate}
              disabled={isLoading}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Optimizing..." : "Recalculate"}
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-4 md:pl-8 space-y-0">
        {/* Vertical Line */}
        <div className="absolute left-[27px] md:left-[43px] top-4 bottom-4 w-0.5 bg-stone-200"></div>

        {plan.route.map((stop, index) => (
          <div key={stop.id || index} className="relative flex gap-6 md:gap-8 group">
            
            {/* Timeline Node */}
            <div className="relative z-10 flex flex-col items-center pt-1">
              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-sm ${stop.type === 'custom' ? 'bg-amber-500' : 'bg-stone-900'}`}></div>
              {index !== plan.route.length - 1 && (
                <div className="flex-1 flex flex-col justify-center py-4">
                   {stop.walk_minutes_from_previous !== undefined && (
                     <div className="flex flex-col items-center bg-white py-1">
                       <Footprints size={12} className="text-stone-300 mb-1" />
                       <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">
                         {stop.walk_minutes_from_previous ? `${stop.walk_minutes_from_previous}m walk` : 'Walk'}
                       </span>
                     </div>
                   )}
                </div>
              )}
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-8">
              <div className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
                stop.type === 'custom' ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-stone-100'
              }`}>
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                  <h3 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
                    {stop.type === 'custom' && <Coffee size={16} className="text-amber-600" />}
                    {stop.label}
                  </h3>
                  <div className="text-xs font-mono text-stone-500 bg-stone-50 px-2 py-1 rounded self-start border border-stone-200">
                    {stop.eta || '--:--'} – {stop.etd || '--:--'}
                  </div>
                </div>
                {stop.neighborhood && (
                  <div className="flex items-center text-xs text-stone-500 mb-2 uppercase tracking-wider">
                    <Map size={12} className="mr-1" /> {stop.neighborhood}
                  </div>
                )}
                {stop.description && (
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {stop.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* End Node */}
        <div className="relative flex gap-6 md:gap-8">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-stone-300"></div>
          </div>
          <div className="text-xs text-stone-400 uppercase tracking-widest pt-0.5">End of route</div>
        </div>
      </div>
    </div>
  );
};
