export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_content: {
        Row: {
          created_at: string
          id: string
          mission: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mission?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mission?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          read_time: number | null
          slug: string
          summary: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug: string
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          read_time?: number | null
          slug?: string
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      crop_applications: {
        Row: {
          benefits: string[] | null
          category: string
          created_at: string
          crop_name: string
          display_order: number | null
          drying_time: string | null
          humidity_range: string | null
          id: string
          image_url: string | null
          roi_percentage: number | null
          temperature_range: string | null
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          category: string
          created_at?: string
          crop_name: string
          display_order?: number | null
          drying_time?: string | null
          humidity_range?: string | null
          id?: string
          image_url?: string | null
          roi_percentage?: number | null
          temperature_range?: string | null
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          category?: string
          created_at?: string
          crop_name?: string
          display_order?: number | null
          drying_time?: string | null
          humidity_range?: string | null
          id?: string
          image_url?: string | null
          roi_percentage?: number | null
          temperature_range?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crop_profiles: {
        Row: {
          created_at: string
          crop_name: string
          description: string | null
          estimated_hours: number
          id: string
          optimal_humidity_max: number
          optimal_temp_max: number
          optimal_temp_min: number
        }
        Insert: {
          created_at?: string
          crop_name: string
          description?: string | null
          estimated_hours: number
          id?: string
          optimal_humidity_max: number
          optimal_temp_max: number
          optimal_temp_min: number
        }
        Update: {
          created_at?: string
          crop_name?: string
          description?: string | null
          estimated_hours?: number
          id?: string
          optimal_humidity_max?: number
          optimal_temp_max?: number
          optimal_temp_min?: number
        }
        Relationships: []
      }
      drying_sessions: {
        Row: {
          created_at: string
          crop_type: string
          end_time: string | null
          estimated_completion: string | null
          id: string
          initial_moisture: number | null
          mode: string
          power_mode: string
          start_time: string | null
          status: string
          target_temperature: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_type: string
          end_time?: string | null
          estimated_completion?: string | null
          id?: string
          initial_moisture?: number | null
          mode?: string
          power_mode?: string
          start_time?: string | null
          status?: string
          target_temperature?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_type?: string
          end_time?: string | null
          estimated_completion?: string | null
          id?: string
          initial_moisture?: number | null
          mode?: string
          power_mode?: string
          start_time?: string | null
          status?: string
          target_temperature?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      home_content: {
        Row: {
          created_at: string
          cta_primary_text: string | null
          cta_secondary_text: string | null
          headline: string
          hero_video_url: string | null
          id: string
          subtext: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          headline: string
          hero_video_url?: string | null
          id?: string
          subtext?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          headline?: string
          hero_video_url?: string | null
          id?: string
          subtext?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impact_metrics: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          metric_key: string
          metric_label: string
          metric_unit: string | null
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          metric_key: string
          metric_label: string
          metric_unit?: string | null
          metric_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          metric_key?: string
          metric_label?: string
          metric_unit?: string | null
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      pilot_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          crop_types: string[] | null
          email: string
          farm_size: string | null
          full_name: string
          id: string
          location: string
          message: string | null
          organization: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          crop_types?: string[] | null
          email: string
          farm_size?: string | null
          full_name: string
          id?: string
          location: string
          message?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          crop_types?: string[] | null
          email?: string
          farm_size?: string | null
          full_name?: string
          id?: string
          location?: string
          message?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          created_at: string
          current: number | null
          energy: number | null
          frequency: number | null
          humidity_bottom: number | null
          humidity_top: number | null
          id: string
          light_intensity: number | null
          moisture_level: number | null
          power: number | null
          power_factor: number | null
          session_id: string | null
          temp_bottom: number | null
          temp_top: number | null
          timestamp: string
          voc_level: number | null
          voltage: number | null
        }
        Insert: {
          created_at?: string
          current?: number | null
          energy?: number | null
          frequency?: number | null
          humidity_bottom?: number | null
          humidity_top?: number | null
          id?: string
          light_intensity?: number | null
          moisture_level?: number | null
          power?: number | null
          power_factor?: number | null
          session_id?: string | null
          temp_bottom?: number | null
          temp_top?: number | null
          timestamp?: string
          voc_level?: number | null
          voltage?: number | null
        }
        Update: {
          created_at?: string
          current?: number | null
          energy?: number | null
          frequency?: number | null
          humidity_bottom?: number | null
          humidity_top?: number | null
          id?: string
          light_intensity?: number | null
          moisture_level?: number | null
          power?: number | null
          power_factor?: number | null
          session_id?: string | null
          temp_bottom?: number | null
          temp_top?: number | null
          timestamp?: string
          voc_level?: number | null
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "drying_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stories_testimonials: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          name: string
          quote: string
          role: string | null
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          name: string
          quote: string
          role?: string | null
          type: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          name?: string
          quote?: string
          role?: string | null
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          discord_username: string | null
          display_order: number | null
          email: string | null
          expertise: string | null
          github_url: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          title: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          discord_username?: string | null
          display_order?: number | null
          email?: string | null
          expertise?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          title: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          discord_username?: string | null
          display_order?: number | null
          email?: string | null
          expertise?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          title?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      technology_content: {
        Row: {
          created_at: string
          description: string
          display_order: number | null
          features: Json | null
          id: string
          image_url: string | null
          section_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number | null
          features?: Json | null
          id?: string
          image_url?: string | null
          section_key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number | null
          features?: Json | null
          id?: string
          image_url?: string | null
          section_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string
          display_order: number | null
          id: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
