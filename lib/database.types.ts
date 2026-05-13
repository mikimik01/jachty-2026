export type Database = {
  public: {
    Tables: {
      trip_config: {
        Row: {
          id: string;
          departure_date: string;
          return_date: string;
          location: string;
          total_people: number;
          boat_model: string;
          boat_count: number;
          show_boats: boolean;
          show_costs: boolean;
          show_payments: boolean;
          show_announcements: boolean;
          show_survey: boolean;
          created_at: string;
        };
        Insert: {
          departure_date: string;
          return_date: string;
          location: string;
          total_people: number;
          boat_model: string;
          boat_count: number;
          show_boats?: boolean;
          show_costs?: boolean;
          show_payments?: boolean;
          show_announcements?: boolean;
          show_survey?: boolean;
        };
        Update: {
          departure_date?: string;
          return_date?: string;
          location?: string;
          total_people?: number;
          boat_model?: string;
          boat_count?: number;
          show_boats?: boolean;
          show_costs?: boolean;
          show_payments?: boolean;
          show_announcements?: boolean;
          show_survey?: boolean;
        };
      };
      boats: {
        Row: {
          id: string;
          name: string;
          model: string;
          color: string;
          emoji: string;
          max_crew: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          model?: string;
          color?: string;
          emoji?: string;
          max_crew?: number;
          sort_order?: number;
        };
        Update: {
          name?: string;
          model?: string;
          color?: string;
          emoji?: string;
          max_crew?: number;
          sort_order?: number;
        };
      };
      people: {
        Row: {
          id: string;
          name: string;
          boat_id: string | null;
          is_captain: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          boat_id?: string | null;
          is_captain?: boolean;
        };
        Update: {
          name?: string;
          boat_id?: string | null;
          is_captain?: boolean;
        };
      };
      costs: {
        Row: {
          id: string;
          name: string;
          total_cost: number;
          icon: string;
          description: string;
          is_refundable: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          total_cost: number;
          icon?: string;
          description?: string;
          is_refundable?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          total_cost?: number;
          icon?: string;
          description?: string;
          is_refundable?: boolean;
          sort_order?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          person_id: string;
          amount: number;
          note: string | null;
          paid_at: string;
          created_at: string;
        };
        Insert: {
          person_id: string;
          amount: number;
          note?: string | null;
          paid_at?: string;
        };
        Update: {
          person_id?: string;
          amount?: number;
          note?: string | null;
          paid_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          author: string;
          type: "info" | "warning" | "success";
          pinned: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: {
          title: string;
          content: string;
          author?: string;
          type?: "info" | "warning" | "success";
          pinned?: boolean;
          published_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          author?: string;
          type?: "info" | "warning" | "success";
          pinned?: boolean;
          published_at?: string;
        };
      };
    };
  };
};
