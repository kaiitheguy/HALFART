
import React from 'react';
import { Gallery } from '../types';
import { MapPin, Calendar, ExternalLink, Info, Plus, Check, Palette, Box, Camera, Layers, Activity } from 'lucide-react';

interface GalleryCardProps {
  gallery: Gallery;
  isInPlan: boolean;
  onTogglePlan: (gallery: Gallery) => void;
}

const getPlaceholderIcon = (category?: string) => {
  switch (category) {
    case 'painting': return <Palette size={40} className="text-orange-300 opacity-50" />;
    case 'sculpture': return <Box size={40} className="text-slate-300 opacity-50" />;
    case 'photo': return <Camera size={40} className="text-stone-300 opacity-50" />;
    case 'installation': return <Layers size={40} className="text-indigo-300 opacity-50" />;
    case 'performance': return <Activity size={40} className="text-pink-300 opacity-50" />;
    case 'mixed': return <Activity size={40} className="text-emerald-300 opacity-50" />;
    default: return <span className="text-4xl font-serif opacity-20 text-stone-300">Art</span>;
  }
};

const getPlaceholderBackground = (category?: string) => {
  switch (category) {
    case 'painting': return 'bg-gradient-to-br from-orange-50 to-amber-100';
    case 'sculpture': return 'bg-gradient-to-br from-slate-50 to-stone-100';
    case 'photo': return 'bg-gradient-to-br from-stone-100 to-stone-300';
    case 'installation': return 'bg-gradient-to-br from-indigo-50 to-violet-100';
    case 'performance': return 'bg-gradient-to-br from-pink-50 to-rose-100';
    case 'mixed': return 'bg-gradient-to-br from-emerald-50 to-teal-100';
    default: return 'bg-stone-100';
  }
};

export const GalleryCard: React.FC<GalleryCardProps> = ({ gallery, isInPlan, onTogglePlan }) => {
  const activeShow = gallery.exhibitions[0];
  
  // Prioritize specific exhibition data
  const displayImage = activeShow?.image_url || gallery.imageUrl;
  const displayPlaceholderCategory = activeShow?.placeholder_category || gallery.placeholder_category;
  
  // URL Logic: Prefer specific exhibition URL, fallback to generic url
  const displayUrl = activeShow?.exhibition_url || activeShow?.url || gallery.url;
  
  // Only show "View Exhibition" if we have a specific exhibition URL
  const isExhibitionLink = !!(activeShow?.exhibition_url);
  const linkLabel = isExhibitionLink ? "View Exhibition" : "Visit Website";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full relative overflow-hidden group">
      
      {/* Image Area */}
      <div className={`h-48 relative overflow-hidden ${!displayImage ? getPlaceholderBackground(displayPlaceholderCategory) : 'bg-stone-200'}`}>
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={activeShow?.title || gallery.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {getPlaceholderIcon(displayPlaceholderCategory)}
            {displayPlaceholderCategory && (
               <span className="text-[10px] uppercase tracking-widest text-stone-400 mt-2 font-medium">
                 {displayPlaceholderCategory}
               </span>
            )}
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
           <div className={`
            px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm
            ${gallery.status === 'active' 
              ? 'bg-white/90 text-emerald-700' 
              : gallery.status === 'inactive'
              ? 'bg-stone-100/90 text-stone-500'
              : 'bg-amber-50/90 text-amber-700'
            }
          `}>
            {gallery.status === 'active' ? 'On View' : gallery.status === 'inactive' ? 'Closed' : 'Unknown'}
          </div>
        </div>

        {/* Add/Remove Button */}
        <button
          onClick={() => onTogglePlan(gallery)}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10 ${
            isInPlan 
              ? 'bg-stone-900 text-white hover:bg-stone-800' 
              : 'bg-white text-stone-900 hover:bg-stone-50'
          }`}
          title={isInPlan ? "Remove from plan" : "Add to plan"}
        >
          {isInPlan ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="text-xl font-serif font-semibold text-stone-900 leading-tight">
            {gallery.name}
          </h3>
          <div className="flex items-center text-stone-500 text-sm mt-2">
            <MapPin size={14} className="mr-1" />
            <span>{gallery.neighborhood}</span>
          </div>
        </div>

        {/* Exhibition Details */}
        <div className="flex-grow">
          {gallery.has_active_exhibition && activeShow ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-stone-900 text-base leading-snug">
                  {activeShow.title}
                </h4>
                <div className="flex items-center text-stone-500 text-xs mt-1 uppercase tracking-wide">
                  <Calendar size={12} className="mr-1" />
                  <span>{activeShow.dates}</span>
                </div>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                {activeShow.description}
              </p>
            </div>
          ) : (
            <div className="h-24 flex flex-col justify-center items-center text-stone-400 text-xs py-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <Info size={16} className="mb-2 opacity-50" />
              <p>No confirmed active exhibition.</p>
            </div>
          )}
        </div>

        {/* Footer / Vibes */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <div className="flex flex-wrap gap-2 mb-3">
            {gallery.vibes?.map((vibe, idx) => (
              <span key={idx} className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md uppercase tracking-wide">
                {vibe}
              </span>
            ))}
             {gallery.region_tags?.map((region, idx) => (
              <span key={`r-${idx}`} className="text-[10px] font-medium text-stone-400 bg-white border border-stone-100 px-2 py-1 rounded-md uppercase tracking-wide">
                {region}
              </span>
            ))}
          </div>
          
          {displayUrl && (
            <a 
              href={displayUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium text-stone-900 flex items-center hover:underline opacity-60 hover:opacity-100 transition-opacity"
            >
              {linkLabel} <ExternalLink size={12} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
