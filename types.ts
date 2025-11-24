
export interface Exhibition {
  title: string;
  dates: string;
  description: string;
  image_url?: string;
  source?: string;
}

export type GalleryStatus = 'active' | 'inactive' | 'unknown';

export interface Gallery {
  id: string;
  name: string;
  neighborhood: string;
  address?: string;
  lat?: number;
  lng?: number;
  status: GalleryStatus;
  has_active_exhibition: boolean;
  url?: string;
  // While the prompt emphasizes exhibition images, we keep this as a fallback if the AI provides it
  imageUrl?: string; 
  vibes?: string[];
  mediums?: string[];
  exhibitions: Exhibition[];
  in_plan?: boolean;
  reason?: string;
}

export interface PlanRouteStop {
  id: string;
  type: 'gallery' | 'custom';
  gallery_id?: string;
  label?: string; // used for custom stops or gallery name fallback
  neighborhood?: string;
  eta?: string;
  etd?: string;
  walk_minutes_from_previous?: number;
  description?: string;
}

export interface SavedPlan {
  id: string;
  title: string;
  date_label?: string;
  area_description?: string;
  time_window?: { start: string; end: string };
  route: PlanRouteStop[];
  notes?: string;
}

export interface UserProfile {
  home_areas: string[];
  preferred_mediums: string[];
  preferred_vibes: string[];
  default_max_walk_minutes: number;
  museum_memberships: string[];
  program_memberships: string[];
  saved_plans: SavedPlan[];
}

export interface ActivePlan {
  date_label?: string;
  area_description?: string;
  lunch_location?: string;
  time_window: { start: string; end: string };
  selected_gallery_ids: string[];
  route: PlanRouteStop[];
}

export interface HalfartResponse {
  galleries_to_show?: Gallery[];
  plan?: ActivePlan;
  profile?: UserProfile;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
