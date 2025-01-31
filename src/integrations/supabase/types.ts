export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          creator_id: string
          id: string
          initiated_by: string | null
          opportunity_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          initiated_by?: string | null
          opportunity_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          initiated_by?: string | null
          opportunity_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_invitations: {
        Row: {
          brand_id: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invitation_token: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_invitations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_login_history: {
        Row: {
          brand_id: string
          device_info: string | null
          id: string
          ip_address: string | null
          login_timestamp: string | null
        }
        Insert: {
          brand_id: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          login_timestamp?: string | null
        }
        Update: {
          brand_id?: string
          device_info?: string | null
          id?: string
          ip_address?: string | null
          login_timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_login_history_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_managers: {
        Row: {
          brand_id: string
          created_at: string | null
          email: string | null
          id: string
          invitation_status: string | null
          name: string | null
          permissions: string[] | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          invitation_status?: string | null
          name?: string | null
          permissions?: string[] | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          invitation_status?: string | null
          name?: string | null
          permissions?: string[] | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_managers_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_notes: {
        Row: {
          brand_id: string
          completed: boolean | null
          created_at: string | null
          id: string
          text: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          text: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          completed?: boolean | null
          created_at?: string | null
          id?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_notes_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_notification_settings: {
        Row: {
          application_updates: boolean | null
          brand_id: string
          created_at: string | null
          email_enabled: boolean | null
          id: string
          marketing_updates: boolean | null
          message_notifications: boolean | null
          push_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          application_updates?: boolean | null
          brand_id: string
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          message_notifications?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          application_updates?: boolean | null
          brand_id?: string
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          message_notifications?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_notification_settings_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_type: string | null
          company_name: string | null
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          location: string | null
          onboarding_completed: boolean | null
          phone_number: string | null
          profile_image_url: string | null
          sms_notifications_enabled: boolean | null
          support_email: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          brand_type?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          support_email?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          brand_type?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          support_email?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      creator_goals: {
        Row: {
          completed: boolean | null
          created_at: string | null
          creator_id: string
          id: string
          text: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          creator_id: string
          id?: string
          text: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          creator_id?: string
          id?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_goals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_goals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_notes: {
        Row: {
          completed: boolean | null
          created_at: string | null
          creator_id: string
          id: string
          text: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          creator_id: string
          id?: string
          text: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          creator_id?: string
          id?: string
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_notes_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_notes_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          bio: string | null
          created_at: string
          creator_type: string | null
          display_name: string
          id: string
          instagram: string | null
          location: string | null
          notifications_enabled: boolean | null
          onboarding_completed: boolean | null
          profile_id: string | null
          profile_image_url: string | null
          specialties: string[] | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          creator_type?: string | null
          display_name: string
          id?: string
          instagram?: string | null
          location?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          profile_id?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          creator_type?: string | null
          display_name?: string
          id?: string
          instagram?: string | null
          location?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          profile_id?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_fk"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "message_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_message_fk"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "message_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          message_type: string | null
          read: boolean | null
          receiver_id: string
          receiver_profile_id: string | null
          sender_id: string
          sender_profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          read?: boolean | null
          receiver_id: string
          receiver_profile_id?: string | null
          sender_id: string
          sender_profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          read?: boolean | null
          receiver_id?: string
          receiver_profile_id?: string | null
          sender_id?: string
          sender_profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_profile_id_fkey"
            columns: ["receiver_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          brand_id: string
          compensation_amount: number | null
          compensation_details: string | null
          compensation_type: string | null
          created_at: string | null
          deliverables: string[] | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          location: string | null
          payment_details: string | null
          perks: string[] | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          compensation_amount?: number | null
          compensation_details?: string | null
          compensation_type?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          payment_details?: string | null
          perks?: string[] | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          compensation_amount?: number | null
          compensation_details?: string | null
          compensation_type?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          payment_details?: string | null
          perks?: string[] | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          chat_with: string
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chat_with: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chat_with?: string
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      creator_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          creator_type: string | null
          first_name: string | null
          id: string | null
          instagram: string | null
          last_name: string | null
          location: string | null
          profile_id: string | null
          profile_image_url: string | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_profiles: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          media_type: string | null
          media_url: string | null
          message_type: string | null
          read: boolean | null
          receiver_first_name: string | null
          receiver_id: string | null
          receiver_last_name: string | null
          sender_first_name: string | null
          sender_id: string | null
          sender_last_name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_campaign_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_applications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
