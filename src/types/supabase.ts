export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          opportunity_id: string
          creator_id: string
          status: string | null
          cover_letter: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          opportunity_id: string
          creator_id: string
          status?: string | null
          cover_letter?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          opportunity_id?: string
          creator_id?: string
          status?: string | null
          cover_letter?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          user_id: string
          company_name: string
          brand_type: string
          description: string | null
          website: string | null
          instagram: string | null
          location: string | null
          phone_number: string | null
          support_email: string | null
          profile_image_url: string | null
          sms_notifications_enabled: boolean | null
          two_factor_enabled: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          brand_type: string
          description?: string | null
          website?: string | null
          instagram?: string | null
          location?: string | null
          phone_number?: string | null
          support_email?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          two_factor_enabled?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          brand_type?: string
          description?: string | null
          website?: string | null
          instagram?: string | null
          location?: string | null
          phone_number?: string | null
          support_email?: string | null
          profile_image_url?: string | null
          sms_notifications_enabled?: boolean | null
          two_factor_enabled?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      creators: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          location: string | null
          instagram: string | null
          website: string | null
          profile_image_url: string | null
          specialties: string[] | null
          creator_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          location?: string | null
          instagram?: string | null
          website?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          creator_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          location?: string | null
          instagram?: string | null
          website?: string | null
          profile_image_url?: string | null
          specialties?: string[] | null
          creator_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          message_type: string | null
          media_url: string | null
          media_type: string | null
          read: boolean | null
          is_edited: boolean | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          message_type?: string | null
          media_url?: string | null
          media_type?: string | null
          read?: boolean | null
          is_edited?: boolean | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          message_type?: string | null
          media_url?: string | null
          media_type?: string | null
          read?: boolean | null
          is_edited?: boolean | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          brand_id: string
          title: string
          description: string
          requirements: string[] | null
          perks: string[] | null
          deliverables: string[] | null
          location: string | null
          payment_details: string | null
          compensation_details: string | null
          start_date: string | null
          end_date: string | null
          status: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          title: string
          description: string
          requirements?: string[] | null
          perks?: string[] | null
          deliverables?: string[] | null
          location?: string | null
          payment_details?: string | null
          compensation_details?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          title?: string
          description?: string
          requirements?: string[] | null
          perks?: string[] | null
          deliverables?: string[] | null
          location?: string | null
          payment_details?: string | null
          compensation_details?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      typing_status: {
        Row: {
          id: string
          user_id: string
          chat_with: string
          is_typing: boolean | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chat_with: string
          is_typing?: boolean | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_with?: string
          is_typing?: boolean | null
          updated_at?: string
        }
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