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
          created_at: string
          creator_id: string | null
          id: string
          opportunity_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          opportunity_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          creator_id?: string | null
          id?: string
          opportunity_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
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
      brand_login_history: {
        Row: {
          brand_id: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          location: string | null
          login_timestamp: string | null
        }
        Insert: {
          brand_id?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_timestamp?: string | null
        }
        Update: {
          brand_id?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
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
          brand_id: string | null
          created_at: string
          email: string
          id: string
          invitation_status: string | null
          invitation_token: string | null
          invited_at: string | null
          name: string
          permissions: string[] | null
          role: string
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          email: string
          id?: string
          invitation_status?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          name: string
          permissions?: string[] | null
          role: string
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          email?: string
          id?: string
          invitation_status?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          name?: string
          permissions?: string[] | null
          role?: string
          updated_at?: string
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
      brand_notification_settings: {
        Row: {
          application_updates: boolean | null
          brand_id: string | null
          created_at: string
          email_enabled: boolean | null
          id: string
          marketing_updates: boolean | null
          message_notifications: boolean | null
          push_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          application_updates?: boolean | null
          brand_id?: string | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          message_notifications?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          application_updates?: boolean | null
          brand_id?: string | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          marketing_updates?: boolean | null
          message_notifications?: boolean | null
          push_enabled?: boolean | null
          updated_at?: string
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
          brand_type: Database["public"]["Enums"]["brand_type"]
          company_name: string
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          location: string | null
          phone_number: string | null
          profile_image_url: string | null
          sms_notifications_enabled: boolean | null
          support_email: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          brand_type: Database["public"]["Enums"]["brand_type"]
          company_name: string
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          support_email?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          brand_type?: Database["public"]["Enums"]["brand_type"]
          company_name?: string
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          support_email?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      creator_verifications: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          creator_id: string | null
          government_id_url: string | null
          id: string
          instagram_handle: string | null
          portfolio_url: string | null
          profile_photo_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          submitted_at: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          creator_id?: string | null
          government_id_url?: string | null
          id?: string
          instagram_handle?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          creator_id?: string | null
          government_id_url?: string | null
          id?: string
          instagram_handle?: string | null
          portfolio_url?: string | null
          profile_photo_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_verifications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_verifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          bio: string | null
          created_at: string
          creator_type: string | null
          id: string
          instagram: string | null
          is_verified: boolean | null
          location: string | null
          profile_id: string
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
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          location?: string | null
          profile_id: string
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
          id?: string
          instagram?: string | null
          is_verified?: boolean | null
          location?: string | null
          profile_id?: string
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
            isOneToOne: true
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
          message_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_edited: boolean | null
          media_type: string | null
          media_url: string | null
          message_type: string | null
          pinned: boolean | null
          read: boolean | null
          receiver_id: string | null
          reply_to: string | null
          sender_id: string | null
          status: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_edited?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          pinned?: boolean | null
          read?: boolean | null
          receiver_id?: string | null
          reply_to?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_edited?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          pinned?: boolean | null
          read?: boolean | null
          receiver_id?: string | null
          reply_to?: string | null
          sender_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          brand_id: string | null
          compensation_details: string | null
          created_at: string
          deliverables: string[] | null
          description: string
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
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          compensation_details?: string | null
          created_at?: string
          deliverables?: string[] | null
          description: string
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
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          compensation_details?: string | null
          created_at?: string
          deliverables?: string[] | null
          description?: string
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
          updated_at?: string
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
          first_name: string
          id: string
          is_admin: boolean | null
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          is_admin?: boolean | null
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          is_admin?: boolean | null
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          chat_with: string | null
          id: string
          is_typing: boolean | null
          last_updated: string | null
          user_id: string | null
        }
        Insert: {
          chat_with?: string | null
          id?: string
          is_typing?: boolean | null
          last_updated?: string | null
          user_id?: string | null
        }
        Update: {
          chat_with?: string | null
          id?: string
          is_typing?: boolean | null
          last_updated?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_status_chat_with_fkey"
            columns: ["chat_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          id: string
          is_online: boolean | null
          last_seen: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          verification_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          verification_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          verification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_history_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "creator_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_analytics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          total_brands: number
          total_creators: number
          total_opportunities: number
          total_applications: number
          pending_applications: number
          pending_verifications: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected"
      brand_type: "hotel" | "resort" | "travel_agency"
      opportunity_status: "draft" | "open" | "closed" | "expired"
      verification_status: "pending" | "approved" | "rejected"
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
