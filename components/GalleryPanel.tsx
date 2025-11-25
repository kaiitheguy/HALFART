
import React, { useState } from 'react';
import { Gallery, ActivePlan, UserProfile } from '../types';
import { GalleryCard } from './GalleryCard';
import { PlanView } from './PlanView';
import { ProfileView } from './ProfileView';
import { LayoutGrid, Map, User } from 'lucide-react';

interface GalleryPanelProps {
  galleries: Gallery[];
  activePlan: ActivePlan;
  userProfile: UserProfile;
  onTogglePlan: (gallery: Gallery) => void;
  onRecalculateRoute: () => void;
  onSavePlan: () => void;
  isLoading: boolean;
}

type ViewMode = 'suggest' | 'plan' | 'profile';

export const GalleryPanel: React.FC<GalleryPanelProps> = ({ 
  galleries, 
  activePlan, 
  userProfile,
  onTogglePlan,
  onRecalculateRoute,
  onSavePlan,
  isLoading
}) => {
  const [mode, setMode] = useState<ViewMode>('suggest');

  // We no longer strictly filter out galleries without images. 
  // Instead we rely on the GalleryCard to render a nice placeholder if needed.
  // We can still filter out purely empty/broken entries if desired, but general search results should show.
  const visibleGalleries = galleries;

  return (
    <div className="flex-1 bg-stone-50 h-[50vh] md:h-full overflow-y-auto relative flex flex-col">
      {/* Top Bar with Tabs */}
      <div className="sticky top-0 z-20 bg-stone-50/90 backdrop-blur-md px-4 md:px-8 py-4 border-b border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900">
            {mode === 'profile' ? 'My Profile' : 'NYC Galleries'}
          </h2>
          <p className="text-stone-500 text-sm mt-1 hidden md:block">
            {mode === 'suggest' && 'Suggested Places to Explore'}
            {mode === 'plan' && 'Your Route for Today'}
            {mode === 'profile' && 'Preferences & Saved Plans'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="bg-stone-200/50 p-1 rounded-full flex items-center font-medium text-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setMode('suggest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
              mode === 'suggest' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <LayoutGrid size={16} />
            Suggest
          </button>
          <button
            onClick={() => setMode('plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
              mode === 'plan' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Map size={16} />
            Plan
            {activePlan.selected_gallery_ids.length > 0 && (
              <span className="bg-stone-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                {activePlan.selected_gallery_ids.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMode('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
              mode === 'profile' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <User size={16} />
            Profile
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1">
        {mode === 'suggest' && (
          visibleGalleries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center max-w-md mx-auto min-h-[300px]">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mb-6">
                <LayoutGrid size={32} className="text-stone-500" />
              </div>
              <h3 className="text-lg font-medium text-stone-700 mb-2">
                Ready to Explore?
              </h3>
              <p className="leading-relaxed text-sm">
                Tell HALFART where you'll be (e.g., "Afternoon in Chelsea") and I'll find the current shows for you.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleGalleries.map((gallery) => {
                const isInPlan = activePlan.selected_gallery_ids.includes(gallery.id);
                return (
                  <GalleryCard 
                    key={gallery.id} 
                    gallery={gallery} 
                    isInPlan={isInPlan}
                    onTogglePlan={onTogglePlan}
                  />
                );
              })}
            </div>
          )
        )}
        
        {mode === 'plan' && (
          <PlanView 
            plan={activePlan} 
            onRecalculate={onRecalculateRoute}
            onSave={onSavePlan}
            isLoading={isLoading} 
          />
        )}

        {mode === 'profile' && (
          <ProfileView profile={userProfile} />
        )}
      </div>
      
      {/* Footer attribution */}
      {mode !== 'plan' && (
        <div className="p-4 md:p-8 text-center text-stone-300 text-xs mt-auto">
          Exhibition data sourced via Google Search
        </div>
      )}
    </div>
  );
};
