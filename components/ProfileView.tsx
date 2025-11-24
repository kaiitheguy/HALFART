
import React from 'react';
import { UserProfile, SavedPlan } from '../types';
import { User, Bookmark, MapPin, Palette, Heart, Clock } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile }) => {
  return (
    <div className="pb-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
        <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center text-white">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-stone-900">Your Profile</h2>
          <p className="text-stone-500 text-sm">Preferences & History</p>
        </div>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Areas */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-stone-900 font-medium">
            <MapPin size={18} />
            <h3>Home Areas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.home_areas.length > 0 ? (
              profile.home_areas.map((area, i) => (
                <span key={i} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                  {area}
                </span>
              ))
            ) : <span className="text-stone-400 text-sm italic">No areas saved yet.</span>}
          </div>
        </div>

        {/* Mediums */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-stone-900 font-medium">
            <Palette size={18} />
            <h3>Preferred Mediums</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.preferred_mediums.length > 0 ? (
              profile.preferred_mediums.map((m, i) => (
                <span key={i} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                  {m}
                </span>
              ))
            ) : <span className="text-stone-400 text-sm italic">No mediums saved yet.</span>}
          </div>
        </div>

        {/* Vibes */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-stone-900 font-medium">
            <Heart size={18} />
            <h3>Vibes</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.preferred_vibes.length > 0 ? (
              profile.preferred_vibes.map((v, i) => (
                <span key={i} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                  {v}
                </span>
              ))
            ) : <span className="text-stone-400 text-sm italic">No vibes saved yet.</span>}
          </div>
        </div>

        {/* Walking */}
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-stone-900 font-medium">
            <Clock size={18} />
            <h3>Max Walk</h3>
          </div>
          <p className="text-stone-600 text-sm">
            {profile.default_max_walk_minutes} minutes between stops
          </p>
        </div>
      </div>

      {/* Saved Plans */}
      <div>
        <h3 className="text-xl font-serif text-stone-900 mb-4 flex items-center gap-2">
          <Bookmark size={20} />
          Saved Plans
        </h3>
        {profile.saved_plans.length === 0 ? (
          <div className="text-stone-400 text-sm italic bg-stone-50 p-6 rounded-xl border border-stone-100 text-center">
            No saved plans yet. Build a route and ask HALFART to save it.
          </div>
        ) : (
          <div className="space-y-4">
            {profile.saved_plans.map((plan) => (
              <div key={plan.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-stone-900">{plan.title || "Untitled Plan"}</h4>
                    <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">
                      {plan.date_label} • {plan.area_description}
                    </p>
                  </div>
                  <span className="bg-stone-100 text-stone-500 text-xs px-2 py-1 rounded-md">
                    {plan.route.length} stops
                  </span>
                </div>
                {plan.notes && (
                  <p className="mt-3 text-sm text-stone-600 italic bg-stone-50 p-2 rounded">
                    "{plan.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
