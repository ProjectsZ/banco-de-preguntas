
export interface Publicity {
    pub_id: string; // UUID
    pub_title: string;
    pub_description?: string;
    pub_data?: { img: string; url: string };
    pub_type: 'banner' | 'popup' | 'video' | 'promo' | any; // Puedes extender estos valores
    pub_position: 'inicio' | 'sidebar' | 'footer' | string;
    pub_audience?: string[]; // Representa jsonb de tipo array
    pub_priority?: number;
    pub_start?: string; // ISO 8601 string (ej. "2025-05-01T00:00:00")
    pub_end?: string;
    pub_is_active: boolean;
    pub_clicks?: number;
    pub_views?: number;
    created_at?: string;
  }