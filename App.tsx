
import React, { useState, useEffect } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { GalleryPanel } from './components/GalleryPanel';
import { Message, Gallery, ActivePlan, UserProfile } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'model',
  text: "Hello. I'm HALFART. Tell me where you are headed (e.g. Chelsea, Tribeca) and I'll scan for current exhibitions to suggest.",
  timestamp: Date.now()
};

const INITIAL_PLAN: ActivePlan = {
  date_label: "Today",
  area_description: "My Gallery Tour",
  time_window: { start: "12:00", end: "18:00" },
  selected_gallery_ids: [],
  route: []
};

const INITIAL_PROFILE: UserProfile = {
  home_areas: [],
  preferred_mediums: [],
  preferred_vibes: [],
  default_max_walk_minutes: 20,
  museum_memberships: [],
  program_memberships: [],
  saved_plans: []
};

function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [activePlan, setActivePlan] = useState<ActivePlan>(INITIAL_PLAN);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('halfart_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('halfart_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Pass the active plan and profile to the AI
      const response = await sendMessageToGemini(messages, text, activePlan, userProfile);

      const botMsg: Message = {
        id: uuidv4(),
        role: 'model',
        text: response.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);

      // Process Structured Data Response
      if (response.data) {
        // 1. Update Suggestion Grid
        if (response.data.galleries_to_show) {
          setGalleries(response.data.galleries_to_show);
        }

        // 2. Update Active Plan
        if (response.data.plan) {
          setActivePlan(prev => ({
            ...prev,
            ...response.data!.plan
          }));
        }

        // 3. Update User Profile
        if (response.data.profile) {
          setUserProfile(prev => ({
            ...prev,
            ...response.data!.profile,
            // Preserve saved plans unless explicitly overwritten, though typically the AI returns the full profile object.
            // If the AI returns an empty saved_plans array inadvertently, we should be careful, 
            // but the prompt implies it manages the whole state. For safety, let's assume strict update.
          }));
        }
      }

    } catch (error) {
      console.error("Error sending message", error);
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'model',
        text: "I encountered an error trying to fetch gallery data. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlan = (gallery: Gallery) => {
    setActivePlan(prev => {
      const exists = prev.selected_gallery_ids.includes(gallery.id);
      let newSelectedIds;
      
      if (exists) {
        newSelectedIds = prev.selected_gallery_ids.filter(id => id !== gallery.id);
      } else {
        newSelectedIds = [...prev.selected_gallery_ids, gallery.id];
      }

      // We do not clear the route immediately to avoid UI flashing, but technically 
      // the route is now "stale" until recalculated. 
      return {
        ...prev,
        selected_gallery_ids: newSelectedIds
      };
    });
  };

  const handleRecalculateRoute = () => {
    handleSendMessage("Please analyze my selected galleries and recalculate the optimal route.");
  };

  const handleSavePlan = () => {
    handleSendMessage("Save this plan to my profile.");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-stone-900 overflow-hidden font-sans">
      <ChatPanel 
        messages={messages} 
        isLoading={isLoading} 
        onSendMessage={handleSendMessage} 
      />
      <GalleryPanel 
        galleries={galleries} 
        activePlan={activePlan}
        userProfile={userProfile}
        onTogglePlan={handleTogglePlan}
        onRecalculateRoute={handleRecalculateRoute}
        onSavePlan={handleSavePlan}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
