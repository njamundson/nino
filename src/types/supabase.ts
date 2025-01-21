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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          updated_at?: string | null
          created_at?: string
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
          sms_notifications_enabled: boolean
          two_factor_enabled: boolean
          created_at: string
          updated_at: string | null
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
          sms_notifications_enabled?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string | null
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
          sms_notifications_enabled?: boolean
          two_factor_enabled?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      creators: {
        Row: {
          id: string
          user_id: string
          bio: string | null
          location: string | null
          specialties: string[]
          instagram: string | null
          website: string | null
          profile_image_url: string | null
          creator_type: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          bio?: string | null
          location?: string | null
          specialties?: string[]
          instagram?: string | null
          website?: string | null
          profile_image_url?: string | null
          creator_type?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          bio?: string | null
          location?: string | null
          specialties?: string[]
          instagram?: string | null
          website?: string | null
          profile_image_url?: string | null
          creator_type?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      opportunities: {
        Row: {
          id: string
          brand_id: string
          title: string
          description: string
          requirements: string[]
          perks: string[]
          deliverables: string[]
          location: string | null
          payment_details: string | null
          compensation_details: string | null
          start_date: string | null
          end_date: string | null
          image_url: string | null
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          brand_id: string
          title: string
          description: string
          requirements: string[]
          perks: string[]
          deliverables: string[]
          location?: string | null
          payment_details?: string | null
          compensation_details?: string | null
          start_date?: string | null
          end_date?: string | null
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          brand_id?: string
          title?: string
          description?: string
          requirements?: string[]
          perks?: string[]
          deliverables?: string[]
          location?: string | null
          payment_details?: string | null
          compensation_details?: string | null
          start_date?: string | null
          end_date?: string | null
          image_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          opportunity_id: string
          creator_id: string
          cover_letter: string | null
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          opportunity_id: string
          creator_id: string
          cover_letter?: string | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          opportunity_id?: string
          creator_id?: string
          cover_letter?: string | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          message_type: string
          media_url: string | null
          media_type: string | null
          read: boolean
          is_edited: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          message_type: string
          media_url?: string | null
          media_type?: string | null
          read?: boolean
          is_edited?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          message_type?: string
          media_url?: string | null
          media_type?: string | null
          read?: boolean
          is_edited?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string | null
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