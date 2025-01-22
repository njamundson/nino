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
          opportunity_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          opportunity_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          opportunity_id?: string
          status?: string | null
          updated_at?: string | null
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
          id: string
          invitation_status: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          invitation_status?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          invitation_status?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
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
      creators: {
        Row: {
          bio: string | null
          created_at: string
          creator_type: string | null
          id: string
          instagram: string | null
          location: string | null
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
          location?: string | null
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
          location?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
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
          sender_id: string
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
          sender_id: string
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
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          brand_id: string
          compensation_amount: number | null
          compensation_type: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
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
          compensation_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
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
          compensation_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
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
