import { Profile } from './auth';
import { Brand, BrandManager, BrandLoginHistory, BrandNotificationSettings } from './brand';
import { Creator, CreatorProfile } from './creator';
import { Message, MessageProfile, MessageReaction, TypingStatus } from './messaging';
import { Opportunity, Application } from './opportunity';

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id'>>;
      };
      brand_login_history: {
        Row: BrandLoginHistory;
        Insert: Omit<BrandLoginHistory, 'id'>;
        Update: Partial<Omit<BrandLoginHistory, 'id'>>;
      };
      brand_managers: {
        Row: BrandManager;
        Insert: Omit<BrandManager, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BrandManager, 'id'>>;
      };
      brand_notification_settings: {
        Row: BrandNotificationSettings;
        Insert: Omit<BrandNotificationSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BrandNotificationSettings, 'id'>>;
      };
      brands: {
        Row: Brand;
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Brand, 'id'>>;
      };
      creators: {
        Row: Creator;
        Insert: Omit<Creator, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Creator, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Message, 'id'>>;
      };
      message_reactions: {
        Row: MessageReaction;
        Insert: Omit<MessageReaction, 'id' | 'created_at'>;
        Update: Partial<Omit<MessageReaction, 'id'>>;
      };
      opportunities: {
        Row: Opportunity;
        Insert: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Opportunity, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Profile>;
      };
      typing_status: {
        Row: TypingStatus;
        Insert: Omit<TypingStatus, 'id' | 'updated_at'>;
        Update: Partial<Omit<TypingStatus, 'id'>>;
      };
    };
    Views: {
      creator_profiles: {
        Row: CreatorProfile;
      };
      message_profiles: {
        Row: MessageProfile;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];