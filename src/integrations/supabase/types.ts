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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      abandoned_checkouts: {
        Row: {
          amount: number
          attempted_at: string
          email: string | null
          failure_code: string | null
          failure_reason: string | null
          id: string
          phone: string | null
          plan: string
          razorpay_order_id: string | null
          status: string
        }
        Insert: {
          amount: number
          attempted_at?: string
          email?: string | null
          failure_code?: string | null
          failure_reason?: string | null
          id?: string
          phone?: string | null
          plan: string
          razorpay_order_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          attempted_at?: string
          email?: string | null
          failure_code?: string | null
          failure_reason?: string | null
          id?: string
          phone?: string | null
          plan?: string
          razorpay_order_id?: string | null
          status?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          name: string
          phone: string
          template_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          name: string
          phone: string
          template_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          template_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_name: string
          event_photo: string | null
          event_time: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          invitation_id: string
          is_enabled: boolean
          maps_url: string | null
          tagline: string | null
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_name: string
          event_photo?: string | null
          event_time?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          invitation_id: string
          is_enabled?: boolean
          maps_url?: string | null
          tagline?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_name?: string
          event_photo?: string | null
          event_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          invitation_id?: string
          is_enabled?: boolean
          maps_url?: string | null
          tagline?: string | null
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "public_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          bride_bio: string | null
          bride_family: string | null
          bride_full_name: string | null
          bride_name: string | null
          created_at: string
          dresscode_colors: Json | null
          dresscode_enabled: boolean | null
          dresscode_text: string | null
          gallery_photos: Json | null
          gift_registry_url: string | null
          groom_bio: string | null
          groom_family: string | null
          groom_full_name: string | null
          groom_name: string | null
          hero_media_type: string | null
          hero_media_url: string | null
          id: string
          language: Database["public"]["Enums"]["invitation_language"]
          music_url: string | null
          our_story: string | null
          personal_message: string | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["invitation_plan"] | null
          rsvp_deadline: string | null
          slug: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          template_id: string
          updated_at: string
          upi_id: string | null
          user_id: string
          venue_description: string | null
          venue_photo: string | null
          wedding_city: string | null
          wedding_date: string | null
        }
        Insert: {
          bride_bio?: string | null
          bride_family?: string | null
          bride_full_name?: string | null
          bride_name?: string | null
          created_at?: string
          dresscode_colors?: Json | null
          dresscode_enabled?: boolean | null
          dresscode_text?: string | null
          gallery_photos?: Json | null
          gift_registry_url?: string | null
          groom_bio?: string | null
          groom_family?: string | null
          groom_full_name?: string | null
          groom_name?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["invitation_language"]
          music_url?: string | null
          our_story?: string | null
          personal_message?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["invitation_plan"] | null
          rsvp_deadline?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          template_id: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
          venue_description?: string | null
          venue_photo?: string | null
          wedding_city?: string | null
          wedding_date?: string | null
        }
        Update: {
          bride_bio?: string | null
          bride_family?: string | null
          bride_full_name?: string | null
          bride_name?: string | null
          created_at?: string
          dresscode_colors?: Json | null
          dresscode_enabled?: boolean | null
          dresscode_text?: string | null
          gallery_photos?: Json | null
          gift_registry_url?: string | null
          groom_bio?: string | null
          groom_family?: string | null
          groom_full_name?: string | null
          groom_name?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["invitation_language"]
          music_url?: string | null
          our_story?: string | null
          personal_message?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["invitation_plan"] | null
          rsvp_deadline?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          template_id?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
          venue_description?: string | null
          venue_photo?: string | null
          wedding_city?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          email: string | null
          id: string
          plan: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          email?: string | null
          id?: string
          plan: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string | null
          id?: string
          plan?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          guest_count: number
          guest_name: string
          id: string
          invitation_id: string
          meal_preference: Database["public"]["Enums"]["meal_preference"]
          note: string | null
          submitted_at: string
        }
        Insert: {
          guest_count?: number
          guest_name: string
          id?: string
          invitation_id: string
          meal_preference?: Database["public"]["Enums"]["meal_preference"]
          note?: string | null
          submitted_at?: string
        }
        Update: {
          guest_count?: number
          guest_name?: string
          id?: string
          invitation_id?: string
          meal_preference?: Database["public"]["Enums"]["meal_preference"]
          note?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "public_invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_plans: {
        Row: {
          activated_at: string
          created_at: string
          expires_at: string
          id: string
          plan: string
          razorpay_order_id: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          plan: string
          razorpay_order_id?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          plan?: string
          razorpay_order_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          mobile: string | null
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          mobile?: string | null
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          mobile?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_invitations: {
        Row: {
          bride_bio: string | null
          bride_family: string | null
          bride_full_name: string | null
          bride_name: string | null
          created_at: string | null
          dresscode_colors: Json | null
          dresscode_enabled: boolean | null
          dresscode_text: string | null
          gallery_photos: Json | null
          gift_registry_url: string | null
          groom_bio: string | null
          groom_family: string | null
          groom_full_name: string | null
          groom_name: string | null
          hero_media_type: string | null
          hero_media_url: string | null
          id: string | null
          language: Database["public"]["Enums"]["invitation_language"] | null
          music_url: string | null
          our_story: string | null
          personal_message: string | null
          photo_url: string | null
          rsvp_deadline: string | null
          slug: string | null
          status: Database["public"]["Enums"]["invitation_status"] | null
          template_id: string | null
          updated_at: string | null
          venue_description: string | null
          venue_photo: string | null
          wedding_city: string | null
          wedding_date: string | null
        }
        Insert: {
          bride_bio?: string | null
          bride_family?: string | null
          bride_full_name?: string | null
          bride_name?: string | null
          created_at?: string | null
          dresscode_colors?: Json | null
          dresscode_enabled?: boolean | null
          dresscode_text?: string | null
          gallery_photos?: Json | null
          gift_registry_url?: string | null
          groom_bio?: string | null
          groom_family?: string | null
          groom_full_name?: string | null
          groom_name?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          id?: string | null
          language?: Database["public"]["Enums"]["invitation_language"] | null
          music_url?: string | null
          our_story?: string | null
          personal_message?: string | null
          photo_url?: string | null
          rsvp_deadline?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          template_id?: string | null
          updated_at?: string | null
          venue_description?: string | null
          venue_photo?: string | null
          wedding_city?: string | null
          wedding_date?: string | null
        }
        Update: {
          bride_bio?: string | null
          bride_family?: string | null
          bride_full_name?: string | null
          bride_name?: string | null
          created_at?: string | null
          dresscode_colors?: Json | null
          dresscode_enabled?: boolean | null
          dresscode_text?: string | null
          gallery_photos?: Json | null
          gift_registry_url?: string | null
          groom_bio?: string | null
          groom_family?: string | null
          groom_full_name?: string | null
          groom_name?: string | null
          hero_media_type?: string | null
          hero_media_url?: string | null
          id?: string | null
          language?: Database["public"]["Enums"]["invitation_language"] | null
          music_url?: string | null
          our_story?: string | null
          personal_message?: string | null
          photo_url?: string | null
          rsvp_deadline?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["invitation_status"] | null
          template_id?: string | null
          updated_at?: string | null
          venue_description?: string | null
          venue_photo?: string | null
          wedding_city?: string | null
          wedding_date?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      publish_invitation: {
        Args: {
          _invitation_id: string
          _plan: string
          _razorpay_order_id: string
          _slug: string
        }
        Returns: undefined
      }
    }
    Enums: {
      event_type:
        | "mehndi"
        | "haldi"
        | "sangeet"
        | "baraat"
        | "ceremony"
        | "reception"
      invitation_language: "english" | "hindi" | "tamil" | "punjabi" | "urdu"
      invitation_plan: "basic" | "premium" | "elite"
      invitation_status: "draft" | "published"
      meal_preference: "veg" | "non_veg" | "jain" | "no_preference"
      payment_status: "pending" | "success" | "failed"
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
    Enums: {
      event_type: [
        "mehndi",
        "haldi",
        "sangeet",
        "baraat",
        "ceremony",
        "reception",
      ],
      invitation_language: ["english", "hindi", "tamil", "punjabi", "urdu"],
      invitation_plan: ["basic", "premium", "elite"],
      invitation_status: ["draft", "published"],
      meal_preference: ["veg", "non_veg", "jain", "no_preference"],
      payment_status: ["pending", "success", "failed"],
    },
  },
} as const
